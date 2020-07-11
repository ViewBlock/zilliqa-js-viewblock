import socketCluster from 'socketcluster-client'

const options = {
  hostname: 'live.viewblock.io',
  path: '/',
  port: 444,
  secure: true,

  connectTimeout: 10e3,
  autoConnect: true,
  autoReconnect: true,
  autoReconnectOptions: {
    initialDelay: 1e3,
    randomness: 5e3,
    multiplier: 1.1,
    maxDelay: 20e3,
  },
}

const validEvents = {
  block: 1,
  transaction: 1,
  addressTx: 1,
  contractEvent: 1,
}

const getSocket = key =>
  new Promise((resolve, reject) => {
    const socket = socketCluster.create(options)

    socket.on('connect', () => {
      socket.emit('login', { key }, errMsg => {
        if (errMsg) {
          return reject(new Error(errMsg))
        }

        resolve(socket)
      })
    })

    socket.on('error', console.log)

    return socket
  })

export default apiKey => (payload, cb) =>
  getSocket(apiKey).then(socket => {
    if (!payload) {
      throw new Error('Invalid subscription.')
    }

    const event = payload.event || payload

    if (!validEvents[event]) {
      throw new Error('Invalid subscription.')
    }

    const param = payload.param
    const key = `zilliqa:${event}${param ? `:${param}` : ''}`

    socket.subscribe(key).watch(cb)
  })
