import { CoinTypes } from '@dexkit/core/constants';
import { EvmCoin } from '@dexkit/core/types';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import EvmReceiveForm from '@dexkit/ui/components/EvmReceiveForm';
import EvmReceiveQRCode from '@dexkit/ui/components/EvmReceiveQRCode';
import { useEvmCoins } from '@dexkit/ui/hooks/blockchain';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import { useWeb3React } from '@web3-react/core';

type Props = {
  receiver?: string | null;
  coin?: EvmCoin | null;
  chainId?: number;
  amount?: number | null;
  ENSName?: string;
};

// you can pass the shape of the data as the generic type argument
const QrCodeReceive: CellPlugin<Props> = {
  Renderer: ({ data }) => (
    <EvmReceiveQRCode
      receiver={data.receiver as string}
      chainId={
        data.coin?.network.chainId ? data.coin?.network.chainId : data.chainId
      }
      contractAddress={
        data.coin?.coinType === CoinTypes.EVM_ERC20
          ? data.coin.contractAddress
          : undefined
      }
      amount={
        data.amount
          ? parseUnits(String(data.amount), data.coin?.decimals).toString()
          : undefined
      }
    />
  ),
  id: 'qr-code-receive-payment',
  title: 'QR Coin Receive',
  description: 'Receive coin payment by people that scan your QR code',
  icon: <QrCodeIcon />,
  version: 1,
  controls: {
    type: 'custom',
    Component: (data) => {
      const { account, chainId } = useWeb3React();
      const evmCoins = useEvmCoins({
        defaultChainId: data.data.chainId || chainId,
      });
      return (
        <Container sx={{ p: 2 }}>
          <EvmReceiveForm
            onChange={data.onChange}
            defaultCoin={data.data.coin}
            defaultENSName={data.data.ENSName}
            defaultReceiver={data.data.receiver || account}
            defaultChainId={data.data.chainId || chainId}
            defaultAmount={data.data.amount}
            coins={evmCoins}
          />
        </Container>
      );
    },
  },
};

export default QrCodeReceive;
