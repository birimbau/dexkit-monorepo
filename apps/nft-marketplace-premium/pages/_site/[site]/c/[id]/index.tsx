import CheckoutTokenAutocomplete from '@/modules/checkout/components/CheckoutTokenAutocomplete';
import CheckoutUserItemList from '@/modules/commerce/components/CheckoutUserItemsTable';
import { CHECKOUT_TOKENS } from '@/modules/commerce/constants';
import useCheckoutTransfer from '@/modules/commerce/hooks/checkout/useCheckoutTransfer';
import useUserCheckout from '@/modules/commerce/hooks/checkout/useUserCheckout';
import { sumItems } from '@/modules/commerce/hooks/utils';
import { ChainId, useErc20BalanceQuery } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Token } from '@dexkit/core/types';
import { ipfsUriToUrl, parseChainId } from '@dexkit/core/utils';
import {
  useActiveChainIds,
  useConnectWalletDialog,
  useSwitchNetworkMutation,
} from '@dexkit/ui';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Wallet from '@mui/icons-material/Wallet';
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

export default function UserCheckout() {
  const router = useRouter();

  const { id } = router.query;

  const userCheckout = useUserCheckout({ id: id as string });

  const {} = useCheckoutTransfer();

  const { activeChainIds } = useActiveChainIds();

  const [open, setOpen] = useState(false);

  const [token, setToken] = useState<Token | null>(null);

  const [chainId, setChainId] = useState<ChainId>();

  const switchNetwork = useSwitchNetworkMutation();

  const handleSwitchNetwork = async () => {
    if (chainId) {
      await switchNetwork.mutateAsync({ chainId });
    }
  };

  const {
    chainId: providerChainId,
    account,
    isActive,
    provider,
  } = useWeb3React();

  const total = useMemo(() => {
    if (userCheckout.data) {
      return sumItems(
        userCheckout.data.items.map((c) =>
          new Decimal(c.price).mul(c.quantity),
        ),
      );
    }

    return new Decimal('0');
  }, [userCheckout.data]);

  const balanceQuery = useErc20BalanceQuery({
    provider,
    contractAddress: token?.address,
    account,
  });

  console.log(token?.address, balanceQuery.data);

  const decimalBalance = useMemo(() => {
    if (!balanceQuery.data || token?.decimals) {
      return new Decimal(0);
    }

    return new Decimal(
      ethers.utils.formatUnits(balanceQuery.data, token?.decimals),
    );
  }, []);

  const hasSufficientBalance = useMemo(() => {
    return decimalBalance.gte(total);
  }, [total, decimalBalance]);

  const disabled = useMemo(() => {
    return false;
  }, []);

  const { handleConnectWallet } = useConnectWalletDialog();

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => {
        let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      });
  }, []);

  const handlePay = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeNetwork = (
    e: SelectChangeEvent<number>,
    child: ReactNode,
  ) => {
    const newChainId = e.target.value as number;

    setChainId(newChainId);

    let newToken = CHECKOUT_TOKENS.filter((t) => t.chainId === newChainId)[0];

    setToken(newToken);
  };

  const renderPayButton = () => {
    return <Button variant="contained">Pay</Button>;

    if (chainId && providerChainId && chainId !== providerChainId) {
      return (
        <Button
          onClick={handleSwitchNetwork}
          startIcon={
            switchNetwork.isLoading ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : undefined
          }
          fullWidth
          disabled={switchNetwork.isLoading}
          variant="contained"
          size="large"
        >
          <FormattedMessage
            id="switch.to.network.network"
            defaultMessage="Switch to {network} network"
            values={{
              network: networks.find((n) => n.chainId === chainId)?.name,
            }}
          />
        </Button>
      );
    }

    if (isActive) {
      return (
        <Button
          disabled={!hasSufficientBalance || disabled || !token}
          fullWidth
          onClick={handlePay}
          variant="contained"
          size="large"
        >
          {disabled ? (
            <FormattedMessage
              id="not.available"
              defaultMessage="Not available"
            />
          ) : hasSufficientBalance ? (
            <FormattedMessage
              id="pay.amount.symbol"
              defaultMessage="Pay {amount} {tokenSymbol}"
              values={{
                tokenSymbol: token?.symbol,
                amount: total.toString(),
              }}
            />
          ) : (
            <FormattedMessage
              id="insufficient.balance"
              defaultMessage="Insufficient balance"
            />
          )}
        </Button>
      );
    }

    return (
      <Button
        onClick={handleConnectWallet}
        startIcon={<Wallet />}
        fullWidth
        variant="contained"
        size="large"
      >
        <FormattedMessage id="connect.wallet" defaultMessage="Connect wallet" />
      </Button>
    );
  };

  const handleChangeToken = (token: Token | null) => {
    setToken(token);
  };

  useEffect(() => {
    if (providerChainId) {
      setChainId(providerChainId);
      setToken(
        CHECKOUT_TOKENS.find((t) => t.chainId === providerChainId) ?? null,
      );
    }
  }, [providerChainId]);

  return (
    <>
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
                  <FormattedNumber
                    value={total.toNumber()}
                    style="currency"
                    currency="usd"
                    maximumFractionDigits={token?.decimals}
                    minimumFractionDigits={token?.decimals}
                  />{' '}
                  {token ? token?.symbol : 'USD'}
                </Typography>
              </CardContent>
              <Divider />
              <CheckoutUserItemList
                token={token}
                items={userCheckout.data?.items ?? []}
              />
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography variant="body2">
                    <FormattedMessage
                      id="total.usd"
                      defaultMessage="Total in USD"
                    />
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    <FormattedNumber
                      style="currency"
                      currency="usd"
                      value={total.toNumber()}
                      maximumFractionDigits={token?.decimals}
                      minimumFractionDigits={token?.decimals}
                    />
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {chainId !== undefined && (
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="network"
                          defaultMessage="Network"
                        />
                      </InputLabel>
                      <Select
                        label={
                          <FormattedMessage
                            id="network"
                            defaultMessage="Network"
                          />
                        }
                        onChange={handleChangeNetwork}
                        value={chainId}
                        name="network"
                        fullWidth
                        renderValue={(value: number) => {
                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              alignContent="center"
                              spacing={1}
                            >
                              <Avatar
                                src={ipfsUriToUrl(
                                  networks.find((n) => n.chainId === chainId)
                                    ?.imageUrl || '',
                                )}
                                style={{ width: '1rem', height: '1rem' }}
                              />
                              <Typography variant="body1">
                                {
                                  networks.find((n) => n.chainId === chainId)
                                    ?.name
                                }
                              </Typography>
                            </Stack>
                          );
                        }}
                      >
                        {networks
                          .filter((n) => activeChainIds.includes(n.chainId))
                          .map((n) => (
                            <MenuItem key={n.chainId} value={n.chainId}>
                              <ListItemIcon>
                                <Avatar
                                  src={ipfsUriToUrl(n?.imageUrl || '')}
                                  style={{ width: '1rem', height: '1rem' }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={n.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}

                  <CheckoutTokenAutocomplete
                    key={chainId}
                    tokens={CHECKOUT_TOKENS}
                    onChange={handleChangeToken}
                    chainId={chainId}
                    token={token}
                    disabled={disabled}
                  />
                  {!token && (
                    <Alert severity="error">
                      <FormattedMessage
                        id="select.a.token.to.pay"
                        defaultMessage="Select a token to pay"
                      />
                    </Alert>
                  )}

                  {token && (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">
                        <FormattedMessage
                          id="balance"
                          defaultMessage="Balance"
                        />
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {balanceQuery.data ? (
                          decimalBalance.toNumber()
                        ) : (
                          <Skeleton />
                        )}{' '}
                        {token?.symbol}
                      </Typography>
                    </Stack>
                  )}

                  {renderPayButton()}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

(UserCheckout as any).getLayout = function getLayout(page: any) {
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
