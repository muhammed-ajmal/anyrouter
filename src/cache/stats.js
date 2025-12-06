// ============ Redis Request Statistics & IP Blacklist ============

import { getRedisClient } from './redis.js'

// Statistics Key Prefix
const STATS_PREFIX = 'anyrouter:stats'
const BLACKLIST_KEY = 'anyrouter:blacklist:ips'

// Statistics Sampling Configuration
// STATS_SAMPLE_PERCENT: Sampling percentage (1-100)
//   100 = 100% Record every request (default, accurate but more Redis calls)
//   10 = 10% Record only 1/10 of requests (stats are multiplied by 10 to compensate)
//   1 = 1% Record only 1/100 of requests (recommended for high-traffic scenarios)
const STATS_SAMPLE_PERCENT = 100

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get the current hour string (YYYY-MM-DD-HH)
 */
function getHourKey() {
  const now = new Date()
  return `${now.toISOString().split('T')[0]}-${now.getUTCHours().toString().padStart(2, '0')}`
}

/**
 * Record request statistics (optimized with sampling to reduce Redis calls)
 * @param {object} env - Environment variables
 * @param {object} data - Request data: { apiUrl, keyId, success, ip }
 */
export async function recordRequest(env, data) {
  const redis = getRedisClient(env)
  if (!redis) return

  // Sampling logic: record only if a random number is less than the sample percentage
  // e.g., if STATS_SAMPLE_PERCENT=10, only 10% of requests are recorded
  const shouldRecord = Math.random() * 100 < STATS_SAMPLE_PERCENT
  if (!shouldRecord) return

  // Multiplier: used to extrapolate the true total from the sample
  // e.g., with 10% sampling, each recorded event adds 10 to estimate the real total
  const multiplier = Math.round(100 / STATS_SAMPLE_PERCENT)

  const { apiUrl, keyId, success, ip } = data
  const today = getTodayKey()
  const hour = getHourKey()

  try {
    // Basic stats (recorded on every sample)
    await redis.request(['INCRBY', `${STATS_PREFIX}:daily:${today}:total`, multiplier])
    await redis.request(['INCRBY', `${STATS_PREFIX}:daily:${today}:${success ? 'success' : 'error'}`, multiplier])
    await redis.request(['INCRBY', `${STATS_PREFIX}:hourly:${hour}:total`, multiplier])

    // URL stats
    if (apiUrl) {
      await redis.request(['HINCRBY', `${STATS_PREFIX}:daily:${today}:urls`, apiUrl, multiplier])
    }

    // Key stats
    if (keyId) {
      await redis.request(['HINCRBY', `${STATS_PREFIX}:daily:${today}:keys`, keyId, multiplier])
      await redis.request(['HSET', `${STATS_PREFIX}:lastused`, keyId, new Date().toISOString()])
    }

    // IP stats
    if (ip && ip !== 'unknown') {
      await redis.request(['HINCRBY', `${STATS_PREFIX}:daily:${today}:ips`, ip, multiplier])
    }

    // Set expiration (7 days)
    const ttl = 7 * 24 * 60 * 60
    await redis.request(['EXPIRE', `${STATS_PREFIX}:daily:${today}:total`, ttl])
    await redis.request(['EXPIRE', `${STATS_PREFIX}:hourly:${hour}:total`, ttl])
  } catch {
    // Stat recording failures should not affect the main flow
  }
}

/**
 * Get statistics data
 * @param {object} env - Environment variables
 * @param {number} days - Number of days to query (default 7)
 */
export async function getStats(env, days = 7) {
  const redis = getRedisClient(env)
  if (!redis) {
    return { enabled: false, message: 'Redis not configured' }
  }

  try {
    const stats = {
      enabled: true,
      daily: [],
      hourly: [],
      topUrls: {},
      topKeys: {},
      topIps: {},
      summary: { total: 0, success: 0, error: 0 },
    }

    // Get data for the last N days
    const dates = []
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }

    // Query daily data
    for (const date of dates) {
      const total = await redis.get(`${STATS_PREFIX}:daily:${date}:total`) || 0
      const success = await redis.get(`${STATS_PREFIX}:daily:${date}:success`) || 0
      const error = await redis.get(`${STATS_PREFIX}:daily:${date}:error`) || 0

      stats.daily.push({
        date,
        total: parseInt(total),
        success: parseInt(success),
        error: parseInt(error),
      })

      stats.summary.total += parseInt(total)
      stats.summary.success += parseInt(success)
      stats.summary.error += parseInt(error)
    }

    // Get today's top URLs
    const today = getTodayKey()
    const urlStats = await redis.request(['HGETALL', `${STATS_PREFIX}:daily:${today}:urls`])
    if (urlStats && Array.isArray(urlStats)) {
      for (let i = 0; i < urlStats.length; i += 2) {
        stats.topUrls[urlStats[i]] = parseInt(urlStats[i + 1])
      }
    }

    // Get today's top Keys
    const keyStats = await redis.request(['HGETALL', `${STATS_PREFIX}:daily:${today}:keys`])
    if (keyStats && Array.isArray(keyStats)) {
      for (let i = 0; i < keyStats.length; i += 2) {
        stats.topKeys[keyStats[i]] = parseInt(keyStats[i + 1])
      }
    }

    // Get today's top IPs
    const ipStats = await redis.request(['HGETALL', `${STATS_PREFIX}:daily:${today}:ips`])
    if (ipStats && Array.isArray(ipStats)) {
      for (let i = 0; i < ipStats.length; i += 2) {
        stats.topIps[ipStats[i]] = parseInt(ipStats[i + 1])
      }
    }

    // Get data for the last 24 hours
    for (let i = 0; i < 24; i++) {
      const d = new Date()
      d.setHours(d.getHours() - i)
      const hourKey = `${d.toISOString().split('T')[0]}-${d.getUTCHours().toString().padStart(2, '0')}`
      const hourTotal = await redis.get(`${STATS_PREFIX}:hourly:${hourKey}:total`) || 0
      stats.hourly.push({
        hour: hourKey,
        total: parseInt(hourTotal),
      })
    }

    stats.daily.reverse() // Sort in chronological order
    stats.hourly.reverse()

    return stats
  } catch (error) {
    return { enabled: false, error: error.message }
  }
}

