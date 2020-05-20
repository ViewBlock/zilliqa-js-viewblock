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
  events: [],                                                                    
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
await client.getAddressTxs('zil1fd32gvyfk224mh8fuffnh3d5wpujw4rjpqy4f6', { page: 1 })
```

<details>
<summary>Output</summary>

```js
{
  docs: [{
    hash: '0x9067cd5916f968828203ad71be1a4981f7e67f68206f49c868158c6878061291',
    blockHeight: 574086,
    from: 'zil1uqq7gatsz8r2p0ks5nylcksxz329n0zyw9yecy',
    to: 'zil1fd32gvyfk224mh8fuffnh3d5wpujw4rjpqy4f6',
    value: '49480160397840000',
    fee: '2000000000',
    timestamp: 1589860302067,
    signature: '0xC77DB01030EDF5ECE6CCCB4A6CB957B55AB28F9E48BFE53CB5156B828511AE9D70D0A7682AB6D05D6530A35916674A1A181F5BA84C770ACADB0A74359AA61538',
    direction: 'in',
    nonce: 356,
    receiptSuccess: true,
    events: []
  }, {
    hash: '0x1a9cd06e69dbc7909c61c9618e495e39a6c7adc1131797a15cfc00ba341e80a6',
    blockHeight: 551639,
    from: 'zil1uqq7gatsz8r2p0ks5nylcksxz329n0zyw9yecy',
    to: 'zil1fd32gvyfk224mh8fuffnh3d5wpujw4rjpqy4f6',
    value: '1000000000000',
    fee: '2000000000',
    timestamp: 1588770078879,
    signature: '0xFA6F7ABDFC4C8B917DE32FDB2009EB641EC1964477FC4C33E8E5838282F7ED3C6C6D595EB728ED544AD85817AFB056F8725F36144E78F13D24FA05B95AE7CA07',
    direction: 'in',
    nonce: 191,
    receiptSuccess: true,
    events: []
  }],
  page: 1,
  totalPages: 1,
  total: 2,
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
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
      events: []
    },
    {
      hash: '0xf81b71e96f13760d405f88b7f97ee7a4ef71174e7018d041b03c0f27a3760b4b',
      from: 'zil1xrr4s95lsgxur9seqp34ck5g7ml7relmp7v5rz',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '458516000791614',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf78f7c922e5b4134020ce0f3db293b7a73a3eb417b25cf9ec519aab78355d216',
      from: 'zil17m0k2yrwkwakgg20hncpmd5sqdsl2qfhdhncds',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1935315546888898',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf78f0b36d102e3ef84df276400a0c3ae226a822df89204a7a525bda7f87b39c7',
      from: 'zil1df9a5sjwc2z26nt04u8tzyepp4m8ffvav4m6r3',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '553574187949524',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf74a6e9bd7966c3511ef64babcef2ae3ce5d92f3385bd27f1385615ba830ab35',
      from: 'zil1zyz8prlg4d8vgd4v33y5j8chzn5tuerlue9lst',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '1303886940618567',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf73f85115573583f3e9df51311b309c17671e400e0627d6637dad64bb590e4d8',
      from: 'zil1g3s4wcum26qxansyd0kyyxl7fua5gj8hataw72',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '735988218756618',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf73c0822667907d34d8c68ce479cac1d135858675fa1c6744a4fbbe0b2a67855',
      from: 'zil1lv6ndxd32z6tva3umadggmhat94swsk3ze24xt',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '771788300225705',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf6f31a96e497dfee0d365ad3c82a4c7cea79530a22a2dcd1bee4a951b755d881',
      from: 'zil15w6xm7uhlng98qflsqfjf8u3kw785nh42yyhz4',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '633389789623963',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf59bc4f6e7d0f242850f54cd05405d44996057ce24f358425f74672099166a16',
      from: 'zil1fmp5jhpxhj4g3zgq5nymwcnpnuwftq0fzcu5yw',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '916336607383980',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf53b2045870539c2a2afbc2198f55059477f2a366b1671a2a31303e351836385',
      from: 'zil19zjpgvsm2nh3qf5r2c0k2gfyznnnp39mxfvqua',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '754173130172251',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf4effdc7b51e640031d296db79f06581355afb2962898ad0927997d65562e7df',
      from: 'zil1dvugerq6rg35jxvplvmx7c3w5rvset3rt4fk7x',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '498768754250469',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf4e059c173886bd7ff2a752df35f056a04152957079eb5a81de8d28027a925f7',
      from: 'zil17kd4gs50y8mhj7f6e5ryq4qwpwp4tvrn8cdhue',
      to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
      value: '799534610127843',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
    },
    {
      hash: '0xf415e05851f7e94437f54e8ad4616d909bd082c1af746aca952582a315f0ba11',
      from: 'zil10dapalzz0gua9z9gkrm6rdfg0j33ypq4ey37dm',
      to: 'zil1ggkgt2mcl92hw6yccer0f2q694xqkr6dk25cag',
      value: '666457777688691',
      fee: '1000000000',
      timestamp: 1554172478877,
      nonce: 1,
      receiptSuccess: true,
      events: []
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
      events: []
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
      events: []
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
      events: []
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
