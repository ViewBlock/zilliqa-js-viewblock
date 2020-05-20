import { fromBech32Address } from '@zilliqa-js/crypto'

export default address => {
  if (address.startsWith('0x')) {
    return address.substr(2)
  }

  if (!address.startsWith('zil')) {
    return address
  }

  const hex = fromBech32Address(address)

  return hex.substr(2)
}