/**
 * Get the last used time for all keys
 * @param {object} env - Environment variables
 * @returns {Promise<Record<string, string>>} A map of keyId to ISO timestamp string
 */
export async function getLastUsedTimes(env) {
  const redis = getRedisClient(env)
  if (!redis) return {}

  try {
    const result = await redis.request(['HGETALL', `${STATS_PREFIX}:lastused`])
    if (!result || !Array.isArray(result)) return {}

    const lastUsed = {}
    for (let i = 0; i < result.length; i += 2) {
      lastUsed[result[i]] = result[i + 1]
    }
    return lastUsed
  } catch {
    return {}
  }
}

/**
 * Record an administrator login
 * @param {object} env - Environment variables
 * @param {Request} request - The request object (to get the IP)
 */
export async function recordLogin(env, request) {
  const redis = getRedisClient(env)
  if (!redis) return

  try {
    // Get client IP (provided by Cloudflare)
    const ip = request.headers.get('CF-Connecting-IP') ||
               request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
               'unknown'

    const userAgent = request.headers.get('User-Agent') || 'unknown'
    const now = new Date().toISOString()

    // Login record format: time|IP|UA
    const record = JSON.stringify({ time: now, ip, ua: userAgent })

    // Add to the front of the list, keeping a max of 50 records
    await redis.request(['LPUSH', `${STATS_PREFIX}:logins`, record])
    await redis.request(['LTRIM', `${STATS_PREFIX}:logins`, 0, 49])
  } catch {
    // Recording failure should not affect login
  }
}

/**
 * Get login records
 * @param {object} env - Environment variables
 * @param {number} limit - Number of records to fetch (default 20)
 */
export async function getLoginRecords(env, limit = 20) {
  const redis = getRedisClient(env)
  if (!redis) return []

  try {
    const records = await redis.request(['LRANGE', `${STATS_PREFIX}:logins`, 0, limit - 1])
    if (!records || !Array.isArray(records)) return []

    return records.map(r => {
      try {
        return JSON.parse(r)
      } catch {
        return null
      }
    }).filter(Boolean)
  } catch {
    return []
  }
}

// ============ IP Blacklist Management ============

/**
 * Check if an IP is in the blacklist
 * @param {object} env - Environment variables
 * @param {string} ip - The IP address
 * @returns {Promise<{blocked: boolean, reason?: string}>}
 */
export async function isIpBlocked(env, ip) {
  const redis = getRedisClient(env)
  if (!redis || !ip || ip === 'unknown') return { blocked: false }

  try {
    const reason = await redis.request(['HGET', BLACKLIST_KEY, ip])
    if (reason) {
      return { blocked: true, reason: reason || 'Blocked by administrator' }
    }
    return { blocked: false }
  } catch {
    return { blocked: false }
  }
}

/**
 * Add an IP to the blacklist
 * @param {object} env - Environment variables
 * @param {string} ip - The IP address
 * @param {string} reason - The reason for blocking
 */
export async function blockIp(env, ip, reason = 'Manual block') {
  const redis = getRedisClient(env)
  if (!redis) return { success: false, error: 'Redis not configured' }

  try {
    const record = JSON.stringify({
      reason,
      blocked_at: new Date().toISOString(),
    })
    await redis.request(['HSET', BLACKLIST_KEY, ip, record])
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Remove an IP from the blacklist
 * @param {object} env - Environment variables
 * @param {string} ip - The IP address
 */
export async function unblockIp(env, ip) {
  const redis = getRedisClient(env)
  if (!redis) return { success: false, error: 'Redis not configured' }

  try {
    await redis.request(['HDEL', BLACKLIST_KEY, ip])
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get the blacklist
 * @param {object} env - Environment variables
 */
export async function getBlockedIps(env) {
  const redis = getRedisClient(env)
  if (!redis) return []

  try {
    const result = await redis.request(['HGETALL', BLACKLIST_KEY])
    if (!result || !Array.isArray(result)) return []

    const blockedIps = []
    for (let i = 0; i < result.length; i += 2) {
      const ip = result[i]
      let info = { reason: 'Manual block', blocked_at: null }
      try {
        info = JSON.parse(result[i + 1])
      } catch {
        info.reason = result[i + 1] || 'Manual block'
      }
      blockedIps.push({ ip, ...info })
    }
    return blockedIps
  } catch {
    return []
  }
}
