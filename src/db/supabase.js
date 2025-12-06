// ============ Supabase Database Operations ============

import {
  FALLBACK_CONFIG,
  CACHE_KEY,
  REDIS_CACHE_TTL_SECONDS,
  KV_CACHE_TTL_SECONDS,
} from '../config.js'
import { getCachedConfig, setConfigCache, invalidateAllCache } from '../cache/index.js'
import { getRedisClient } from '../cache/redis.js'

// Wrapper function: Clears all caches (Memory + Redis + KV)
async function clearAllCache(env) {
  await invalidateAllCache(env)
}

/**
 * Get configuration from Supabase (with multi-level caching support)
 * Cache priority: Memory (10min) -> Redis (5min) -> KV (5min, backup) -> Database
 */
export async function getConfigFromDB(env) {
  // 1. Prioritize returning from memory cache (fastest, ~0ms)
  const memoryCached = getCachedConfig()
  if (memoryCached) {
    return memoryCached
  }

  // 2. Try to fetch from Redis cache (recommended, ~5-20ms)
  const redis = getRedisClient(env)
  if (redis) {
    try {
      const redisCached = await redis.get(CACHE_KEY)
      if (redisCached) {
        const parsed = JSON.parse(redisCached)
        setConfigCache(parsed)
        return parsed
      }
    } catch {
      // Redis read failed, continue
    }
  }

  // 3. Try to fetch from KV cache (backup, ~1-5ms)
  if (env.CONFIG_KV) {
    try {
      const kvCached = await env.CONFIG_KV.get(CACHE_KEY, { type: 'json' })
      if (kvCached) {
        setConfigCache(kvCached)
        return kvCached
      }
    } catch {
      // KV read failed, continue
    }
  }

  // 4. Return fallback if no database is configured
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    setConfigCache(FALLBACK_CONFIG)
    return FALLBACK_CONFIG
  }

  // 5. Query from the database (slowest, ~50-200ms)
  try {
    // First, attempt a query with soft-delete filtering
    let response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/api_configs?select=*&deleted_at=is.null&order=created_at.desc`,
      {
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
        },
      },
    )

    // If the query fails (e.g., deleted_at column doesn't exist), fall back to a query without the filter
    if (!response.ok) {
      response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/api_configs?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: env.SUPABASE_KEY,
            Authorization: `Bearer ${env.SUPABASE_KEY}`,
          },
        },
      )
    }

    if (!response.ok) {
      setConfigCache(FALLBACK_CONFIG)
      return FALLBACK_CONFIG
    }

    const data = await response.json()
    const config = {}

    data.forEach((item) => {
      if (!config[item.api_url]) {
        config[item.api_url] = { keys: [] }
      }
      config[item.api_url].keys.push({
        id: item.id,
        key_id: item.key_id,
        sk_alias: item.sk_alias || null,
        token: item.token,
        enabled: item.enabled,
        remark: item.remark || '',
        expires_at: item.expires_at || null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })
    })

    const finalizedConfig = Object.keys(config).length > 0 ? config : FALLBACK_CONFIG

    // Write to memory cache
    setConfigCache(finalizedConfig)

    // Write to Redis cache asynchronously (does not block the response)
    if (redis) {
      redis.set(CACHE_KEY, JSON.stringify(finalizedConfig), REDIS_CACHE_TTL_SECONDS)
        .catch(() => {})
    }

    // Write to KV cache asynchronously (backup)
    if (env.CONFIG_KV) {
      env.CONFIG_KV.put(CACHE_KEY, JSON.stringify(finalizedConfig), {
        expirationTtl: KV_CACHE_TTL_SECONDS,
      }).catch(() => {})
    }

    return finalizedConfig
  } catch {
    setConfigCache(FALLBACK_CONFIG)
    return FALLBACK_CONFIG
  }
}

/**
 * Save configuration to the database
 */
export async function saveConfigToDB(env, apiUrl, token, enabled, remark = '', expiresAt = null) {
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/api_configs`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_KEY,
        Authorization: `Bearer ${env.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        api_url: apiUrl,
        token: token,
        enabled: enabled,
        remark: remark || null,
        expires_at: expiresAt || null,
      }),
    })

    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    await clearAllCache(env)
    return { success: true, data: await response.json() }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Update configuration in the database
 */
export async function updateConfigInDB(env, id, updates) {
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    // Add update timestamp
    const data = { ...updates, updated_at: new Date().toISOString() }

    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/api_configs?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    await clearAllCache(env)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Soft-delete a configuration (sets deleted_at instead of physically deleting)
 */
export async function deleteConfigFromDB(env, id) {
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return { success: false, error: 'Database not configured' }
  }

  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/api_configs?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleted_at: new Date().toISOString(),
        }),
      }
    )

    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    await clearAllCache(env)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Generate an SK alias.
 * Format: sk-ar-[32 random characters]
 * Similar to OpenAI's sk-xxx format.
 */
export function generateSkAlias() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'sk-ar-'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Update the SK alias for a configuration.
 * @param {object} env - Environment variables.
 * @param {number} id - The configuration ID.
 * @param {string|null} skAlias - The SK alias (or null to generate a new one).
 */
export async function updateSkAlias(env, id, skAlias = null) {
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return { success: false, error: 'Database not configured' }
  }

  const newAlias = skAlias === null ? generateSkAlias() : skAlias

  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/api_configs?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          sk_alias: newAlias,
          updated_at: new Date().toISOString(),
        }),
      }
    )

    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    await clearAllCache(env)
    return { success: true, sk_alias: newAlias }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Find a configuration by its SK alias.
 * @param {object} config - The configuration object.
 * @param {string} skAlias - The SK alias.
 * @returns {{ apiUrl: string, key: object } | null}
 */
export function findBySkAlias(config, skAlias) {
  for (const [apiUrl, apiConfig] of Object.entries(config)) {
    if (!apiConfig.keys) continue
    const key = apiConfig.keys.find(k => k.sk_alias === skAlias)
    if (key) {
      return { apiUrl, key }
    }
  }
  return null
}

/**
 * Get a random enabled key from the configuration for a specific URL.
 */
export function getRandomEnabledKey(config, apiUrl) {
  const apiConfig = config[apiUrl]
  if (!apiConfig || !apiConfig.keys) {
    return null
  }

  // Filter for all enabled keys
  const enabledKeys = apiConfig.keys.filter((key) => key.enabled)

  if (enabledKeys.length === 0) {
    return null
  }

  // Randomly select one of the enabled keys
  const randomIndex = Math.floor(Math.random() * enabledKeys.length)
  return enabledKeys[randomIndex].token
}
