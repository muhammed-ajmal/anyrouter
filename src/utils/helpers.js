// ============ Utility Functions ============

import { DEFAULT_ADMIN_PASSWORD } from '../config.js'

/**
 * Get admin password (priority use environment variables, otherwise use default value)
 */
export function getAdminPassword(env) {
  return env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
}

/**
 * Verify admin password
 */
export function verifyAdmin(request, env) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7).trim()
  return token === getAdminPassword(env).trim()
}

/**
 * Check if the URL is valid
 * @param {string} apiUrl
 * @returns {boolean}
 */
export function isValidUrl(apiUrl) {
  if (typeof apiUrl !== 'string' || apiUrl.length === 0) {
    return false
  }

  try {
    const parsed = new URL(apiUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Check if the token meets the requirements
 * @param {string} token
 * @returns {boolean}
 */
export function isValidToken(token) {
  // Allow letters, numbers, common special characters (_-./=+ etc.), exclude spaces and dangerous characters
  return (
    typeof token === 'string' &&
    token.length > 0 &&
    token.length <= 1000 &&
    !/[\s\0\n\r]/.test(token)
  )
}

/**
 * Validate configuration request body
 * @param {any} body
 * @param {{ partial?: boolean }} [options]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateConfigPayload(body, options = {}) {
  const { partial = false } = options

  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid payload' }
  }

  if (!partial || 'api_url' in body) {
    if (!isValidUrl(body.api_url)) {
      return { valid: false, error: 'api_url is required and must be a valid URL' }
    }
  }

  if (!partial || 'token' in body) {
    if (!isValidToken(body.token)) {
      return { valid: false, error: 'token is required and must not contain special characters' }
    }
  }

  if ('enabled' in body && typeof body.enabled !== 'boolean') {
    return { valid: false, error: 'enabled must be a boolean' }
  }

  if ('remark' in body) {
    if (body.remark !== null && typeof body.remark !== 'string') {
      return { valid: false, error: 'remark must be a string or null' }
    }
    if (body.remark && body.remark.length > 255) {
      return { valid: false, error: 'remark must be 255 characters or less' }
    }
  }

  if (partial && !('api_url' in body || 'token' in body || 'enabled' in body || 'remark' in body)) {
    return { valid: false, error: 'No fields provided for update' }
  }

  return { valid: true }
}

/**
 * Determine if there is an enabled key in the configuration
 * @param {Record<string, any>} config
 * @param {string} [apiUrl]
 * @returns {boolean}
 */
export function hasEnabledKey(config, apiUrl) {
  if (!config || Object.keys(config).length === 0) {
    return false
  }

  if (apiUrl) {
    const apiConfig = config[apiUrl]
    return Boolean(apiConfig && apiConfig.keys && apiConfig.keys.some((key) => key.enabled))
  }

  return Object.values(config).some(
    (item) => item.keys && item.keys.some((key) => key.enabled)
  )
}

/**
 * Return JSON response
 */
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

/**
 * Handle CORS
 */
export function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
