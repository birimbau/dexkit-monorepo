import { Container, Grid, Skeleton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import Link from '../../src/components/Link';
import { PageHeader } from '../../src/components/PageHeader';
import MainLayout from '../../src/components/layouts/main';
import { useAppConfig } from '../../src/hooks/app';
import {
  QUERY_WHITELABEL_SITES_QUERY,
  useWhitelabelSitesListQuery,
} from '../../src/hooks/whitelabel';
import { getSites } from '../../src/services/whitelabel';
import { AppConfig } from '../../src/types/config';

export const SiteTemplatesPage: NextPage = () => {
  const sitesQuery = useWhitelabelSitesListQuery({ isTemplate: true });
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'site.templates',
          defaultMessage: 'Site templates',
        })}
        description={formatMessage({
          id: 'site.templates.description',
          defaultMessage:
            'Start your own site/marketplace/app in seconds. Here you can view and clone apps with various usecases. Start now being a crypto enterpreneur',
        })}
        openGraph={{
          title:
            'List of app templatea. Start clone right way and create yours app today!',
          description:
            'Start your own site/marketplace/apps in seconds.  Here you can view and clone apps with various usecases. Start now being a crypto enterpreneur',
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
                    <Stack spacing={2}>
                      <Typography gutterBottom variant="h5" component="div">
                        {site.appConfig.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          height: '100px',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {site.appConfig?.seo &&
                          site.appConfig?.seo['home']?.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Stack
                      spacing={2}
                      direction={'row'}
                      sx={{ pl: 2 }}
                      alignItems={'center'}
                    >
                      <Link
                        href={`/admin/create?clone=${site.slug}`}
                        underline="none"
                      >
                        <FormattedMessage
                          id={'clone'}
                          defaultMessage={'Clone'}
                        />
                      </Link>
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

  const sitesResponse = await getSites({ isTemplate: true });
  const data = sitesResponse.data.map((resp) => ({
    ...resp,
    appConfig: JSON.parse(resp.config) as AppConfig,
  }));

  await queryClient.prefetchQuery(
    [QUERY_WHITELABEL_SITES_QUERY],
    async () => data,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60000,
  };
};

export default SiteTemplatesPage;
