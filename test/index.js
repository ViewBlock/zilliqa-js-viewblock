import test from 'ava'

import Zilliqa from '../src'
import toHex from '../src/fn/toHex'
import checkFields from '../src/fn/checkFields'

const client = Zilliqa({
  apiKey: process.env.API_KEY,
})

const RESERVE_CONTRACT = 'zil1cm2x24v7807w7yjvmkz0am0y37vkys8lwtxsth'
const OLD_TEST_ADDR = 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu'
const BLOCK_HEIGHT = 59903

test('[Main] Light client should only have rpc methods', t => {
  const client = Zilliqa()
  t.is(Object.keys(client).length, 4)
})

test('[Main] Full client should have all methods', t => {
  t.is(Object.keys(client).length, 10)
})

test('[Transaction] getTx', async t => {
  const tx = await client.getTx(
    '0x65fd90f1fc2d3b631a0cf6a77be9947e9f4559d9ece9b9a1eef170d593bd9213',
  )

  t.deepEqual(tx, {
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
    internalTransfers: [],
    data: null,
    transitions: [],
  })
})

test('[Block] getBlock', async t => {
  const block = await client.getBlock(BLOCK_HEIGHT)

  t.truthy(block)
  t.is(block.height, BLOCK_HEIGHT)
  t.is(block.txCount, 890)
  t.is(block.dsHeight, 600)
  t.is(block.minerPubKey, '0x0227939F72067FE1AC79276CE779A27C560391A660D42FDE0102229964F1C2C511')
})

test('[Block] getBlockTxs', async t => {
  const res = await client.getBlockTxs(BLOCK_HEIGHT)

  t.truthy(res)
  t.is(res.docs.length, 25)
  t.is(res.page, 1)
  t.is(res.total, 890)
  t.is(res.totalPages, 36)
  t.deepEqual(res.docs[0], {
    hash: '0xfe55cf4954507a5b809cdfa8725a499d0656e3644838c2cd826eaa57a8e48f62',
    from: 'zil16ttxueshqnnun5hlen8ql8q5rvx7vvtm63ccna',
    to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
    value: '703140978601111',
    fee: '1000000000',
    timestamp: 1554172478877,
    nonce: 1,
    receiptSuccess: true,
    events: [],
    internalTransfers: [],
    data: null,
    transitions: [],
  })

  const next = await client.getBlockTxs(BLOCK_HEIGHT, { page: 2 })

  t.is(next.docs.length, 25)
  t.is(next.page, 2)
  t.is(next.total, 890)
  t.is(next.totalPages, 36)
  t.deepEqual(next.docs[0], {
    hash: '0xf0b3a55731a4825956da6b9e12cfb35fb90b24adf8d3170e1d97329fb31f16b9',
    from: 'zil1mw5l7psjteusjuuwgu8pp9f3tr97fhjreddehu',
    to: 'zil1m9pv2cr087ewxncupyeujsr0q3fmulu6ep5elv',
    value: '545555182346812',
    fee: '1000000000',
    timestamp: 1554172478877,
    nonce: 1,
    receiptSuccess: true,
    events: [],
    internalTransfers: [],
    data: null,
    transitions: [],
  })
})

test('[Address] getAddress', async t => {
  const notFound = await client.getAddress(OLD_TEST_ADDR)
  t.is(notFound.type, 'normal')
  t.is(notFound.balance, 0)
  t.is(notFound.txCount, 0)
  t.is(notFound.hash, OLD_TEST_ADDR)

  const addr = await client.getAddress(OLD_TEST_ADDR, { network: 'testnet' })
  t.is(addr.balance, '999962495000000000')
  t.is(addr.txCount, 5)
  t.is(addr.nonce, 4)
})

