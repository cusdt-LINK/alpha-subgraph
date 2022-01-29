/* eslint-disable prefer-const */
import { Pair, Token, Bundle } from '../types/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD, UNTRACKED_PAIRS } from './helpers'

const WETH_ADDRESS = '0x4446fc4eb47f2f6586f9faab68b3498f86c07521'
const USDC_WETH_PAIR = '0x94bd136053aacce8bc80eaaadfc7bd1b1f5c51b3' // created block
const DAI_WETH_PAIR = '0x16f76820b16c3e2f8697258b22cdc11af950e65a'  // created block
const USDT_WETH_PAIR = '0xb3b92d6b2656f9ceb4a381718361a21bf9b82bd9' // created block

export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token1
  let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token1
  let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token0

  // all 3 have been created
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0).plus(usdtPair.reserve1)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    let usdtWeight = usdtPair.reserve1.div(totalLiquidityETH)
    return daiPair.token1Price
      .times(daiWeight)
      .plus(usdcPair.token1Price.times(usdcWeight))
      .plus(usdtPair.token0Price.times(usdtWeight))
    // dai and USDC have been created
  } else if (daiPair !== null && usdcPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    return daiPair.token1Price.times(daiWeight).plus(usdcPair.token1Price.times(usdcWeight))
    // USDC is the only pair so far
  } else if (usdcPair !== null) {
    return usdcPair.token1Price
  } else {
    return ZERO_BD
  }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  '0x4446fc4eb47f2f6586f9faab68b3498f86c07521', // WKCS
  '0x0039f574ee5cc39bdd162e9a88e3eb1f111baf48', // USDT
  '0x980a5afef3d17ad98635f6c5aebcbaeded3c3430', // USDC
  '0xf55af137a98607f7ed2efefa4cd2dfe70e4253b1', // ETH
  '0xee58e4d62b10a92db1089d4d040b759c28ae16cd', // UNI
  '0x47841910329aaa6b88d5e9dcde9000195151dc72', // LINK
  '0x652d253b7ca91810a4a05acfc39729387c5090c0', // CRO
  '0xb49dd3edb98fbe82a01dfcb556cd016964baf5a3', // GRT
  '0xde81028c743f5304fe2cdefac588f572d629a687', // MKR
  '0x791630c11c7159a748d8c2267a66780b3ddc40a7', // QNT
  '0x16c4106966ce30e06e806a7c40eefb46d84ce7e5', // COMP
  '0x31965b5c9c55f5579eb49f4b3acc59aa10a7b98e', // SNX
  '0x6e8ce0519b7e4d691bace464099547e5fc17679c', // CHZ
  '0x6e2d990c8e718e7b6d86ed08ebf0ff2dec05253b', // ENJ
  '0xd17027b85abf02721f953ee528721a980fa58941', // TUSD
  '0xdfa3ef49d357c6b0b2dfbb88701af2b7a053fd0a', // YFI
  '0x621c1e8610e4b9b7fc9f043203c008ede52e92f5', // TEL
  '0xb7a18bd55e8e3e2262d7c8ee7b4dd9b216df0faf', // NEXO
  '0x0bf46c86ce3b904660ae85677eaa20b0c1b24064', // BAT
  '0x69a7169f9da9bba04b982e49ffd8d6a16c70c590', // PAX
  '0xbec1e1009ce00ecf7f16372451ac849b39c32897', // HUSD
  '0x79f3244f3ffd7500a31a90bb83c7d56649c2c7c5', // 1INCH
  '0x73b6086955c820370a18002f60e9b51fb67d7e1a', // SHIB
  '0x4500e16da66b99e0c55d7b46ebbd59bc413ba171', // CRV
  '0xe0a60890bb7f9250089455620063fb6fe4dc159a', // SUSHI
  '0xe76e97c157658004ee22e01c03a5e21a4655a2fd', // AAVE
  '0x8724f9fb7b3f1bb6f2c90b3ad3fd6b3c20a06429', // DODO
  '0x1b8e27aba297466fc6765ce55bd12a8e216759da', // MATIC
  '0xfc31366be1795c1ff444b9fbf55759733ad4d26d', // BAL
  '0xc19a5cacc2bb68ff09f2fcc695f31493a039fa5e', // MANA
  '0x2ca48b4eea5a731c2b54e7c3944dbdb87c0cfb6f', // MJT
  '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055', // DAI
  '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0', // BTC
  '0x4a81704d8c16d9fb0d7f61b747d0b5a272badf14', // KUS
  '0xbd451b952de19f2c7ba2c8c516b0740484e953b2', // KUD
  '0x516f50028780b60e2fe08efa853124438f9e46a7', // KAFE
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('400000')

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BD
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString())
      if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
      }
      if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        let token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    let reserve0USD = pair.reserve0.times(price0)
    let reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}
