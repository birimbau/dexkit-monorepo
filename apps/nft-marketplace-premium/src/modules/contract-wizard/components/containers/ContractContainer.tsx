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
import { ContractEditionContainer } from './ContractEditionContainer';
import ContractStakeErc1155Container from './ContractStakeErc1155Container';
import ContractStakeErc721Container from './ContractStakeErc721Container';

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
