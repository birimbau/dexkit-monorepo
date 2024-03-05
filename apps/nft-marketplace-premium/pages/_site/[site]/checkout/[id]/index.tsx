import { ChainId, useErc20Balance } from '@dexkit/core';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Token } from '@dexkit/core/types';
import { useCheckoutItems } from '@dexkit/ui/hooks/payments';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

export interface CheckoutPageProps {
  id: string;
}

export default function CheckoutPage({ id }: CheckoutPageProps) {
  const checkoutItemsQuery = useCheckoutItems({ id: id });

  const [token, setToken] = useState<Token | undefined>({
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    chainId: ChainId.Polygon,
  });

  const total = useMemo(() => {
    return checkoutItemsQuery.data
      ?.map((item: any) =>
        BigNumber.from(item.amount).mul(BigNumber.from(item.price)),
      )
      .reduce((prev, curr) => {
        return prev.add(curr);
      });
  }, [checkoutItemsQuery.data]);

  const { provider, account } = useWeb3React();
  const balanceQuery = useErc20Balance(provider, token?.address, account);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="checkout" defaultMessage="Checkout" />
                ),
                uri: '/checkout/asd8as7d98as',
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="total" defaultMessage="total" />
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {total && ethers.utils.formatUnits(total, token?.decimals)}{' '}
                {token?.symbol}
              </Typography>
            </CardContent>
            <Divider />
            <List disablePadding>
              {checkoutItemsQuery.data?.map((item: any, index: number) => (
                <ListItem divider key={index}>
                  <ListItemText
                    primary={item.description}
                    secondary={`x${item.amount}`}
                  />
                  <Typography>
                    {ethers.utils.formatUnits(
                      BigNumber.from(item.amount).mul(
                        BigNumber.from(item.price),
                      ),
                      token?.decimals,
                    )}{' '}
                    {token?.symbol}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2">
                  <FormattedMessage
                    id="total.usd"
                    defaultMessage="Total in USD"
                  />
                </Typography>

                <Typography color="text.secondary" variant="body2">
                  {total && ethers.utils.formatUnits(total, token?.decimals)}{' '}
                  USD
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Avatar></Avatar>
                    <Box>
                      <Typography variant="body1">USD Coin</Typography>
                      <Typography variant="body2" color="text.secondary">
                        USDC
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography>
                    {balanceQuery.data ? (
                      ethers.utils.formatUnits(
                        balanceQuery.data,
                        token?.decimals,
                      )
                    ) : (
                      <Skeleton />
                    )}{' '}
                    {token?.symbol}
                  </Typography>
                </Stack>
                <Button fullWidth variant="contained" size="large">
                  <FormattedMessage
                    id="pay.amount.symbol"
                    defaultMessage="Pay {amount} {tokenSymbol}"
                    values={{
                      tokenSymbol: token?.symbol,
                      amount:
                        total &&
                        ethers.utils.formatUnits(total, token?.decimals),
                    }}
                  />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

(CheckoutPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  id?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      id: params?.id,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
