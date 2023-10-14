import NFTGrid from '@/modules/wizard/components/NFTGrid';
import Grid from '@mui/material/Grid';
import { useContract, useContractType, useNFTs } from '@thirdweb-dev/react';
import { useState } from 'react';
import { Button } from 'react-admin';
import { FormattedMessage } from 'react-intl';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';

interface Props {
  address: string;
  network: string;
}

export function ContractNftContainer({ address, network }: Props) {
  const { data: contract } = useContract(address, 'nft-collection');
  const { data, isLoading, error } = useContractType(address);

  const nftsQuery = useNFTs(contract);

  const [isOpen, setIsOpen] = useState(false);

  const handleMint = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <CreateAssetFormDialog
        dialogProps={{
          open: isOpen,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'xl',
        }}
        network={network}
        address={address}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button onClick={handleMint} variant="contained">
            <FormattedMessage id="mint" defaultMessage="Mint" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <NFTGrid
            network={network}
            address={address}
            nfts={nftsQuery.data || []}
          />
        </Grid>
      </Grid>
    </>
  );
}
