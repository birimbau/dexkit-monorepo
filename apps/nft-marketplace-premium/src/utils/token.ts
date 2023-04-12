import { ChainId } from '@dexkit/core/constants';
import { BigNumber, ethers } from 'ethers';
import defaultConfig from '../../config/default.tokenlist.json';

export function GET_TOKEN(address: string, chainId: number) {
  let index = defaultConfig.tokens.findIndex((t) => {
    return (
      t.address.toLowerCase() === address.toLowerCase() && Number(t.chainId) === chainId
    );
  });
  if (index === -1) {
    return;
  }

  return defaultConfig.tokens[index];
}

export function TOKEN_ICON_URL(addr: string, chainId?: ChainId) {
  const address = addr.toLowerCase();

  switch (chainId) {
    case ChainId.Ethereum:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/ethereum/assets/${address}/logo.png`;
    case ChainId.Polygon:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/polygon/assets/${address}/logo.png`;
    case ChainId.Avax:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/avalanchex/assets/${address}/logo.png`;
    case ChainId.BSC:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/binance/assets/${address}/logo.png`;
    case ChainId.Fantom:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/fantom/assets/${address}/logo.png`;
    case ChainId.Celo:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/celo/assets/${address}/logo.png`;
    case ChainId.Optimism:
      return `https://raw.githubusercontent.com/trustwallet/tokens/master/blockchains/optimism/assets/${address}/logo.png`;
    default:
      return '';
  }
}

export function formatUnits(balance: BigNumber, decimals: number) {
  return Number(ethers.utils.formatUnits(balance, decimals)).toFixed(3);
}
