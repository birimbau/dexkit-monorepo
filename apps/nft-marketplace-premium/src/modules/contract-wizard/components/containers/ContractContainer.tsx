import Grid from '@mui/material/Grid';
import {
  useContract,
  useContractRead,
  useContractType,
} from '@thirdweb-dev/react';
import { ContractMetadataHeader } from '../ContractMetadataHeader';
import { ContractEditionDropContainer } from './ContractEditionDropContainer';
import { ContractNftContainer } from './ContractNftContainer';
import { ContractNftDropContainer } from './ContractNftDropContainer';
import ContractStakeErc20Container from './ContractStakeErc20Container';
import { ContractTokenDropContainer } from './ContractTokenDropContainer';

import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { useSwitchNetworkMutation } from '@dexkit/ui';
import { hexToString } from '@dexkit/ui/utils';
import { Alert, Button, CircularProgress } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { FormattedMessage } from 'react-intl';
import ContractAirdropErc1155Container from './ContractAirdropErc1155Container';
import ContractAirdropErc20Container from './ContractAirdropErc20Container';
import ContractAirdropErc721Container from './ContractAirdropErc721Container';
import { ContractEditionContainer } from './ContractEditionContainer';
import ContractStakeErc1155Container from './ContractStakeErc1155Container';
import ContractStakeErc721Container from './ContractStakeErc721Container';
import { ContractTokenContainer } from './ContractTokenContainer';

interface Props {
  address: string;
  network: string;
}

export function ContractContainer({ address, network }: Props) {
  const { data } = useContractType(address);

  const { data: contract } = useContract(address);
  const contractRead = useContractRead(contract, 'contractType');

  let contractType = hexToString(contractRead.data);

  const renderContract = () => {
    if (contractType === 'DropERC1155') {
      return (
        <ContractEditionDropContainer address={address} network={network} />
      );
    } else if (contractType === 'DropERC20') {
      return <ContractTokenDropContainer address={address} network={network} />;
    } else if (contractType === 'TokenERC1155') {
      return <ContractEditionContainer address={address} network={network} />;
    } else if (contractType === 'DropERC721') {
      return <ContractNftDropContainer address={address} network={network} />;
    } else if (contractType === 'TokenERC721') {
      return <ContractNftContainer address={address} network={network} />;
    } else if (contractType === 'TokenStake') {
      return (
        <ContractStakeErc20Container address={address} network={network} />
      );
    } else if (contractType === 'NFTStake') {
      return (
        <ContractStakeErc721Container address={address} network={network} />
      );
    } else if (contractType === 'EditionStake') {
      return (
        <ContractStakeErc1155Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC20') {
      return (
        <ContractAirdropErc20Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC721') {
      return (
        <ContractAirdropErc721Container address={address} network={network} />
      );
    } else if (contractType === 'AirdropERC1155') {
      return (
        <ContractAirdropErc1155Container address={address} network={network} />
      );
    } else if (contractType === 'TokenERC20') {
      return <ContractTokenContainer address={address} network={network} />;
    }
  };

  const { chainId: providerChainId } = useWeb3React();
  const switchNetwork = useSwitchNetworkMutation();

  const chainId = NETWORK_FROM_SLUG(network)?.chainId;

  const handleSwitchNetwork = async () => {
    if (chainId && providerChainId !== chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractMetadataHeader
          address={address}
          network={network}
          contractType={data}
          contractTypeV2={contractType}
        />
      </Grid>
      {chainId !== undefined && providerChainId !== chainId ? (
        <Grid item xs={12}>
          <Alert
            severity="warning"
            action={
              <Button
                onClick={handleSwitchNetwork}
                color="inherit"
                variant="outlined"
                size="small"
                disabled={switchNetwork.isLoading}
                startIcon={
                  switchNetwork.isLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
              >
                <FormattedMessage
                  id="switch.network"
                  defaultMessage="Switch network"
                />
              </Button>
            }
          >
            <FormattedMessage
              id="you.are.on.a.network.different.of.the.contract"
              defaultMessage="You are on a network different of the contract"
            />
          </Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          {renderContract()}
        </Grid>
      )}
    </Grid>
  );
}
