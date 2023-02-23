import {
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppConfirmDialog from '../../../../components/AppConfirmDialog';
import {
  useSetupDomainConfigMutation,
  useVerifyDomainMutation,
} from '../../../../hooks/whitelabel';
import { AppConfig } from '../../../../types/config';
import { SiteResponse } from '../../../../types/whitelabel';
import CheckDomainDialog from '../dialogs/CheckDomainDialog';
import DeployDomainDialog from '../dialogs/CheckDomainDialog';
import DomainSection, { DomainSectionForm } from '../sections/DomainSection';
import InfoIcon from '@mui/icons-material/Info';
import InfoDialog from '../dialogs/InfoDialog';
import { useSnackbar } from 'notistack';
interface Props {
  config: AppConfig;
  site?: SiteResponse;
  onSave: (config: AppConfig) => void;
}

export default function DomainWizardContainer({ config, onSave, site }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [openInfo, setOpenInfo] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const { formatMessage } = useIntl();
  const [isDeployConfirmOpen, setIsDeployConfirmOpen] = useState(false);
  const [isDeploySignOpen, setIsDeploySignOpen] = useState(false);
  const [isCheckDeployOpen, setIsCheckDeployOpen] = useState(false);
  const [domainData, setDomainData] = useState<DomainSectionForm>();
  const verifyDomainMutation = useVerifyDomainMutation();
  const deployDomainMutation = useSetupDomainConfigMutation();

  const handleSubmitGeneral = (form: DomainSectionForm) => {
    setDomainData(form);
    if (form) {
      const newConfig = {
        ...config,
        domain: form.domain,
      };
      onSave(newConfig);
    }
  };
  useEffect(() => {
    if (config.domain) {
      setDomainData({
        domain: config.domain,
      });
    }
  }, [config]);

  const handleConfirmDeploy = () => {
    if (site && site.domain) {
      deployDomainMutation.mutate(
        {
          domain: site.domain,
        },
        {
          onSuccess: () => {
            setIsDeploySignOpen(false);
          },
          onError: console.log,
        }
      );
    }
    setIsDeploySignOpen(true);
    setIsDeployConfirmOpen(false);
  };

  const handleDeploy = () => {
    setIsDeployConfirmOpen(true);
  };

  const handleDeployCheckSuccess = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Marketplace domain added',
        id: 'marketplace.domain.added',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      }
    );
  };

  const handleDeployCheckError = (error: any) => {
    enqueueSnackbar(
      `${formatMessage({
        defaultMessage: 'Domain still not propagated',
        id: 'domain.error.propagated',
      })}: ${String(error)}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      }
    );
  };

  const handleCheckDeploy = () => {
    if (site) {
      setIsCheckDeployOpen(true);
      verifyDomainMutation.mutate(
        { domain: site.domain },
        {
          onError: handleDeployCheckError,
          onSuccess: handleDeployCheckSuccess,
        }
      );
    }
  };

  const handleCloseDeployDomain = () => {
    setIsDeploySignOpen(false);
  };
  const handleCloseCheckDeploy = () => {
    setIsCheckDeployOpen(false);
  };

  const handleClose = () => {
    setIsDeployConfirmOpen(false);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  const handleOpenCNAMEINfoDialog = useCallback(() => {
    setOpenInfo(true);
    setTitleInfo(
      formatMessage({
        id: 'info.wizard.title.domain.records.setup',
        defaultMessage: 'Domain records setup info',
      })
    );
    setContentInfo(
      formatMessage({
        id: 'info.wizard.content.cname',
        defaultMessage: `Deploy your domain, make sure first your domain is not used with other records. After domain successfully added to our system you will receive a CNAME and A record to be added to your DNS provider. After added the CNAME and A record, press button check deploy status, if status VERIFIED, wait for domain to propagate and you will have your marketplace set on your custom domain. 
          Note, if you are on a subdomain, replace @ with subdomain value. Any issue contact our support channels.`,
      })
    );
  }, []);

  const domainStatusText = useMemo(() => {
    if (site?.domainStatus === 'NOT_VERIFIED') {
      return (
        <FormattedMessage id="not.verified" defaultMessage="Not verified" />
      );
    }

    if (site?.domainStatus === 'VERIFIED') {
      return <FormattedMessage id="verified" defaultMessage="Verified" />;
    }
    return <FormattedMessage id="not.deployed" defaultMessage="Not deployed" />;
  }, [site?.domainStatus]);

  return (
    <>
      <InfoDialog
        dialogProps={{
          open: openInfo,
          onClose: handleCloseInfo,
        }}
        title={titleInfo}
        content={contentInfo}
      />
      <AppConfirmDialog
        dialogProps={{
          open: isDeployConfirmOpen,
          onClose: handleClose,
        }}
        onConfirm={handleConfirmDeploy}
      >
        <FormattedMessage
          id="do.you.really.want.to.deploy.this.domain"
          defaultMessage="Do you really want to deploy this domain: {domain}"
          values={{ domain: config?.domain || '' }}
        />
      </AppConfirmDialog>
      <DeployDomainDialog
        dialogProps={{
          open: isDeploySignOpen,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseDeployDomain,
        }}
        isLoading={deployDomainMutation.isLoading}
        isSuccess={deployDomainMutation.isSuccess}
        error={deployDomainMutation.error}
      />
      <CheckDomainDialog
        dialogProps={{
          open: isCheckDeployOpen,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseCheckDeploy,
        }}
        isLoading={verifyDomainMutation.isLoading}
        isSuccess={verifyDomainMutation.isSuccess}
        error={verifyDomainMutation.error}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'subtitle2'}>
              <FormattedMessage id="domains" defaultMessage="Domains" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="domains"
                defaultMessage="Set custom domain"
              />
            </Typography>
          </Stack>
        </Grid>
        {config.domain && (
          <>
            {' '}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction={'row'}
                spacing={1}
                justifyContent={'space-between'}
              >
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    <FormattedMessage id="status" defaultMessage="Status" />:{' '}
                  </Typography>
                  <Typography>{domainStatusText} </Typography>
                </Stack>
                <Stack direction={'row'} spacing={1}>
                  {!site?.cname && site && (
                    <Button variant="contained" onClick={() => handleDeploy()}>
                      <FormattedMessage id="deploy" defaultMessage="Deploy" />
                    </Button>
                  )}
                  {site?.cname && site.domainStatus !== 'VERIFIED' && (
                    <Button variant="contained" onClick={handleCheckDeploy}>
                      <FormattedMessage
                        id="check.deploy.status"
                        defaultMessage="Check deploy Status"
                      />
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </>
        )}

        {site?.cname && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack
                spacing={1}
                direction={'row'}
                alignContent={'center'}
                alignItems={'center'}
              >
                <Typography>
                  <FormattedMessage
                    id="domain.records"
                    defaultMessage="Domain records"
                  />
                </Typography>
                <IconButton
                  aria-label="name info"
                  edge="end"
                  onClick={handleOpenCNAMEINfoDialog}
                >
                  <InfoIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={'column'} spacing={1}>
                <Typography>
                  <FormattedMessage id="cname" defaultMessage="CNAME" />{' '}
                </Typography>
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    {' '}
                    <FormattedMessage id="name" defaultMessage="name" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{'@'}</Typography>
                  <Typography>
                    <FormattedMessage id="value" defaultMessage="Value" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {'cname.vercel-dns.com'}{' '}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction={'column'} spacing={1}>
                <Typography>
                  <FormattedMessage id="a.record" defaultMessage="A Record" />{' '}
                </Typography>
                <Stack direction={'row'} spacing={1}>
                  <Typography>
                    {' '}
                    <FormattedMessage id="name" defaultMessage="name" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{'@'}</Typography>
                  <Typography>
                    <FormattedMessage id="value" defaultMessage="Value" />:
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {'76.76.21.21'}{' '}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <DomainSection
            initialValues={domainData}
            onSubmit={handleSubmitGeneral}
          />
        </Grid>
      </Grid>
    </>
  );
}
