import crypto from '@zilliqa-js/crypto'

const zilReg = /^zil1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}$/

export default address => {
  if (address.startsWith('0x')) {
    return address.substr(2)
  }

  if (!address.match(zilReg)) {
    return address
  }

  const hex = crypto.fromBech32Address(address)

  return hex.substr(2)
}
