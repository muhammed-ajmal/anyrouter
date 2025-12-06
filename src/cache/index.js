// ============ Cache Management ============

import { CONFIG_CACHE_TTL_MS, CACHE_KEY } from '../config.js'
import { getRedisClient } from './redis.js'

// Memory cache
let configCache = { value: null, expiresAt: 0 }

/**
 * Gets the cached configuration from memory.
 * @returns {Record<string, any>|null} The cached configuration, or null if expired.
 */
export function getCachedConfig() {
  if (configCache.value && configCache.expiresAt > Date.now()) {
    return configCache.value
  }
  return null
}

/**
 * Sets the configuration in the memory cache.
 * @param {Record<string, any>} config - The configuration object.
 */
export function setConfigCache(config) {
  configCache = {
    value: config,
    expiresAt: Date.now() + CONFIG_CACHE_TTL_MS,
  }
}

/**
 * Invalidates the memory cache.
 */
export function invalidateConfigCache() {
  configCache = { value: null, expiresAt: 0 }
}

/**
 * Invalidates all caches (memory, Redis, and KV).
 * @param {object} env - The environment variables.
 */
export async function invalidateAllCache(env) {
  configCache = { value: null, expiresAt: 0 }

  // Clear Redis cache
  const redis = getRedisClient(env)
  if (redis) {
    try {
      await redis.del(CACHE_KEY)
    } catch {
      // Ignore errors
    }
  }

  // Clear KV cache (backup)
  if (env && env.CONFIG_KV) {
    try {
      await env.CONFIG_KV.delete(CACHE_KEY)
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Warms up the cache by forcing a load from the database and writing to all cache layers.
 * @param {object} env - The environment variables.
 * @returns {Promise<{success: boolean, cached: string[], error?: string}>}
 */
export async function warmupCache(env) {
  const result = { success: false, cached: [], keysCount: 0 }

  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return { ...result, error: 'Database not configured' }
  }

  try {
    // 1. Fetch the latest data from the database
    let response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/api_configs?select=*&deleted_at=is.null&order=created_at.desc`,
      {
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: `Bearer ${env.SUPABASE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/api_configs?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: env.SUPABASE_KEY,
            Authorization: `Bearer ${env.SUPABASE_KEY}`,
          },
        }
      )
    }

    if (!response.ok) {
      return { ...result, error: `Database query failed: HTTP ${response.status}` }
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
        token: item.token,
        enabled: item.enabled,
        remark: item.remark || '',
        created_at: item.created_at,
        updated_at: item.updated_at,
      })
    })

    result.keysCount = data.length

    // 2. Write to memory cache
    setConfigCache(config)
    result.cached.push('memory')

    // 3. Write to Redis cache
    const redis = getRedisClient(env)
    if (redis) {
      try {
        const { REDIS_CACHE_TTL_SECONDS } = await import('../config.js')
        await redis.set(CACHE_KEY, JSON.stringify(config), REDIS_CACHE_TTL_SECONDS)
        result.cached.push('redis')
      } catch (e) {
        result.redisError = e.message
      }
    }

    // 4. Write to KV cache
    if (env.CONFIG_KV) {
      try {
        const { KV_CACHE_TTL_SECONDS } = await import('../config.js')
        await env.CONFIG_KV.put(CACHE_KEY, JSON.stringify(config), {
          expirationTtl: KV_CACHE_TTL_SECONDS,
        })
        result.cached.push('kv')
      } catch (e) {
        result.kvError = e.message
      }
    }

    result.success = true
    return result
  } catch (error) {
    return { ...result, error: error.message }
  }
}
