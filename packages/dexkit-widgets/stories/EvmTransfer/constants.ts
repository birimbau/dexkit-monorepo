import { CoinTypes } from "../../src/widgets/evm-transfer/enum";
import { Coin } from "../../src/widgets/evm-transfer/types";



export const POLYGON_USDT_TOKEN: Coin = {
  network: {
    id: 'polygon',
    name: 'Polygon'
  },
  coinType: CoinTypes.EVM_ERC20,
  contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
};

export const Account = {
  address: '0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d'
}