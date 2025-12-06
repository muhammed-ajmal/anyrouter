// ============ API Route Handling ============

import { verifyAdmin, validateConfigPayload, jsonResponse } from '../utils/helpers.js'
import {
  getConfigFromDB,
  saveConfigToDB,
  updateConfigInDB,
  deleteConfigFromDB,
  updateSkAlias,
} from '../db/supabase.js'
import { getStats, getLastUsedTimes, recordLogin, getLoginRecords, blockIp, unblockIp, getBlockedIps } from '../cache/stats.js'
import { getRedisClient } from '../cache/redis.js'
import { warmupCache } from '../cache/index.js'

/**
 * Handles API requests.
 */
export async function handleApiRequest(request, env, url) {
  // Verify administrator privileges
  if (!verifyAdmin(request, env)) {
    return jsonResponse({ error: 'Unauthorized' }, 401)
  }

  const path = url.pathname

  // GET /api/configs - Get all configurations
  if (path === '/api/configs' && request.method === 'GET') {
    const config = await getConfigFromDB(env)
    const lastUsed = await getLastUsedTimes(env)
    return jsonResponse({ success: true, data: config, lastUsed })
  }

  // POST /api/configs - Add a new configuration
  if (path === '/api/configs' && request.method === 'POST') {
    const body = await request.json()
    const validation = validateConfigPayload(body)
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400)
    }
    const result = await saveConfigToDB(
      env,
      body.api_url,
      body.token,
      body.enabled ?? true,
      body.remark || '',
      body.expires_at || null
    )
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // PATCH /api/configs/:id - Update a configuration
  if (path.match(/^\/api\/configs\/\d+$/) && request.method === 'PATCH') {
    const id = path.split('/').pop()
    const body = await request.json()
    const validation = validateConfigPayload(body, { partial: true })
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400)
    }
    const result = await updateConfigInDB(env, id, body)
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // DELETE /api/configs/:id - Delete a configuration
  if (path.match(/^\/api\/configs\/\d+$/) && request.method === 'DELETE') {
    const id = path.split('/').pop()
    const result = await deleteConfigFromDB(env, id)
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // POST /api/configs/:id/sk-alias - Generate or update an SK alias
  if (path.match(/^\/api\/configs\/\d+\/sk-alias$/) && request.method === 'POST') {
    const id = path.split('/')[3]
    const result = await updateSkAlias(env, id)
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // DELETE /api/configs/:id/sk-alias - Delete an SK alias
  if (path.match(/^\/api\/configs\/\d+\/sk-alias$/) && request.method === 'DELETE') {
    const id = path.split('/')[3]
    const result = await updateSkAlias(env, id, '')
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // GET /api/status - Get system status (storage mode, database connection)
  if (path === '/api/status' && request.method === 'GET') {
    const hasDbConfig = Boolean(env.SUPABASE_URL && env.SUPABASE_KEY)
    const result = {
      success: true,
      storage_mode: hasDbConfig ? 'database' : 'passthrough',
      database_configured: hasDbConfig,
      database_connected: false,
    }

    if (hasDbConfig) {
      // Test database connection
      try {
        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/api_configs?select=count&limit=1`,
          {
            headers: {
              apikey: env.SUPABASE_KEY,
              Authorization: `Bearer ${env.SUPABASE_KEY}`,
            },
          }
        )
        result.database_connected = response.ok
        if (!response.ok) {
          result.database_error = `HTTP ${response.status}`
        }
      } catch (error) {
        result.database_connected = false
        result.database_error = error.message
      }
    }

    return jsonResponse(result)
  }

  // POST /api/login - Record login (called by frontend after successful verification)
  if (path === '/api/login' && request.method === 'POST') {
    await recordLogin(env, request)
    return jsonResponse({ success: true })
  }

  // GET /api/logins - Get login records
  if (path === '/api/logins' && request.method === 'GET') {
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const records = await getLoginRecords(env, limit)
    return jsonResponse({ success: true, data: records })
  }

  // GET /api/stats - Get request statistics
  if (path === '/api/stats' && request.method === 'GET') {
    const days = parseInt(url.searchParams.get('days') || '7')
    const stats = await getStats(env, days)
    return jsonResponse({ success: true, data: stats })
  }

  // ============ IP Blacklist API ============

  // GET /api/blacklist - Get the blacklist
  if (path === '/api/blacklist' && request.method === 'GET') {
    const blockedIps = await getBlockedIps(env)
    return jsonResponse({ success: true, data: blockedIps })
  }

  // POST /api/blacklist - Add an IP to the blacklist
  if (path === '/api/blacklist' && request.method === 'POST') {
    const body = await request.json()
    if (!body.ip) {
      return jsonResponse({ error: 'IP address is required' }, 400)
    }
    const result = await blockIp(env, body.ip, body.reason || 'Manual block')
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // DELETE /api/blacklist/:ip - Remove an IP from the blacklist
  if (path.startsWith('/api/blacklist/') && request.method === 'DELETE') {
    const ip = decodeURIComponent(path.replace('/api/blacklist/', ''))
    if (!ip) {
      return jsonResponse({ error: 'IP address is required' }, 400)
    }
    const result = await unblockIp(env, ip)
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // GET /api/redis/test - Test Redis connection
  if (path === '/api/redis/test' && request.method === 'GET') {
    const redis = getRedisClient(env)
    if (!redis) {
      return jsonResponse({
        success: false,
        configured: false,
        error: 'Redis not configured (missing UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN)'
      })
    }

    try {
      const testKey = 'anyrouter:test:ping'
      const testValue = Date.now().toString()

      // Test write
      await redis.set(testKey, testValue, 60)

      // Test read
      const readValue = await redis.get(testKey)

      // Test delete
      await redis.del(testKey)

      return jsonResponse({
        success: true,
        configured: true,
        connected: true,
        latency_test: readValue === testValue ? 'passed' : 'failed',
        message: 'Redis connection successful'
      })
    } catch (error) {
      return jsonResponse({
        success: false,
        configured: true,
        connected: false,
        error: error.message
      })
    }
  }

  // POST /api/cache/warmup - Warm up the cache (load from DB to Redis/KV/memory)
  if (path === '/api/cache/warmup' && request.method === 'POST') {
    const result = await warmupCache(env)
    return jsonResponse(result, result.success ? 200 : 400)
  }

  // POST /api/stats/test - Test stats recording function (writes directly to Redis)
  if (path === '/api/stats/test' && request.method === 'POST') {
    const redis = getRedisClient(env)
    if (!redis) {
      return jsonResponse({ success: false, error: 'Redis not configured' })
    }

    const today = new Date().toISOString().split('T')[0]
    const key = `anyrouter:stats:daily:${today}:total`

    try {
      // Directly test INCR command
      const result = await redis.request(['INCR', key])
      // Set expiration time
      await redis.request(['EXPIRE', key, 604800])
      return jsonResponse({
        success: true,
        message: 'Write successful',
        key: key,
        newValue: result
      })
    } catch (error) {
      return jsonResponse({ success: false, error: error.message, stack: error.stack })
    }
  }

  return jsonResponse({ error: 'Not found' }, 404)
}
