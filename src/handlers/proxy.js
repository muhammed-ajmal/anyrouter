// ============ Proxy Request Handling ============

import { jsonResponse } from '../utils/helpers.js'
import { getConfigFromDB, findBySkAlias } from '../db/supabase.js'
import { recordRequest, isIpBlocked } from '../cache/stats.js'

/**
 * Generate a friendly error response
 */
function errorResponse(code, message, hint) {
  return jsonResponse({
    error: {
      code,
      message,
      hint,
      contact: 'If you have any questions, please contact the administrator.',
    }
  }, code === 'UNAUTHORIZED' ? 401 :
    code === 'BAD_REQUEST' ? 400 :
      code === 'NOT_FOUND' ? 404 :
        code === 'FORBIDDEN' ? 403 :
          code === 'SERVICE_ERROR' ? 503 : 500)
}

/**
 * Handle proxy requests.
 * Supports two formats:
 * 1. Authorization: Bearer https://api.example.com:123 (find token by ID)
 * 2. Authorization: Bearer https://api.example.com:sk-xxx (use token directly)
 * @param {Request} request
 * @param {object} env
 * @param {URL} url
 * @param {ExecutionContext} ctx - Cloudflare Workers execution context, used for waitUntil
 */
export async function handleProxyRequest(request, env, url, ctx) {
  // Get client IP
  const clientIp = request.headers.get('CF-Connecting-IP') ||
                   request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
                   'unknown'

  // Check IP blacklist
  const blockCheck = await isIpBlocked(env, clientIp)
  if (blockCheck.blocked) {
    return jsonResponse({
      error: {
        code: 'IP_BLOCKED',
        message: 'IP address has been blocked',
        reason: blockCheck.reason,
        ip: clientIp,
        contact: 'If you have any questions, please contact the administrator.',
      }
    }, 403)
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(
      'UNAUTHORIZED',
      'Missing authorization information',
      'Please provide a Bearer token in the Authorization header. Format: Bearer <API_URL>:<Key ID> or Bearer sk-ar-xxx'
    )
  }

  const authValue = authHeader.substring(7).trim() // Remove "Bearer " prefix

  // Get configuration
  const config = await getConfigFromDB(env)

  let tokenToUse
  let targetApiUrl
  let usedKeyId = null

  // Check if it's SK alias mode (sk-ar-xxx)
  if (authValue.startsWith('sk-ar-')) {
    const found = findBySkAlias(config, authValue)
    if (!found) {
      return errorResponse(
        'NOT_FOUND',
        'SK alias does not exist',
        `Could not find SK alias "${authValue}". Please check if it's correct or contact an administrator to get a valid SK.`
      )
    }

    if (!found.key.enabled) {
      return errorResponse(
        'FORBIDDEN',
        'SK has been disabled',
        'This SK alias is currently disabled. Please contact an administrator to enable it.'
      )
    }

    // Check for expiration
    if (found.key.expires_at && new Date(found.key.expires_at) < new Date()) {
      return errorResponse(
        'FORBIDDEN',
        'SK has expired',
        `This SK alias expired on ${found.key.expires_at}. Please contact an administrator to renew it or get a new one.`
      )
    }

    tokenToUse = found.key.token
    targetApiUrl = found.apiUrl
    usedKeyId = found.key.key_id
  } else {
    // Original format: <api_url>:<key>
    // Need to split from the last colon, as the URL may contain a port number (e.g., https://api.example.com:8080:key)
    const lastColonIndex = authValue.lastIndexOf(':')
    if (lastColonIndex === -1 || lastColonIndex < 8) {
      // No colon, or the colon is within "https://"
      return errorResponse(
        'BAD_REQUEST',
        'Invalid authorization format',
        'Correct format: <API_URL>:<Key ID> or sk-ar-xxx. For example: https://api.openai.com:a3x9k2'
      )
    }

    targetApiUrl = authValue.substring(0, lastColonIndex)
    const keyPart = authValue.substring(lastColonIndex + 1)

    // Validate API URL format
    if (!targetApiUrl.startsWith('http://') && !targetApiUrl.startsWith('https://')) {
      return errorResponse(
        'BAD_REQUEST',
        'Invalid API URL format',
        'URL must start with http:// or https://'
      )
    }

    if (!keyPart) {
      return errorResponse(
        'BAD_REQUEST',
        'Missing Key ID or Token',
        'Please append a colon and a 6-digit Key ID or the full Token after the URL.'
      )
    }

    // Determine if it's a key_id (6-digit alphanumeric) or a direct token
    const isKeyId = /^[a-z0-9]{6}$/.test(keyPart)

    if (isKeyId) {
      // Find token by key_id
      const keyId = keyPart
      usedKeyId = keyId

      // Check if the API URL is in the configuration
      if (!config[targetApiUrl]) {
        return errorResponse(
          'NOT_FOUND',
          'API address not configured',
          `The target API "${targetApiUrl}" has not been registered in the system. Please contact an administrator to add the configuration.`
        )
      }

      // Find the specified key_id within the keys for that URL
      const keyConfig = config[targetApiUrl].keys.find(k => k.key_id === keyId)
      if (!keyConfig) {
        return errorResponse(
          'NOT_FOUND',
          'Key ID does not exist',
          `Could not find Key ID "${keyId}". Please check if it's correct or contact an administrator to get a valid Key ID.`
        )
      }

      if (!keyConfig.enabled) {
        return errorResponse(
          'FORBIDDEN',
          'Key has been disabled',
          `Key ID "${keyId}" is currently disabled. Please contact an administrator to enable it or get a new Key ID.`
        )
      }

      // Check for expiration
      if (keyConfig.expires_at && new Date(keyConfig.expires_at) < new Date()) {
        return errorResponse(
          'FORBIDDEN',
          'Key has expired',
          `Key ID "${keyId}" expired on ${keyConfig.expires_at}. Please contact an administrator to renew it or get a new Key ID.`
        )
      }

      tokenToUse = keyConfig.token
    } else {
      // Use the provided token directly
      tokenToUse = keyPart
    }
  }

  // Set target host and protocol
  const targetUrl = new URL(targetApiUrl)

  // Check if trying to proxy to itself (prevent infinite loop)
  const selfHostname = url.hostname.toLowerCase()
  const targetHostname = targetUrl.hostname.toLowerCase()
  if (targetHostname === selfHostname ||
      targetHostname.endsWith('.' + selfHostname) ||
      selfHostname.endsWith('.' + targetHostname)) {
    return errorResponse(
      'FORBIDDEN',
      'Proxying to self is prohibited',
      'Proxying requests to the proxy service\'s own domain is not allowed as it would cause a loop.'
    )
  }

  url.protocol = targetUrl.protocol
  url.hostname = targetUrl.hostname
  url.port = targetUrl.port || ''

  // Get original request headers
  const headers = new Headers(request.headers)

  // Set Authorization header
  headers.set('authorization', 'Bearer ' + tokenToUse)

  const modifiedRequest = new Request(url.toString(), {
    headers: headers,
    method: request.method,
    body: request.body,
    redirect: 'follow',
  })

  try {
    const response = await fetch(modifiedRequest)
    const modifiedResponse = new Response(response.body, response)

    // Add headers to allow cross-origin access
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')

    // SSE streaming response optimization: disable buffering and compression for real-time transport
    const contentType = response.headers.get('content-type') || ''
    const isStreaming = contentType.includes('text/event-stream') ||
                        contentType.includes('stream') ||
                        request.headers.get('accept')?.includes('text/event-stream')
    if (isStreaming) {
      modifiedResponse.headers.set('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate')
      modifiedResponse.headers.set('X-Accel-Buffering', 'no')
      modifiedResponse.headers.set('Connection', 'keep-alive')
      modifiedResponse.headers.set('Content-Encoding', 'identity')
      // Remove headers that might cause buffering
      modifiedResponse.headers.delete('Content-Length')
    }

    // Record request statistics (use waitUntil to ensure it completes after the response)
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(recordRequest(env, {
        apiUrl: targetApiUrl,
        keyId: usedKeyId,
        success: response.ok,
        ip: clientIp,
      }))
    }

    return modifiedResponse
  } catch (error) {
    // Record failed request
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(recordRequest(env, {
        apiUrl: targetApiUrl,
        keyId: usedKeyId,
        success: false,
        ip: clientIp,
      }))
    }

    console.error('Proxy request error:', error)
    return errorResponse(
      'SERVICE_ERROR',
      'Proxy request failed',
      `Could not connect to the target API "${targetApiUrl}". This could be a network issue or the target service may be unavailable. Please try again later.`
    )
  }
}