test('[Address] getAddressTxs', async t => {
  const invalid = await client.getAddressTxs(OLD_TEST_ADDR)

  t.truthy(invalid)
  t.is(invalid.total, 0)
  t.is(invalid.docs.length, 0)
  t.is(invalid.totalPages, 1)
  t.is(invalid.page, 1)

  const txCount = 5

  const res = await client.getAddressTxs(OLD_TEST_ADDR, { network: 'testnet' })

  t.truthy(res)
  t.is(res.page, 1)
  t.is(res.totalPages, 1)
  t.is(res.nextPage, null)
  t.is(res.prevPage, null)
  t.is(res.total, txCount)

  t.truthy(res.docs)
  t.is(res.docs.length, txCount)

  t.deepEqual(res.docs, [
    {
      hash: '0x4824d98f9bc8bdb2137d17f6218a91d4e8765e32df6b43d710f444bcbe8d4e17',
      blockHeight: 444152,
      from: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
      to: 'zil1hwy2fzhukq07g3rfw0vkmmh7kvef732qzdv3qr',
      value: '0',
      fee: '9377000000000',
      timestamp: 1557973403680,
      signature:
        '0xCCEBFA70023F1627683AEDA6E73AFAB0A9A37EC6A826056F2E2AB0EDBA08D185AB82434F99298AE7257F1A0C9CABCD56CDFE5D173CBF9925449F3F059BD1486B',
      direction: 'out',
      nonce: 4,
      receiptSuccess: true,
      events: [],
      internalTransfers: [],
      data:
        '[{"vname":"_scilla_version","type":"Uint32","value":"0"},{"vname":"contractOwner","type":"ByStr20","value":"0xb826575569544c7f9afa65a92616fc0adf03d119"}]',
      transitions: [],
    },
    {
      hash: '0x236fbf86726c0c93c735e4730cebaaea050286da3e5ee5706153a1fbd8dd1bb6',
      blockHeight: 313433,
      from: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
      to: 'zil16fjwdfkmcrpvedmzjpavjnu5vku8ztftv8rxpr',
      value: '0',
      fee: '9377000000000',
      timestamp: 1553850738169,
      signature:
        '0xB3F6BDA13160BF567AA275D13F209D6F4E5EA72E950EC5E21B25628F4F44D84DF1424D2785A29DFAA419D2A48BD47B3FCB4C1E061B5557A9DAD0216648B4C46E',
      direction: 'out',
      nonce: 3,
      receiptSuccess: true,
      events: [],
      internalTransfers: [],
      data:
        '[{"vname":"_scilla_version","type":"Uint32","value":"0"},{"vname":"contractOwner","type":"ByStr20","value":"0xb826575569544c7f9afa65a92616fc0adf03d119"}]',
      transitions: [],
    },
    {
      hash: '0xcbeb9c32b16e6eddf74bba1fa6403298dba46f6083ab90593437d3a81579377d',
      blockHeight: 157624,
      from: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
      to: 'zil12eevlp9ak79lywnvjkxns4y0agwsdumdrxhu7f',
      value: '0',
      fee: '9377000000000',
      timestamp: 1551255474086,
      signature:
        '0xF8242F6C6BE7006770F6A26FA347E7BAB155E66C3EB5F21CDE6C1CD305E8786A52C6741517B016950C6807CFDD054FB08C502CB5B7BF6F55A9D48941D3F3DC02',
      direction: 'out',
      nonce: 2,
      receiptSuccess: true,
      events: [],
      internalTransfers: [],
      data:
        '[{"vname":"_scilla_version","type":"Uint32","value":"0"},{"vname":"contractOwner","type":"ByStr20","value":"0xb826575569544c7f9afa65a92616fc0adf03d119"}]',
      transitions: [],
    },
    {
      hash: '0x99fdf3b323b446125bfd7cdef4347c77b7fd7594de8a6486a1b0aa28f3baf39d',
      blockHeight: 510,
      from: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
      to: 'zil13jcdkf7vct26x8wtunhr9xvzrhdqp2k9wed9qx',
      value: '0',
      fee: '9374000000000',
      timestamp: 1549272278119,
      signature:
        '0x86041BA59CDFE348FDE084CF4F8184AB4EF3B36795056EA09C62D8BF82E8F739766FFDBE107E2D357A3C323F25E23E92CAC84804E0E07458F6BCD3304A61B35F',
      direction: 'out',
      nonce: 1,
      receiptSuccess: true,
      events: [],
      internalTransfers: [],
      data:
        '[{"vname":"_scilla_version","type":"Uint32","value":"0"},{"vname":"contractOwner","type":"ByStr20","value":"0xb826575569544c7f9afa65a92616fc0adf03d119"}]',
      transitions: [],
    },
    {
      hash: '0x9aa24045971adffe1eb97245f115babb0bbc1eb5fee1fd574c5264f584b101a4',
      blockHeight: 507,
      from: 'zil1z2u5waw9zrscnf3jx3xwdfd9vw4pj4c5jtsd9p',
      to: 'zil1hqn9w4tf23x8lxh6vk5jv9hupt0s85gemyetmu',
      value: '1000000000000000000',
      fee: '1000000000',
      timestamp: 1549272241251,
      signature:
        '0x4180574A8132E1B031B8361AACE5D50AAB6CD154B8F7D7A93F702E4300904E10C15B65889A075A449F717F5926DE8C0CA82E82DA4882F22F662B4AE458DEA6CB',
      direction: 'in',
      nonce: 6,
      receiptSuccess: true,
      events: [],
      internalTransfers: [],
      data: null,
      transitions: [],
    },
  ])

  const next = await client.getAddressTxs(OLD_TEST_ADDR, { network: 'testnet', page: 2 })

  t.is(next.page, 2)
  t.is(next.totalPages, 1)
  t.is(next.total, txCount)
  t.is(next.docs.length, 0)
  t.is(next.prevPage, 1)
})

