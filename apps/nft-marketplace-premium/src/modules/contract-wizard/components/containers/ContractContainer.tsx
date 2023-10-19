import Grid from '@mui/material/Grid';
import {
  useContract,
  useContractRead,
  useContractType,
} from '@thirdweb-dev/react';
import { ContractMetadataHeader } from '../ContractMetadataHeader';
import { ContractCollectionDropContainer } from './ContractCollectionDropContainer';
import { ContractEditionDropContainer } from './ContractEditionDropContainer';
import { ContractNftContainer } from './ContractNftContainer';
import { ContractNftDropContainer } from './ContractNftDropContainer';
import ContractStakeErc20Container from './ContractStakeErc20Container';
import { ContractTokenDropContainer } from './ContractTokenDropContainer';

import { hexToString } from '@dexkit/ui/utils';

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
    if (data === 'edition-drop') {
      return (
        <ContractEditionDropContainer address={address} network={network} />
      );
    } else if (data === 'token-drop') {
      return <ContractTokenDropContainer address={address} network={network} />;
    } else if (data === 'nft-drop') {
      return <ContractNftDropContainer address={address} network={network} />;
    } else if (data === 'nft-collection') {
      return <ContractNftContainer address={address} network={network} />;
    } else if (data === 'custom' && contractType === 'TokenStake') {
      return (
        <ContractStakeErc20Container address={address} network={network} />
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ContractMetadataHeader
          address={address}
          network={network}
          contractType={data}
        />
      </Grid>
      <Grid item xs={12}>
        {renderContract()}
        {false && (
          <ContractCollectionDropContainer
            address={address}
            network={network}
          />
        )}
      </Grid>
    </Grid>
  );
}
