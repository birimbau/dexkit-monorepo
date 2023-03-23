import { Container, Grid, Skeleton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from '../../src/components/layouts/main';
import Link from '../../src/components/Link';
import { PageHeader } from '../../src/components/PageHeader';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_SITES_QUERY,
  useWhitelabelSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getSites } from '../../src/services/whitelabel';
import { AppConfig } from '../../src/types/config';

export const SiteIndexPage: NextPage = () => {
  const sitesQuery = useWhitelabelSitesListQuery();
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'site.list',
          defaultMessage: 'Site list',
        })}
        description={formatMessage({
          id: 'site.list.description',
          defaultMessage:
            'Start your own site/marketplace in seconds. Here you can view and clone other community marketplaces. Start now being a crypto enterpreneur',
        })}
        openGraph={{
          title:
            'List of created apps using the DexKit Wizard. Start clone right way and create yours!',
          description:
            'Start your own site/marketplace in seconds. Here you can view and clone other community marketplaces. Start now being a crypto enterpreneur',
          images: [
            {
              url: `${appConfig.domain}/assets/images/seo_site.jpg`,
              width: 800,
              height: 600,
              alt: 'DexKit images list',
              type: 'image/jpeg',
            },
          ],
        }}
      />
      <MainLayout>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="site.list"
                        defaultMessage="Site list"
                      />
                    ),
                    uri: '/site',
                    active: true,
                  },
                ]}
              />
            </Grid>
            {sitesQuery?.data?.map((site, key) => (
              <Grid item xs={12} sm={6} lg={3} key={key}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      site.appConfig?.seo &&
                      site.appConfig?.seo['home']?.images[0].url
                    }
                    alt=""
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {site.appConfig.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {site.appConfig?.seo &&
                        site.appConfig?.seo['home']?.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Stack
                      spacing={2}
                      direction={'row'}
                      sx={{ pl: 2 }}
                      alignItems={'center'}
                    >
                      {site.nft ? (
                        <Button
                          variant="contained"
                          href={`/asset/${site.nft.networkId}/${
                            site.nft.address
                          }/${Number(site.nft.tokenId)}`}
                        >
                          <FormattedMessage
                            id={'buy.app'}
                            defaultMessage={'Buy App'}
                          />
                        </Button>
                      ) : (
                        <Link
                          href={`/admin/create?clone=${site.slug}`}
                          underline="none"
                        >
                          <FormattedMessage
                            id={'clone'}
                            defaultMessage={'Clone'}
                          />
                        </Link>
                      )}
                      {site.previewUrl && (
                        <Link
                          href={site?.previewUrl || ''}
                          target={'_blank'}
                          underline="none"
                        >
                          <FormattedMessage
                            id={'view.site'}
                            defaultMessage={'View'}
                          />
                        </Link>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {sitesQuery?.isLoading &&
              [1, 2, 3].map((id, key) => (
                <Grid item xs={12} sm={6} lg={3} key={key}>
                  <Card sx={{ maxWidth: 345 }} key={key}>
                    <Skeleton>
                      <CardMedia
                        component="img"
                        height="140"
                        image={''}
                        alt=""
                      />
                    </Skeleton>
                    <CardContent>
                      <Skeleton>
                        <Typography gutterBottom variant="h5" component="div">
                          <FormattedMessage
                            id={'title'}
                            defaultMessage={'title'}
                          />
                        </Typography>
                      </Skeleton>
                      <Skeleton>
                        <Typography variant="body2" color="text.secondary">
                          <FormattedMessage
                            id={'description'}
                            defaultMessage={'description'}
                          />
                        </Typography>
                      </Skeleton>
                    </CardContent>
                    <CardActions>
                      <Button size="small">
                        <Skeleton>
                          <FormattedMessage
                            id={'clone'}
                            defaultMessage={'clone'}
                          />
                        </Skeleton>
                      </Button>

                      <Button size="small">
                        <Skeleton>
                          <FormattedMessage
                            id={'view'}
                            defaultMessage={'View'}
                          />
                        </Skeleton>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const sitesResponse = await getSites({});
  const data = sitesResponse.data.map((resp) => ({
    ...resp,
    appConfig: JSON.parse(resp.config) as AppConfig,
  }));

  await queryClient.prefetchQuery(
    [QUERY_WHITELABEL_SITES_QUERY],
    async () => data
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3000,
  };
};

export default SiteIndexPage;
