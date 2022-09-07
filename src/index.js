import rpc from './rpc.js'
import vb from './viewblock.js'
import getSubscribe from './socket.js'

import toHex from './fn/toHex.js'

export default ({ apiKey, network = 'mainnet', agent } = {}) => {
  const isAnon = !apiKey

  const getOpts = opts => ({ apiKey, network, agent, ...opts })

  const rpcMethods = {
    createTx: (payload, opts) =>
      rpc({ method: 'CreateTransaction', params: [payload] }, getOpts(opts)).then(res => ({
        msg: res.Info,
        hash: res.TranID,
      })),
    getGasPrice: opts => rpc('GetMinimumGasPrice', getOpts(opts)),
    getSCInit: (hash, opts) =>
      rpc({ method: 'GetSmartContractInit', params: [toHex(hash)] }, getOpts(opts)),
    getSCState: (body, opts) => {
      const isHash = typeof body === 'string'
      const { address, name = '', indices = [] } = isHash ? { address: body } : body

      return rpc(
        { method: 'GetSmartContractSubState', params: [toHex(address), name, indices] },
        getOpts(opts),
      )
    },
  }

  if (isAnon) {
    console.warn(`Disabling main library features: No API credentials provided.
Get them on https://viewblock.io by creating a free account and an API key.`)

    return rpcMethods
  }

  return {
    ...rpcMethods,

    subscribe: getSubscribe(apiKey),

    getBlock: (height, opts) => vb(`/v1/zilliqa/blocks/${height}`, getOpts(opts)),
    getBlockTxs: (height, opts = {}) =>
      vb(`/v1/zilliqa/blocks/${height}/txs`, getOpts({ ...opts, query: { page: opts.page } })),

    getAddress: (hash, opts) =>
      vb(`/v1/zilliqa/addresses/${hash}`, getOpts(opts)).then(res => res && res[0]),
    getAddressTxs: (hash, opts = {}) =>
      vb(`/v2/zilliqa/addresses/${hash}/txs`, getOpts({ ...opts, query: { page: opts.page } })),
    getAddressTokenTxs: (hash, opts = {}) =>
      vb(
        `/v2/zilliqa/addresses/${hash}/txs`,
        getOpts({ ...opts, query: { type: 'tokens', page: opts.page, token: opts.token } }),
      ),
    getTx: (hash, opts) => vb(`/v1/zilliqa/txs/${hash}`, getOpts(opts)),
  }
}
