import fetch from 'node-fetch'

import { NETWORK_URLS } from './config'

export default (body, { network, agent = null }) => {
  const url = NETWORK_URLS[network]

  const payload = typeof body === 'string' ? { method: body } : body

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', params: [''], ...payload }),
    headers: { 'Content-Type': 'json' },
    timeout: 1e3 * 30,
    agent,
  })
    .then(res => res.json())
    .then(json => {
      const { error, result } = json || {}
      if (error) {
        throw new Error(error.message)
      }

      return result
    })
}
