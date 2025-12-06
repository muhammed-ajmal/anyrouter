// ============ Upstash Redis REST API Client ============

/**
 * Upstash Redis REST API Client.
 * Uses the HTTP REST API, no TCP connection required, suitable for serverless environments.
 */
export class RedisClient {
  constructor(url, token) {
    this.baseUrl = url
    this.token = token
  }

  async request(command) {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data.result
  }

  async get(key) {
    return this.request(['GET', key])
  }

  async set(key, value, ttlSeconds) {
    if (ttlSeconds) {
      return this.request(['SET', key, value, 'EX', ttlSeconds])
    }
    return this.request(['SET', key, value])
  }

  async del(key) {
    return this.request(['DEL', key])
  }
}

/**
 * Get an instance of the Redis client.
 */
export function getRedisClient(env) {
  if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
    return null
  }
  return new RedisClient(env.UPSTASH_REDIS_URL, env.UPSTASH_REDIS_TOKEN)
}
