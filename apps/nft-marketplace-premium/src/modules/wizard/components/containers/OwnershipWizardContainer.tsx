import { Tooltip } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import { useAccountHoldDexkitQuery } from 'src/hooks/account';
import { SiteResponse } from 'src/types/whitelabel';
import { AppConfig } from '../../../../types/config';
import OwnershipSection from '../sections/OwnershipSection';
import HidePoweredContainer from './HidePoweredContainer';

interface Props {
  site?: SiteResponse | null;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}
export default function OwnershipWizardContainer({
  config,
  onSave,
  onHasChanges,
  site,
}: Props) {
  const { data } = useAccountHoldDexkitQuery();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Tooltip
            placement="top-start"
            title={
              <FormattedMessage
                id={'ownership.explainer'}
                defaultMessage={
                  'This NFT represents app ownership and editing rights. You can sell or transfer your app ownership through this NFT, hosted on Polygon. Who owns this NFT can edit it. '
                }
              />
            }
          >
            <Typography variant={'h6'}>
              <FormattedMessage id="ownership" defaultMessage="Ownership" />
            </Typography>
          </Tooltip>

          <Typography variant={'body2'}>
            <FormattedMessage
              id="ownership.settings.description"
              defaultMessage="Associate an NFT with your app for ownership control"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {data === false && (
          <Alert severity="warning">
            <FormattedMessage
              id="ownership.nft.info"
              defaultMessage="To access this feature, simply hold 1000 KIT tokens on one of our supported networks: ETH, BSC, or Polygon.
              Note: NFT-associated apps are not clonable.
              "
            />
          </Alert>
        )}
      </Grid>

      <Grid item xs={12}>
        {site?.id !== undefined && (
          <OwnershipSection id={site.id} nft={site.nft} />
        )}
      </Grid>
      <Grid item xs={12}>
        {site?.id !== undefined && (
          <HidePoweredContainer
            config={config}
            onSave={onSave}
            isDisabled={data === false}
            hasNFT={site?.nft !== undefined}
          />
        )}
      </Grid>
    </Grid>
  );
}
