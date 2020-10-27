# @zilliqa-js/viewblock [![build](https://img.shields.io/travis/Ashlar/zilliqa-js-viewblock/master.svg?style=flat-square)](https://travis-ci.org/Ashlar/zilliqa-js-viewblock) [![cover](https://img.shields.io/coveralls/Ashlar/zilliqa-js-viewblock.svg?style=flat-square)](https://coveralls.io/github/Ashlar/zilliqa-js-viewblock)

> A library interfacing with the Zilliqa blockchain and ViewBlock's APIs

### Table of Contents

- [Setup](#setup)
  * [Client](#client)
- [Transactions](#transactions)
  * [getTx](#gettx)
  * [getPendingTxs](#getpendingtxs)
  * [createTx](#createtx)
- [Addresses](#addresses)
  * [getAddress](#getaddress)
  * [getAddressTxs](#getaddresstxs)
- [Smart Contracts](#smart-contracts)
  * [getSCInit](#getscinit)
  * [getSCState](#getscstate)
- [Blocks](#blocks)
  * [getBlock](#getblock)
  * [getBlockTxs](#getblocktxs)
- [Subscriptions](#subscriptions)
  * [block](#block)
  * [transaction](#transaction)
  * [addressTx](#addressTx)
  * [contractEvent](#contractEvent)
- [Misc](#misc)
  * [getGasPrice](#getgasprice)

### Setup

Install using your favorite package manager.

```
yarn add @zilliqa-js/viewblock
```

#### Client

The library client is exposed as the default export in the form of a factory function.

> :warning:  Although not enforced, not providing an `apiKey` will disable most of the methods of the library.
Get one on [ViewBlock](https://viewblock.io) by creating an account and a key in your settings.

| Param    | Type     | Required | Default   | Values               |
| -------- | -------- | -------- | --------- | -------------------- |
| apiKey   | `String` | `false`  |           |                      |
| agent    | `Agent`  | `false`  | `null`    | `http.Agent`         |
| network  | `String` | `false`  | `mainnet` | `mainnet`, `testnet` |

```js
import Zilliqa from '@zilliqa-js/viewblock'

const client = Zilliqa({
  apiKey: 'xxx',
})
```

You can obviously use basic commonjs requires too:

```js
const Zilliqa = require('@zilliqa-js/viewblock')
```

The `agent` parameter allows to use any `http.Agent` implementation of your choice.
As an example, [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) could be
provided to proxy the requests.

These 3 parameters passed when creating the client act as a global default configuration, but
can be overriden on each individual call for convenience purposes. As an example:

```js
const client = Zilliqa({ apiKey: 'xxx' })

client.getBlock(42, { network: 'testnet' })
client.getGasPrice({ network: 'testnet' })
```

Here, although the client defaults to `mainnet`, we override it specifically for these two calls.
It won't affect subsequent methods, as they will use the default network.

All the methods return a `Promise`, making it `await` compatible.

### Transactions

#### getTx

Get one transaction by hash.


```js
await client.getTx('0x65fd90f1fc2d3b631a0cf6a77be9947e9f4559d9ece9b9a1eef170d593bd9213')
```

<details>
<summary>Output</summary>

```js
{
  hash: '0x65fd90f1fc2d3b631a0cf6a77be9947e9f4559d9ece9b9a1eef170d593bd9213',
  blockHeight: 577008,
  from: 'zil1kshhphza3vlyfamjchamk2d3j022a55kn6es38',
  to: 'zil1z3zky3kv20f37z3wkq86qfy00t4a875fxxw7sw',
  value: '29000000000000',
  fee: '1000000000',
  timestamp: 1590005268574,
  signature:
    '0xEA74CF5062954368ECBEB9EA00014C9F78590391703E0DCEF002FAB50D30C1147D84BDC8A1703A33181CD3BDE315E6B28627EB0266DCD0D3CB886130B06312D1',
  nonce: 1,
  receiptSuccess: true,
  data: null,
  internalTransfers: [],
  events: [],
  transitions: []
}
```

</details>

#### getPendingTxs

> :warning: Pending implementation.

#### createTx

Create a transaction using the JSON RPC. Follow the [create transaction](https://apidocs.zilliqa.com/#createtransaction)
transaction parameters documentation to get a better idea on how to construct it.

```js
await client.createTx({
  version: 65537,
  nonce: 1,
  toAddr: '0x4BAF5faDA8e5Db92C3d3242618c5B47133AE003C',
  amount: '1000000000000',
  pubKey: '0205273e54f262f8717a687250591dcfb5755b8ce4e3bd340c7abefd0de1276574',
  gasPrice: '1000000000',
  gasLimit: '1',
  code: '',
  data: '',
  signature: '29ad673848dcd7f5168f205f7a9fcd1e8109408e6c4d7d03e4e869317b9067e636b216a32314dd37176c35d51f9d4c24e0e519ba80e66206457c83c9029a490d',
  priority: false
})
```

<details>
<summary>Output</summary>

```js
{
  msg: 'Non-contract txn, sent to shard',
  hash: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c'
}
```

</details>

### Addresses

#### getAddress

Retrieve one address by hash.

```js
await client.getAddress('zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu', { network: 'testnet' })
```

<details>
<summary>Output</summary>

```js
{
  hash: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
  balance: '999962495000000000',
  nonce: 4,
  type: 'normal'
}
```

</details>

#### getAddressTxs

Get the transactions made by an address.

| Param    | Type     | Required | Default   |
| -------- | -------- | -------- | --------- |
| page     | `Number` | `false`  | `1`       |

```js
await client.getAddressTxs('zil16awfafxs789g8nthnm5s9p4l8vnxs5zpfr3upr', { page: 1 })
```

<details>
<summary>Output</summary>

```js
{
  docs: [
    {
      hash: '0xced4731d535e1b0ba72d562d6c1dfd0ef71d1189abfa1ead8341667ca22aa01b',
      blockHeight: 1128974,
      from: 'zil15wglkgh0vht9zeaqe9x4axmw4nkw2mr79z6g3x',
      to: 'zil16awfafxs789g8nthnm5s9p4l8vnxs5zpfr3upr',
      value: '25000000000000',
      fee: '3026000000000',
      timestamp: 1581304554974,
      signature:
        '0x2E293AB15F747F90292D1262731DCD597008C456266E654466823728F92BDC6F6FB7E819C9A1518DA827C0031E1A7DD349FA920B04C420359053808E3E177648',
      direction: 'in',
      nonce: 312,
      receiptSuccess: true,
      data: '{"_tag": "request", "params": []}',
      internalTransfers: [
        {
          from: 'zil16awfafxs789g8nthnm5s9p4l8vnxs5zpfr3upr',
          to: 'zil1mejpsqd5cw589xyq3llzvrk0nvetm9v0l5kcn7',
          value: '25000000000000',
          direction: 'in',
          depth: '0,0',
        },
      ],
      events: [
        {
          address: 'zil1mejpsqd5cw589xyq3llzvrk0nvetm9v0l5kcn7',
          name: 'request',
          details:
            'request (String msg, Uint32 id, ByStr20 from, Uint32 reqtype, Uint128 gaslimit, Uint128 gasprice, String paramdata, Uint128 fee)',
          params: {
            msg: 'send request success',
            id: '10',
            from: '0xa391fb22ef65d65167a0c94d5e9b6eacece56c7e',
            reqtype: '1',
            gaslimit: '20000',
            gasprice: '1000000000',
            paramdata:
              "{'url':'https://samples.openweathermap.org/data/2.5/weather',\n    'params':{'q':'London,uk','appid':'b6907d289e10d714a6e88b30761fae22'}}",
            fee: '3999000000000',
          },
        },
      ],
      transitions: [
        {
          addr: '0xd75c9ea4d0f1ca83cd779ee90286bf3b26685041',
          depth: 0,
          msg: {
            _amount: '25000000000000',
            _recipient: '0xde641801b4c3a87298808ffe260ecf9b32bd958f',
            _tag: 'request',
            params: [
              {
                type: 'ByStr20',
                value: '0xa391fb22ef65d65167a0c94d5e9b6eacece56c7e',
                vname: 'user_addr',
              },
              {
                type: 'Uint32',
                value: '1',
                vname: 'request_type',
              },
              {
                type: 'String',
                value:
                  "{'url':'https://samples.openweathermap.org/data/2.5/weather',\n    'params':{'q':'London,uk','appid':'b6907d289e10d714a6e88b30761fae22'}}",
                vname: 'param_data',
              },
              {
                type: 'Uint128',
                value: '1000000000',
                vname: 'gas_price',
              },
              {
                type: 'Uint128',
                value: '20000',
                vname: 'gas_limit',
              },
              {
                type: 'String',
                value: 'callback',
                vname: 'callback_func',
              },
            ],
          },
        },
        {
          addr: '0xde641801b4c3a87298808ffe260ecf9b32bd958f',
          depth: 1,
          msg: {
            _amount: '25000000000000',
            _recipient: '0xc4818b8c0d0c2ae775e8ed1998d72c7aa0743063',
            _tag: '',
            params: [],
          },
        },
      ],
    },
    {
      hash: '0x6bc8fcd7a14bef419eae03d8d9ac68de0bcc279a50a86fe3a00c24d99833c5e3',
      blockHeight: 1064704,
      from: 'zil10h9339zp277h8gmdhds6zuq0elgpsf5qga4qvh',
      to: 'zil16awfafxs789g8nthnm5s9p4l8vnxs5zpfr3upr',
      value: '0',
      fee: '2590000000000',
      timestamp: 1579266403473,
      signature:
        '0x5A72F6B4826EBCE69F62DB2D85991D780A54ED4C459BB0732EB1F8B2C77DDE8F2B3DB6F022797561809E30310E830E755A98EDAE526F96675A76137815BBF81C',
      direction: 'in',
      nonce: 208,
      receiptSuccess: true,
      data:
        '[{"vname": "_scilla_version", "type": "Uint32", "value": "0"}, {"vname": "owner", "type": "ByStr20", "value": "0x7dcb18944157bd73a36dbb61a1700fcfd0182680"}]',
      internalTransfers: [],
      events: [],
      transitions: [],
    },
  ],
  page: 1,
  totalPages: 1,
  total: 2,
  limit: 25,
  nextPage: null,
  prevPage: null
}
```

</details>

#### getAddressTokenTxs

Get the token transactions associated with an address. Note `token` can be specified
to filter for specific token transactions.

| Param    | Type     | Required | Default   |
| -------- | -------- | -------- | --------- |
| page     | `Number` | `false`  | `1`       |
| token    | `String` | `false`  |           |

```js
await client.getAddressTokenTxs('zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml', {
  page: 1,
  token: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
})
```

<details>
<summary>Output</summary>

```js
{
  docs: [
    {
      hash: '0x3c60b3194a175fa4d484fb3074f3bd7ba9bfd62c7d6dc1da6f86a4c948bb7f92',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0.02',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776290,
      timestamp: 1599139330519,
      direction: 'in',
    },
    {
      hash: '0x7b7555d456cf4415c1f58af26a8b8788ebb3431c41ccb893d0c3a06c2157c064',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776298,
      timestamp: 1599139497307,
      direction: 'in',
    },
    {
      hash: '0xc5f582866251b022ac32e98a6e4598319288234ef8722b04bf5c285122094af1',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0.01',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776348,
      timestamp: 1599140579375,
      direction: 'in',
    },
    {
      hash: '0x7b1356842d1e595384ee2de38df7fc24ed1a57f5df65c3cc23c7b4f02415cdeb',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0.04',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776384,
      timestamp: 1599141333323,
      direction: 'in',
    },
    {
      hash: '0x7e1da8fb622bfb6203d65573cb4367077f85fd65b90697fd82ca3e8e145b0841',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776390,
      timestamp: 1599141458698,
      direction: 'in',
    },
    {
      hash: '0xe0094c46b4bd1fb0ef0fbb623c9d0431f835d850a28e8a5b81886ca7e91061b2',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776704,
      timestamp: 1599148162726,
      direction: 'in',
    },
    {
      hash: '0x785f21e312a10307907ac3f06da0d6056056082fa0265ef64fa8b402676425ab',
      from: 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
      to: 'zil1my8ju5uvur0cnjp88jknkclvgj3ufmvz5pxyml',
      value: '0.0196969696',
      tokenAddress: 'zil1l8mn5r5urrlxzf6q9z790zz2c5a9ya8366hzre',
      blockHeight: 1776986,
      timestamp: 1599154120380,
      direction: 'in',
    },
  ],
  page: 1,
  totalPages: 1,
  total: 7,
  limit: 25,
  nextPage: null,
  prevPage: null
}
```

</details>

### Smart Contracts

#### getSCInit

Get the init parameters of a given smart contract.

```js
await client.getSCInit('zil1cm2x24v7807w7yjvmkz0am0y37vkys8lwtxsth') 
```

<details>
<summary>Output</summary>

```js
[
  {
    "type": "Uint32",
    "value": "0",
    "vname": "_scilla_version"
  },
  {
    "type": "List ByStr20",
    "value": {
      "argtypes": [
        "ByStr20"
      ],
      "arguments": [
        "0x5B42879E9c497EdAE5b3A7B3DCfD40920feC0599",
        {
          "argtypes": [
            "ByStr20"
          ],
          "arguments": [
            "0x98c656454b4E27762ab62D176246f31def011875",
            {
              "argtypes": [
                "ByStr20"
              ],
              "arguments": [
                "0x09EE3238528247354862700f5C00A349a499badB",
                {
                  "argtypes": [
                    "ByStr20"
                  ],
                  "arguments": [
                    "0x705856236100A28106BD3b760ADaFDea7F990dFB",
                    {
                      "argtypes": [
                        "ByStr20"
                      ],
                      "arguments": [],
                      "constructor": "Nil"
                    }
                  ],
                  "constructor": "Cons"
                }
              ],
              "constructor": "Cons"
            }
          ],
          "constructor": "Cons"
        }
      ],
      "constructor": "Cons"
    },
    "vname": "owners_list"
  },
  {
    "type": "Uint32",
    "value": "2",
    "vname": "required_signatures"
  },
  {
    "type": "BNum",
    "value": "300675",
    "vname": "_creation_block"
  },
  {
    "type": "ByStr20",
    "value": "0xc6d465559e3bfcef124cdd84feede48f996240ff",
    "vname": "_this_address"
  }
]
```

</details>

#### getSCState

Get the state or sub-state of a smart contract.

| Param              | Type              | Required |
| ------------------ | ----------------- | -------- |
| payload            | `String`/`Object` | `true`   |
| payload.address    | `String`          | `false`  |
| payload.name       | `String`          | `false`  |
| payload.indices    | `Array`           | `false`  |

```js
await client.getSCState('zil1cm2x24v7807w7yjvmkz0am0y37vkys8lwtxsth') 
```

<details>
<summary>Output</summary>

```js
{
  _balance: "762000001000000000000",
  contract_valid: {
    argtypes: [],
    arguments: [],
    constructor: 'Valid'
  },
  owners: {
    '0x09ee3238528247354862700f5c00a349a499badb': {
      argtypes: [],
      arguments: [],
      constructor: 'True'
    },
    '0x5b42879e9c497edae5b3a7b3dcfd40920fec0599': {
      argtypes: [],
      arguments: [],
      constructor: 'True'
    },
    '0x705856236100a28106bd3b760adafdea7f990dfb': {
      "argtypes": [],
      "arguments": [],
      "constructor": 'True'
    },
    '0x98c656454b4e27762ab62d176246f31def011875': {
      argtypes: [],
      arguments: [],
      constructor: 'True'
    }
  },
  signature_counts: {},
  signatures: {},
  transactionCount: '0',
  transactions: {}
}
```

</details>

If you want to retrieve only part of the contract state, send an object payload and provide the optional `name` or `indices` parameters:

```js
await client.getSCState({
  address: 'zil1cm2x24v7807w7yjvmkz0am0y37vkys8lwtxsth',
  name: 'owners',
  indices: ['0x09ee3238528247354862700f5c00a349a499badb'],
}) 
```

<details>
<summary>Output</summary>

```js
{
  owners: {
    '0x09ee3238528247354862700f5c00a349a499badb': {
      argtypes: [],
      arguments: [],
      constructor: 'True'
    }
  }
}
```

</details>

### Blocks

#### getBlock

Retrieve one block information by its height.

```js
await client.getBlock(59903)
```

<details>
<summary>Output</summary>

```js
{
  height: 59903,
  timestamp: 1554172478877,
  txCount: 890,
  dsHeight: 600,
  gasLimit: '1500000',
  gasUsed: '890',
  minerPubKey: '0x0227939F72067FE1AC79276CE779A27C560391A660D42FDE0102229964F1C2C511',
  microBlocks: [
    {
      hash: '3b7041c131b80fc8ab6aa65fc1590272f08ce13c0919a621563e90ab544f948c',
      shardId: 0,
      txRootHash: 'ed461421c0a698ed009aeefddc5a4d1c0a03570081931efdc75d5e5d54e4e017'
    },
    {
      hash: 'ed64ecba273c3366e4fc558c218f8d67d7c1e2ccf77dc10379f41fb279af70ee',
      shardId: 1,
      txRootHash: '692374ea2ad4ac5240ec8ee89d9d3a5899a6ed8c1c25d96ed9ad2066ce0539c5'
    },
    {
      hash: '4f3dcf4078ecc0e4cae69068565b72fbd47012daa0f858bafb028edf1536a3ff',
      shardId: 2,
      txRootHash: '0000000000000000000000000000000000000000000000000000000000000000'
    }
  ],
  stateDeltaHash: '6e62ee3e1af7927a1c9ee8ec375951770b38a34305f3eae772f673942dfb5923',
  stateRootHash: '6dde256dd2be07ef69906a31790c539266b410ffdfba64198e6f16ed7b62d888'
}
```

</details>

#### getBlockTxs

Retrieve the transactions confirmed in a block.

| Param    | Type     | Required | Default   |
| -------- | -------- | -------- | --------- |
| page     | `Number` | `false`  | `1`       |

```js
await client.getBlockTxs(59903, { page: 1 })
```

<details>
<summary>Output</summary>

```js
{
  docs: [
    {
      hash: '0xfe55cf4954507a5b809cdfa8725a499d0656e3644838c2cd826eaa57a8e48f62',
      from: 'zil16ttxueshqnnun5hlen8ql8q5rvx7vvtm63ccna',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '703140978601111',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xfd816a3d5118d7a21e4a56d2c91f06a30315e0ba8851cfdaf6b9a6c61fc524fd',
      from: 'zil1mtzdp32j5jm7hfj4n3mxzf24lt779mf93pw0dy',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1887350370678611',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xfd0448f629b93038b5e4cddd51d2b90f9682882cd40ef3ee465bc4f0e55e357b',
      from: 'zil19n6d3h6a3jalkucg9aue8m3gaqdjt3ltayktml',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '749245402553526',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xfbc097da285c436171d4724c3a4fbf6aa6c309868bf717aa6bebf6bab09cdc10',
      from: 'zil1ph8pkmdgche9y9n529qdu9z4q772440eaae5pe',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '569420970197693',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xfa8bf7715d4cbe23524e72ab7920efac722be6284445dccdade4b0b6f6a4caac',
      from: 'zil1ujn9s37yc7hs0eklnwfnhrkgvtqljdwafgxjm2',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '426896695040558',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf9072f1aafad82a8f144b32b4404f685649fbcc82518d3c731835ec745211179',
      from: 'zil18ejxkf2u3cfknr6kulp36g6drsvylf6t3w0cpe',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '1193069646888861',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf8fc4928dfd539f9bf84a52531c8b06d59a95615c7845e4cb37b5f92aae775cd',
      from: 'zil1thtkpmzjpx26jhyvau2xdy5s7e66rvu9xcu2gh',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '996044741466089',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf8b489747fa37488634eb2c14d38784729157ee9c46be59744a70dbd133cf587',
      from: 'zil10pfk76qdxmykvxqfu7ffajkgshe240v3x26w65',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '270809781797106',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf895b7f488bbecc8c91e8101163c1a2fa2731e6af1ca70dd49f45a18ecb4ca81',
      from: 'zil1mwz4xelqdkddqdnvdptagx57mmzktjfaz2mjpz',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1504033644577742',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf8339e2ae31695d1ca04a9fd238029f9c75de36665f06726fe0d5096aad85b8b',
      from: 'zil1phfhqqh5axt7ehmlj3vul3syc48xhyp47h65gr',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1477095734460620',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf81b71e96f13760d405f88b7f97ee7a4ef71174e7018d041b03c0f27a3760b4b',
      from: 'zil1xrr4s95lsgxur9seqp34ck5g7ml7relmp7v5rz',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '458516000791614',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf78f7c922e5b4134020ce0f3db293b7a73a3eb417b25cf9ec519aab78355d216',
      from: 'zil17m0k2yrwkwakgg20hncpmd5sqdsl2qfhdhncds',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1935315546888898',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf78f0b36d102e3ef84df276400a0c3ae226a822df89204a7a525bda7f87b39c7',
      from: 'zil1df9a5sjwc2z26nt04u8tzyepp4m8ffvav4m6r3',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '553574187949524',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf74a6e9bd7966c3511ef64babcef2ae3ce5d92f3385bd27f1385615ba830ab35',
      from: 'zil1zyz8prlg4d8vgd4v33y5j8chzn5tuerlue9lst',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1303886940618567',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf73f85115573583f3e9df51311b309c17671e400e0627d6637dad64bb590e4d8',
      from: 'zil1g3s4wcum26qxansyd0kyyxl7fua5gj8hataw72',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '735988218756618',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf73c0822667907d34d8c68ce479cac1d135858675fa1c6744a4fbbe0b2a67855',
      from: 'zil1lv6ndxd32z6tva3umadggmhat94swsk3ze24xt',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '771788300225705',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf6f31a96e497dfee0d365ad3c82a4c7cea79530a22a2dcd1bee4a951b755d881',
      from: 'zil15w6xm7uhlng98qflsqfjf8u3kw785nh42yyhz4',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '633389789623963',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf59bc4f6e7d0f242850f54cd05405d44996057ce24f358425f74672099166a16',
      from: 'zil1fmp5jhpxhj4g3zgq5nymwcnpnuwftq0fzcu5yw',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '916336607383980',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf53b2045870539c2a2afbc2198f55059477f2a366b1671a2a31303e351836385',
      from: 'zil19zjpgvsm2nh3qf5r2c0k2gfyznnnp39mxfvqua',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '754173130172251',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf4effdc7b51e640031d296db79f06581355afb2962898ad0927997d65562e7df',
      from: 'zil1dvugerq6rg35jxvplvmx7c3w5rvset3rt4fk7x',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '498768754250469',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf4e059c173886bd7ff2a752df35f056a04152957079eb5a81de8d28027a925f7',
      from: 'zil17kd4gs50y8mhj7f6e5ryq4qwpwp4tvrn8cdhue',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '799534610127843',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []    },
    {
      hash: '0xf415e05851f7e94437f54e8ad4616d909bd082c1af746aca952582a315f0ba11',
      from: 'zil10dapalzz0gua9z9gkrm6rdfg0j33ypq4ey37dm',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '666457777688691',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf3c9bebca62fcb2362e4a55d6bdbd9def62c1de6ac5f561e934faa0428f1bd58',
      from: 'zil1kvzkh7hly8dd97xzaursd9xhvy2z0rhr6sqsgy',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '711495675155375',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf3545f099634bff0a536d9f8dfa74e361e1691b4c14df110b8099e4611622b6f',
      from: 'zil1jmwcy29y7whd5y8mys693hprjxsju83h384h7j',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '365449579421433',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    },
    {
      hash: '0xf2a8773c01d5f3df44bcfa529b49118cf90d261ff63087609651cdc336f177f7',
      from: 'zil1h55wdqlhy8eaenlleyr38wnv0mj4wmkaq8xr87',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '724632233105521',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: [],
      data: null,
      internalTransfers: [],
      transitions: []
    }
  ],
  totalDocs: 890,
  limit: 25,
  hasPrevPage: false,
  hasNextPage: true,
  page: 1,
  totalPages: 36,
  pagingCounter: 1,
  prevPage: null,
  nextPage: 2,
  pages: 36,
  total: 890
}
```

</details>

### Subscriptions

Allows to listen on a variety of events.

> :warning: We do not guarantee either the order upon which the messages are sent, nor that all the messages will be delivered successfully (typically in case of an outage or disruption of service).

#### block

Subscribe to new blocks.

```js
client.subscribe('block', console.log)
```

#### transaction

Subscribe to new transactions.

```js
client.subscribe('transaction', console.log)
```

#### addressTx

Subscribe to transactions made to or from a specific address.

```js
client.subscribe({ event: 'addressTx', param: 'zil1gqww6yq9d9nefhg3rec989kxsqs4zm8dzeyr0q' }, console.log)
```

#### contractEvent

Subscribe to events emitted by one contract.

```js
client.subscribe({ event: 'contractEvent', param: 'zil1vszj220406ez4gglpf6jvlds5jkszju63kpvax' }, console.log)
```

### Misc

#### getGasPrice

Get the current minimum gas price for this DS epoch.

```js
await client.getGasPrice()
```

<details>
<summary>Output</summary>

```js
'1000000000'
```

</details>
