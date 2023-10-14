import Grid from '@mui/material/Grid';
import { useContractType } from '@thirdweb-dev/react';
import { ContractMetadataHeader } from '../ContractMetadataHeader';
import { ContractCollectionDropContainer } from './ContractCollectionDropContainer';
import { ContractEditionDropContainer } from './ContractEditionDropContainer';
import { ContractNftContainer } from './ContractNftContainer';
import { ContractNftDropContainer } from './ContractNftDropContainer';
import { ContractTokenDropContainer } from './ContractTokenDropContainer';

interface Props {
  address: string;
  network: string;
}

export function ContractContainer({ address, network }: Props) {
  const { data } = useContractType(address);

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
