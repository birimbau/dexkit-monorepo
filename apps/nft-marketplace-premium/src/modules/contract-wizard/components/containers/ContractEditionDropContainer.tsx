import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import NoSsr from '@mui/material/NoSsr';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useContract } from '@thirdweb-dev/react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppErrorBoundary } from 'src/components/AppErrorBoundary';
import { useCollection } from 'src/hooks/nft';
import { AssetListContractCollection } from '../AssetListContractCollection';
import CreateAssetFormDialog from '../dialogs/CreateAssetFormDialog';

interface Props {
  address: string;
  network: string;
}

export function ContractEditionDropContainer({ address, network }: Props) {
  const [openMintDialog, setOpenMintDialog] = useState(false);
  const { data: collection } = useCollection(
    address as string,
    NETWORK_FROM_SLUG(network)?.chainId,
  );
  const [search, setSearch] = useState<string>();
  const contract = useContract(address);

  return (
    <>
      <CreateAssetFormDialog
        dialogProps={{
          open: openMintDialog,
          onClose: () => setOpenMintDialog(false),
          fullWidth: true,
          maxWidth: 'xl',
        }}
        network={network}
        address={address}
        isERC1155={true}
        isLazyMint={true}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant={'outlined'} onClick={() => setOpenMintDialog(true)}>
            <FormattedMessage defaultMessage={'Mint NFT'} id={'mint.nft'} />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <NoSsr>
            <AppErrorBoundary
              fallbackRender={({ resetErrorBoundary, error }) => (
                <Stack justifyContent="center" alignItems="center">
                  <Typography variant="h6">
                    <FormattedMessage
                      id="something.went.wrong"
                      defaultMessage="Oops, something went wrong"
                      description="Something went wrong error message"
                    />
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {String(error)}
                  </Typography>
                  <Button color="primary" onClick={resetErrorBoundary}>
                    <FormattedMessage
                      id="try.again"
                      defaultMessage="Try again"
                      description="Try again"
                    />
                  </Button>
                </Stack>
              )}
            >
              <AssetListContractCollection
                contractAddress={address as string}
                network={network as string}
                search={search}
              />
            </AppErrorBoundary>
          </NoSsr>
        </Grid>
      </Grid>
    </>
  );
}
