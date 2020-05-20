import fetch from 'node-fetch'

const BASE_URL = 'https://api.viewblock.io'

const makeQuery = params => {
  const keys = Object.keys(params).filter(k => params[k])

  return `${keys.length ? '?' : ''}${keys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`, '')
    .join('&')}`
}

export default (path, { apiKey, query = {}, network, agent = null }) => {
  const q = makeQuery({ ...query, network })

  return fetch(`${BASE_URL}${path}${q}`, {
    headers: { 'Content-Type': 'json', 'X-APIKEY': apiKey },
    timeout: 1e3 * 30,
    agent,
  }).then(res => res.json())
}
