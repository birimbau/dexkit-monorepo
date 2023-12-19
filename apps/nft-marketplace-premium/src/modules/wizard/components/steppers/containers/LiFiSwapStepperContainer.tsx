import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import { PageHeader } from 'src/components/PageHeader';
import { useSendConfigMutation } from 'src/hooks/whitelabel';
import { AppConfig } from 'src/types/config';
import { SiteResponse } from 'src/types/whitelabel';
import theDefaultConfig from '../../../../../../config/quick.lifi-swap.default.app.json';
import { PreviewAppButton } from '../../PreviewAppButton';
import SignConfigDialog from '../../dialogs/SignConfigDialog';
import LiFiStepper from '../LiFiStepper/LiFiStepper';
import { WelcomeSwapStepperMessage } from '../Welcome/WelcomeSwapStepperMessage';
const defaultConfig = theDefaultConfig as unknown as AppConfig;

interface Props {
  site?: SiteResponse | null;
}

export default function LiFiSwapStepperContainer({ site }: Props) {
  const sendConfigMutation = useSendConfigMutation({ slug: site?.slug });
  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const router = useRouter();
  const config = useMemo(() => {
    if (site?.config) {
      return JSON.parse(site?.config);
    }
  }, [site?.config]);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showSendingConfig, setShowSendingConfig] = useState(false);
  const [wizardConfig, setWizardConfig] = useState(defaultConfig);

  useEffect(() => {
    if (config) {
      setWizardConfig(config);
    }
  }, [config]);

  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);
    setShowSendingConfig(true);
  };

  const handleSave = (_config: AppConfig) => {
    setShowConfirmSendConfig(true);
    const newSite = { ...site, config: _config };
    sendConfigMutation.mutate(newSite);
  };

  const handleChange = useCallback(
    (_config: AppConfig) => {
      const newConfig = { ...wizardConfig, ..._config };
      setWizardConfig(newConfig);
    },

    [wizardConfig, setWizardConfig],
  );

  const handleCloseSendingConfig = () => {
    setShowSendingConfig(false);
    const data = sendConfigMutation?.data;
    if (data && data?.slug) {
      router.push(`/admin/edit/${data?.slug}`);
    }
    sendConfigMutation.reset();
  };

  return (
    <Container maxWidth={'xl'}>
      <AppConfirmDialog
        dialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="create.lifiswap.app"
              defaultMessage="Create Li.Fi swap app"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.create.a.lifi.swap.app"
              defaultMessage="Do you really want to create a LI.FI swap app?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <SignConfigDialog
        dialogProps={{
          open: showSendingConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendingConfig,
        }}
        isLoading={sendConfigMutation.isLoading}
        isSuccess={sendConfigMutation.isSuccess}
        error={sendConfigMutation.error}
        isEdit={true}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
          >
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
                },
                {
                  caption: (
                    <FormattedMessage
                      id="lifi.swap.quick.builder"
                      defaultMessage="LI.FI swap quick builder"
                    />
                  ),
                  uri: '/admin/quick-builder/lifi-swap',
                  active: true,
                },
              ]}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <WelcomeSwapStepperMessage />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            {!isMobile && (
              <Typography variant="h5">
                <FormattedMessage
                  id="lifi.quick.swap.builder"
                  defaultMessage="LI.FI quick swap builder"
                />
              </Typography>
            )}
            <Stack direction={'row'} spacing={2}>
              <PreviewAppButton appConfig={wizardConfig} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <LiFiStepper
            onSave={handleSave}
            onChange={handleChange}
            config={wizardConfig}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
