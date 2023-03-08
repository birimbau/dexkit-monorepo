import { Search } from '@mui/icons-material';
import Add from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { NextPage } from 'next';
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Wallet from '../../src/components/icons/Wallet';
import AuthMainLayout from '../../src/components/layouts/authMain';
import Link from '../../src/components/Link';
import { PageHeader } from '../../src/components/PageHeader';
import {
  DEXKIT_DISCORD_SUPPORT_CHANNEL,
  WIZARD_DOCS_URL,
} from '../../src/constants';
import { useConnectWalletDialog } from '../../src/hooks/app';
import { useDebounce } from '../../src/hooks/misc';
import { useWhitelabelConfigsByOwnerQuery } from '../../src/hooks/whitelabel';
import MarketplacesTableSkeleton from '../../src/modules/admin/components/tables/MaketplacesTableSkeleton';
import MarketplacesTable from '../../src/modules/admin/components/tables/MarketplacesTable';
import ConfigureDomainDialog from '../../src/modules/wizard/components/dialogs/ConfigureDomainDialog';
import { ConfigResponse } from '../../src/types/whitelabel';

export const AdminIndexPage: NextPage = () => {
  const { account, isActive } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();
  const configsQuery = useWhitelabelConfigsByOwnerQuery({ owner: account });

  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [selectedConfig, setSelectedConfig] = useState<ConfigResponse>();

  const lazySearch = useDebounce<string>(search, 500);

  const handleShowConfigureDomain = (config: ConfigResponse) => {
    setSelectedConfig(config);
    setIsOpen(true);
  };

  const handleCloseConfigDomain = () => {
    setIsOpen(false);
  };

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const handleHrefDocs = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={WIZARD_DOCS_URL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const configs = useMemo(() => {
    if (configsQuery.data && configsQuery.data.length > 0) {
      if (lazySearch) {
        return configsQuery.data.filter(
          (c) =>
            c.appConfig.name.toLowerCase().search(lazySearch.toLowerCase()) > -1
        );
      }

      return configsQuery.data;
    }

    return [];
  }, [configsQuery.data, lazySearch]);

  const renderTable = () => {
    if (configsQuery.isLoading) {
      return <MarketplacesTableSkeleton />;
    }

    if (configs && configs.length > 0) {
      return (
        <TableContainer>
          <MarketplacesTable
            configs={configs}
            onConfigureDomain={handleShowConfigureDomain}
          />
        </TableContainer>
      );
    }

    return isActive ? (
      <Box py={4}>
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          spacing={2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <Typography variant="h5">
              <FormattedMessage id="no.apps" defaultMessage="No Apps" />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="create.one.to.start.selling.NFTs.or.crypto"
                defaultMessage="Create one App to start trade NFTs or crypto"
              />
            </Typography>
          </Stack>
          <Button
            LinkComponent={Link}
            href="/admin/setup"
            startIcon={<Add />}
            variant="outlined"
          >
            <FormattedMessage id="new" defaultMessage="New" />
          </Button>
        </Stack>
      </Box>
    ) : (
      <Box py={4}>
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          spacing={2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <Typography variant="h5">
              <FormattedMessage
                id="no.wallet.connected"
                defaultMessage="No Wallet connected"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="connect.wallet.to.see.apps.associated.with.your.account"
                defaultMessage="Connect wallet to see apps associated with your account"
              />
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => connectWalletDialog.setOpen(true)}
            startIcon={<Wallet />}
            endIcon={<ChevronRightIcon />}
          >
            <FormattedMessage
              id="connect.wallet"
              defaultMessage="Connect Wallet"
              description="Connect wallet button"
            />
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <ConfigureDomainDialog
        dialogProps={{
          open: isOpen,
          onClose: handleCloseConfigDomain,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        config={selectedConfig}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="admin" defaultMessage="Admin" />
                  ),
                  uri: '/admin',
                },
                {
                  caption: <FormattedMessage id="apps" defaultMessage="Apps" />,
                  uri: '/admin',
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Alert severity="info">
              <FormattedMessage
                id="wizard.welcome.index.message"
                defaultMessage="Welcome to DexAppBuilder! This is a beta product with constant development and at the moment is offered for free. 
              If you need support please reach us on our <a>dedicated Discord channel</a>. Please check our <d>docs</d> for whitelabels. Reach us at our email <b>info@dexkit.com</b> if you need a custom solution that the wizard not attend."
                values={{
                  //@ts-ignore
                  a: handleHrefDiscord,
                  //@ts-ignore
                  d: handleHrefDocs,
                  //@ts-ignore
                  b: (chunks) => <b>{chunks} </b>,
                }}
              />
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                href="/admin/setup"
                LinkComponent={Link}
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="new" defaultMessage="New" />
              </Button>
              <TextField
                value={search}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {renderTable()}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

(AdminIndexPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default AdminIndexPage;