test('[SC] Invalid address using default network', async t => {
  const c = Zilliqa({ network: 'testnet' })

  try {
    await c.getSCInit(RESERVE_CONTRACT)
  } catch (err) {
    t.is(err.message, 'Address does not exist')
  }
})

test('[SC] Invalid address using network override', async t => {
  try {
    await client.getSCInit(RESERVE_CONTRACT, { network: 'testnet' })
  } catch (err) {
    t.is(err.message, 'Address does not exist')
  }
})

test('[SC] getSCInit', async t => {
  const init = await client.getSCInit(RESERVE_CONTRACT)

  t.is(init.length, 5)
  t.deepEqual(
    init.map(d => d.vname),
    ['_scilla_version', 'owners_list', 'required_signatures', '_creation_block', '_this_address'],
  )
})

test('[SC] getSCState full', async t => {
  const state = await client.getSCState(RESERVE_CONTRACT)

  t.truthy(state)
  t.truthy(state._balance)
  t.truthy(state.owners)
})

test('[SC] getSCState sub', async t => {
  const subOwners = await client.getSCState({
    address: RESERVE_CONTRACT,
    name: 'owners',
  })

  t.is(Object.keys(subOwners).length, 1)
  t.truthy(subOwners.owners)
  t.is(Object.keys(subOwners.owners).length, 4)

  const subOwner = await client.getSCState({
    address: RESERVE_CONTRACT,
    name: 'owners',
    indices: ['0x09ee3238528247354862700f5c00a349a499badb'],
  })

  t.is(Object.keys(subOwner).length, 1)
  t.truthy(subOwner.owners)
  t.is(Object.keys(subOwner.owners).length, 1)
})

test('[Misc] toHex', t => {
  const expected = 'c6d465559E3BFCEF124Cdd84fEEdE48f996240ff'

  t.is(toHex(RESERVE_CONTRACT), expected, 'Bech32 to (((valid)))')
  t.is(toHex(`0x${expected}`), expected, 'Prefixed to (((valid)))')
  t.is(toHex(expected), expected, 'Same (((valid))) output')
})

test('[Misc] getGasPrice', async t => {
  const gas = await client.getGasPrice()

  t.truthy(gas)
  t.truthy(gas > 0)
})

test('[Socket] Throws with empty subscribe', async t => {
  await t.throwsAsync(client.subscribe())
})

test('[Socket] Throws with wrong subscribe', async t => {
  await t.throwsAsync(client.subscribe('yolo'))
})

test('[Socket] Throws with an invalid key', async t => {
  const client = Zilliqa({ apiKey: 'yolo' })

  const err = await t.throwsAsync(client.subscribe('transaction'))
  t.is(err.message, 'Login failed')
})

test.cb('[Socket] Basic', t => {
  const txFields = [
    'from',
    'to',
    'value',
    'hash',
    'blockHeight',
    'internalTransfers',
    'fee',
    'ts',
    'chain',
  ]

  client.subscribe('transaction', tx => {
    checkFields(t, tx, txFields)
    t.end()
  })

  client.subscribe('block', block => {
    checkFields(t, block, ['timestamp', 'status', 'chain', 'network', 'height'])
    t.end()
  })

  client.subscribe(
    { event: 'addressTx', param: 'zil1z3zky3kv20f37z3wkq86qfy00t4a875fxxw7sw' },
    tx => {
      checkFields(t, tx, txFields)
      t.end()
    },
  )
})
