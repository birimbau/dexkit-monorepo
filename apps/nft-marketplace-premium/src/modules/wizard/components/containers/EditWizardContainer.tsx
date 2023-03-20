import {
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  ListSubheader,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import Close from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppConfirmDialog from '../../../../components/AppConfirmDialog';
import Link from '../../../../components/Link';
import { PageHeader } from '../../../../components/PageHeader';
import { useSendConfigMutation } from '../../../../hooks/whitelabel';
import { AppConfig } from '../../../../types/config';
import { SiteResponse } from '../../../../types/whitelabel';
import { useAppWizardConfig } from '../../hooks';

import { BuilderKit } from '../../constants';
import BuilderKitMenu from '../BuilderKitMenu';
import SignConfigDialog from '../dialogs/SignConfigDialog';
import { PreviewAppButton } from '../PreviewAppButton';
import { WelcomeMessage } from '../WelcomeMessage';

const OwnershipWizardContainer = dynamic(
  () => import('./OwnershipWizardContainer')
);
const CollectionWizardContainer = dynamic(
  () => import('./CollectionWizardContainer')
);
const DomainWizardContainer = dynamic(() => import('./DomainWizardContainer'));
const FooterMenuWizardContainer = dynamic(
  () => import('./FooterMenuWizardContainer')
);
const GeneralWizardContainer = dynamic(
  () => import('./GeneralWizardContainer')
);
const MarketplaceFeeWizardContainer = dynamic(
  () => import('./MarketplaceFeeWizardContainer')
);
const PagesMenuWizardContainer = dynamic(
  () => import('./PagesMenuWizardContainer')
);
const PagesWizardContainer = dynamic(() => import('./PagesWizardContainer'));
const SeoWizardContainer = dynamic(() => import('./SeoWizardContainer'));
const SocialWizardContainer = dynamic(() => import('./SocialWizardContainer'));
const SwapFeeWizardContainer = dynamic(
  () => import('./SwapFeeWizardContainer')
);
const ThemeWizardContainer = dynamic(() => import('./ThemeWizardContainer'));
const TokenWizardContainer = dynamic(() => import('./TokenWizardContainer'));
const AnalyticsWizardContainer = dynamic(
  () => import('./AnalyticsWizardContainer')
);

interface Props {
  site?: SiteResponse;
}

enum ActiveMenu {
  General = 'general',
  Domain = 'domain',
  Social = 'social',
  Theme = 'theme',
  Pages = 'pages',
  Menu = 'menu',
  FooterMenu = 'footer-menu',
  Seo = 'seo',
  Analytics = 'analytics',
  MarketplaceFees = 'marketplace-fees',
  SwapFees = 'swap-fees',
  Collections = 'collections',
  Tokens = 'tokens',
  Ownership = 'ownership',
}

const ListSubheaderCustom = styled(ListSubheader)({
  fontWeight: 'bold',
});

export function EditWizardContainer({ site }: Props) {
  const config = useMemo(() => {
    if (site?.config) {
      return JSON.parse(site?.config);
    }
  }, [site?.config]);
  const { formatMessage } = useIntl();

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(ActiveMenu.General);
  const [activeBuilderKit, setActiveBuilderKit] = useState<BuilderKit>(
    BuilderKit.ALL
  );
  console.log(activeBuilderKit);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sendConfigMutation = useSendConfigMutation({ slug: site?.slug });

  const { setWizardConfig, wizardConfig } = useAppWizardConfig();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const [showSendingConfig, setShowSendingConfig] = useState(false);

  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);

  useEffect(() => {
    if (config) {
      setWizardConfig(config);
    }
  }, [config]);

  useEffect(() => {
    if (config) {
      setWizardConfig(config);
    }
  }, [activeMenu, config]);

  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);
    setShowSendingConfig(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleShowMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseSendingConfig = () => {
    setShowSendingConfig(false);
    sendConfigMutation.reset();
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

    [wizardConfig, setWizardConfig]
  );

  const renderMenu = () => (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="settings">
        <List
          disablePadding
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="settings" defaultMessage={'Settings'} />
            </ListSubheaderCustom>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.General}
              onClick={() => setActiveMenu(ActiveMenu.General)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="general" defaultMessage={'General'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Domain}
              onClick={() => setActiveMenu(ActiveMenu.Domain)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="domains" defaultMessage={'Domain'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Ownership}
              onClick={() => setActiveMenu(ActiveMenu.Ownership)}
            >
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ownership"
                    defaultMessage={'Ownership'}
                  />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Social}
              onClick={() => setActiveMenu(ActiveMenu.Social)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="social" defaultMessage={'Social'} />
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="layout" defaultMessage={'Layout'} />
            </ListSubheaderCustom>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Theme}
              onClick={() => setActiveMenu(ActiveMenu.Theme)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="theme" defaultMessage={'Theme'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveMenu(ActiveMenu.Pages)}
              selected={activeMenu === ActiveMenu.Pages}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="pages" defaultMessage={'Pages'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveMenu(ActiveMenu.Menu)}
              selected={activeMenu === ActiveMenu.Menu}
            >
              <ListItemText
                primary={<FormattedMessage id="menu" defaultMessage={'Menu'} />}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveMenu(ActiveMenu.FooterMenu)}
              selected={activeMenu === ActiveMenu.FooterMenu}
            >
              <ListItemText
                primary={
                  <FormattedMessage
                    id="footer.menu"
                    defaultMessage={'Footer Menu'}
                  />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => setActiveMenu(ActiveMenu.Seo)}
            selected={activeMenu === ActiveMenu.Seo}
          >
            <ListItemButton>
              <ListItemText
                primary={<FormattedMessage id="seo" defaultMessage={'SEO'} />}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => setActiveMenu(ActiveMenu.Analytics)}
            selected={activeMenu === ActiveMenu.Analytics}
          >
            <ListItemButton>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="analytics"
                    defaultMessage={'Analytics'}
                  />
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="fees">
        <List
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="fee" defaultMessage={'Fees'} />
            </ListSubheaderCustom>
          }
        >
          {activeBuilderKit !== BuilderKit.Swap && (
            <ListItem disablePadding>
              <ListItemButton
                selected={activeMenu === ActiveMenu.MarketplaceFees}
                onClick={() => setActiveMenu(ActiveMenu.MarketplaceFees)}
              >
                <ListItemText
                  primary={
                    <FormattedMessage
                      id="marketplace.fees"
                      defaultMessage={'Marketplace fees'}
                    />
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
          {activeBuilderKit !== BuilderKit.NFT && (
            <ListItem disablePadding>
              <ListItemButton
                selected={activeMenu === ActiveMenu.SwapFees}
                onClick={() => setActiveMenu(ActiveMenu.SwapFees)}
              >
                <ListItemText
                  primary={
                    <FormattedMessage
                      id="swap.fees"
                      defaultMessage={'Swap fees'}
                    />
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </nav>
      <Divider />
      <nav aria-label="data">
        <List
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="data" defaultMessage={'Data'} />
            </ListSubheaderCustom>
          }
        >
          {activeBuilderKit !== BuilderKit.Swap && (
            <ListItem disablePadding>
              <ListItemButton
                selected={activeMenu === ActiveMenu.Collections}
                onClick={() => setActiveMenu(ActiveMenu.Collections)}
              >
                <ListItemText
                  primary={
                    <FormattedMessage
                      id="collections"
                      defaultMessage={'Collections'}
                    />
                  }
                />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Tokens}
              onClick={() => setActiveMenu(ActiveMenu.Tokens)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="tokens" defaultMessage={'Tokens'} />
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );

  return (
    <>
      <Drawer open={isMenuOpen} onClose={handleCloseMenu}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                <FormattedMessage id="menu" defaultMessage="Menu" />
              </Typography>
              <IconButton onClick={handleClosePreview}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>{renderMenu()}</Box>
        </Box>
      </Drawer>

      <NextSeo
        title={formatMessage({
          id: 'app.builder.setup',
          defaultMessage: 'App Builder Setup',
        })}
      />
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
              id="send.settings"
              defaultMessage="Send settings"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.send.this.app.settings"
              defaultMessage="Do you really want to send it?"
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
      <Container maxWidth={'xl'}>
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
                    caption: (
                      <FormattedMessage id="apps" defaultMessage="Apps" />
                    ),
                    uri: '/admin',
                  },
                  {
                    caption: (
                      <FormattedMessage id="edit" defaultMessage="Edit" />
                    ),
                    uri: '/admin/edit',
                    active: true,
                  },
                ]}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <WelcomeMessage />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile && (
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <Typography variant="h5">
                    <FormattedMessage id="edit.app" defaultMessage="Edit App" />
                  </Typography>
                  <BuilderKitMenu
                    menu={activeBuilderKit}
                    onChangeMenu={(menu) => setActiveBuilderKit(menu)}
                  />
                </Stack>
              )}
              <Stack direction={'row'} spacing={2}>
                <PreviewAppButton appConfig={wizardConfig} />
                {site?.previewUrl && (
                  <>
                    <Typography variant="body1">
                      <FormattedMessage
                        id="preview.url"
                        defaultMessage="Preview Url"
                      />
                      :
                    </Typography>

                    <Link target={'_blank'} href={site.previewUrl}>
                      {site.previewUrl}
                    </Link>
                  </>
                )}
              </Stack>

              {isMobile && (
                <Button
                  onClick={handleShowMenu}
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="menu" defaultMessage="Menu" />
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            {!isMobile && renderMenu()}
          </Grid>
          <Grid item xs={12} sm={10}>
            <Stack spacing={2}>
              {activeMenu === ActiveMenu.General && config && (
                <GeneralWizardContainer
                  config={config}
                  onSave={handleSave}
                  onChange={handleChange}
                />
              )}
              {activeMenu === ActiveMenu.Domain && config && (
                <DomainWizardContainer
                  config={config}
                  onSave={handleSave}
                  site={site}
                />
              )}
              {activeMenu === ActiveMenu.Ownership && config && (
                <OwnershipWizardContainer
                  config={config}
                  onSave={handleSave}
                  site={site}
                />
              )}

              {activeMenu === ActiveMenu.Theme && config && (
                <ThemeWizardContainer
                  config={config}
                  showSwap={activeBuilderKit === BuilderKit.Swap}
                  onSave={handleSave}
                  onChange={handleChange}
                />
              )}

              {activeMenu === ActiveMenu.Pages && config && (
                <PagesWizardContainer
                  config={config}
                  onSave={handleSave}
                  builderKit={activeBuilderKit}
                />
              )}

              {activeMenu === ActiveMenu.MarketplaceFees && config && (
                <MarketplaceFeeWizardContainer
                  config={config}
                  onSave={handleSave}
                />
              )}

              {activeMenu === ActiveMenu.SwapFees && config && (
                <SwapFeeWizardContainer config={config} onSave={handleSave} />
              )}
              {activeMenu === ActiveMenu.Collections && (
                <CollectionWizardContainer
                  config={config}
                  onSave={handleSave}
                />
              )}

              {activeMenu === ActiveMenu.Menu && config && (
                <PagesMenuWizardContainer
                  config={config}
                  onSave={handleSave}
                  onChange={handleChange}
                />
              )}

              {activeMenu === ActiveMenu.Tokens && config && (
                <TokenWizardContainer config={config} onSave={handleSave} />
              )}

              {activeMenu === ActiveMenu.Seo && config && (
                <SeoWizardContainer config={config} onSave={handleSave} />
              )}

              {activeMenu === ActiveMenu.Analytics && config && (
                <AnalyticsWizardContainer config={config} onSave={handleSave} />
              )}
              {activeMenu === ActiveMenu.Social && config && (
                <SocialWizardContainer config={config} onSave={handleSave} />
              )}
              {activeMenu === ActiveMenu.FooterMenu && config && (
                <FooterMenuWizardContainer
                  config={config}
                  onSave={handleSave}
                  onChange={handleChange}
                />
              )}
            </Stack>
          </Grid>
          {/*false && theme && (
            <Grid item xs={12} sm={6}>
              <ThemeProvider theme={selectedTheme ? selectedTheme : theme}>
                <Container>
                  <PagePreviewPaper
                    sections={currentPage.sections}
                    name={currentPage.title || 'Home'}
                    hideButtons={currentPage?.key !== 'home'}
                  />
                </Container>
              </ThemeProvider>
            </Grid>
          )*/}
        </Grid>
      </Container>
    </>
  );
}
