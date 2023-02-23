import ContractCollectionList from '@/modules/contract-wizard/components/CollectionList';
import { Add } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import Link from 'src/components/Link';
import { PageHeader } from 'src/components/PageHeader';
import { useAppConfig } from 'src/hooks/app';

const WizardIndexPage: NextPage = () => {
  const appConfig = useAppConfig();
  const { formatMessage } = useIntl();
  return (
    <MainLayout>
      <NextSeo
        title={formatMessage({
          id: 'contract.wizard',
          defaultMessage: 'Contract Wizard',
        })}
        description={formatMessage({
          id: 'contract.wizard.description',
          defaultMessage:
            'Easily create your digital collectibles (NFTs) using AI image generation tools and create them on the blockchain of your choice in one click.',
        })}
        openGraph={{
          title: 'NFT creator with AI tool.',
          description:
            'Generate NFT collections by drawing each piece using natural language and create them on the blockchain of your choice within the same app.',
          images: [
            {
              url: `${appConfig.domain}/assets/images/create-nft-collection-wizard.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <Container>
        <Stack spacing={2}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="wizard" defaultMessage="Wizard" />
                ),
                uri: '/contract-wizard',
              },
            ]}
          />
        </Stack>
        <Box>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Card>
                    <Stack
                      sx={{ p: 2 }}
                      justifyContent="space-between"
                      alignItems="center"
                      alignContent="center"
                      direction="row"
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          <FormattedMessage
                            id="my.collections"
                            defaultMessage="My Collections"
                          />
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle2">
                          <FormattedMessage
                            id="create.and.manage.your.collections"
                            defaultMessage="Create and manage your collections"
                          />
                        </Typography>
                      </Box>
                      <IconButton
                        LinkComponent={Link}
                        href="/contract-wizard/collection/create"
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                    <Divider />
                    <CardContent>
                      <ContractCollectionList />
                    </CardContent>
                  </Card>
                </Grid>
                {/*    <Grid item xs={12} sm={6}>
                  <Card>
                    <Stack
                      sx={{ p: 2 }}
                      justifyContent="space-between"
                      alignItems="center"
                      alignContent="center"
                      direction="row"
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          <FormattedMessage
                            id="my.tokens"
                            defaultMessage="My Tokens"
                          />
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle2">
                          <FormattedMessage
                            id="create.and.manage.your.tokens"
                            defaultMessage="Create and manage your tokens"
                          />
                        </Typography>
                      </Box>
                      <IconButton
                        LinkComponent={Link}
                        href="/contract-wizard/tokens/create"
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                    <Divider />
                    <CardContent></CardContent>
                  </Card>
          </Grid>*/}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default WizardIndexPage;
