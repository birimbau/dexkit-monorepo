import CheckoutItemList from '@/modules/checkout/components/CheckoutItemList';
import CheckoutTokenAutocomplete from '@/modules/checkout/components/CheckoutTokenAutocomplete';
import CheckoutConfirmDialog from '@/modules/checkout/components/dialogs/CheckoutConfirmDialog';
import { ChainId, useErc20Balance } from '@dexkit/core';
import { ERC20Abi } from '@dexkit/core/constants/abis';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Token } from '@dexkit/core/types';
import { useConnectWalletDialog } from '@dexkit/ui';
import {
  useCheckoutData,
  useCheckoutItems,
  useConfirmCheckout,
} from '@dexkit/ui/hooks/payments';
import Wallet from '@mui/icons-material/Wallet';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate, useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

export interface CheckoutPageProps {
  id: string;
}

const tokens = [
  {
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    chainId: ChainId.Polygon,
  },
];

export default function CheckoutPage({ id }: CheckoutPageProps) {
  const checkoutItemsQuery = useCheckoutItems({ id: id });

  const [token, setToken] = useState<Token | null>({
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    chainId: ChainId.Polygon,
  });

  const [hash, setHash] = useState<string>();

  const total = useMemo(() => {
    return checkoutItemsQuery.data
      ?.map((item: any) =>
        BigNumber.from(item.amount).mul(BigNumber.from(item.price)),
      )
      .reduce((prev, curr) => {
        return prev.add(curr);
      }, BigNumber.from(0));
  }, [checkoutItemsQuery.data]);

  const { provider, account, isActive } = useWeb3React();
  const balanceQuery = useErc20Balance(provider, token?.address, account);

  const confirmCheckoutMutation = useConfirmCheckout();

  const checkoutQuery = useCheckoutData({ id });

  const transferMutation = useMutation(
    async ({
      address,
      amount,
      token,
      onSubmit,
    }: {
      address: string;
      amount: BigNumber;
      token?: Token;
      onSubmit: (hash: string) => void;
    }) => {
      if (token) {
        const contract = new ethers.Contract(
          token?.address,
          ERC20Abi,
          provider?.getSigner(),
        );

        const tx = await contract.transfer(address, amount);

        onSubmit(tx.hash);

        return await tx.wait();
      }
    },
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async () => {
    if (total && token && checkoutQuery.data?.receiver) {
      try {
        await transferMutation.mutateAsync({
          address: checkoutQuery.data?.receiver,
          amount: total,
          token,
          onSubmit: async (hash: string) => {
            setHash(hash);

            if (token) {
              console.log('chama isso aqui');

              await confirmCheckoutMutation.mutateAsync({
                chainId: token?.chainId,
                checkoutId: id,
                tokenAddress: token?.address,
                txHash: hash,
              });

              await checkoutQuery.refetch();
            }
          },
        });
      } catch (err) {
        enqueueSnackbar(
          <FormattedMessage
            id="error.while.tranfer"
            defaultMessage="Error while transfer"
          />,
          { variant: 'error' },
        );
      }
    }
  };

  const handleChangeToken = (token: Token | null) => {
    setToken(token);
  };

  const { handleConnectWallet } = useConnectWalletDialog();

  const hasSufficientBalance = useMemo(() => {
    if (total && balanceQuery.data) {
      return balanceQuery.data?.gte(total);
    }
    return false;
  }, [total, balanceQuery.data]);

  const [open, setOpen] = useState(false);

  const handlePay = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const disabled = useMemo(() => {
    return (
      checkoutQuery.data &&
      ['confirmed', 'expired'].includes(checkoutQuery.data?.status)
    );
  }, [checkoutQuery.data]);

  return (
    <>
      <CheckoutConfirmDialog
        token={token}
        DialogProps={{
          open,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        id={id}
        total={total}
        txHash={hash}
        isLoading={transferMutation.isLoading}
        onConfirm={handleConfirm}
      />
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
          {checkoutQuery.data?.status === 'confirmed' && (
            <Grid item xs={12}>
              <Alert severity="success">
                <FormattedMessage
                  id="payment.confirmed"
                  defaultMessage="Payment Confirmed"
                />
              </Alert>
            </Grid>
          )}

          {checkoutQuery.data?.status === 'expired' && (
            <Grid item xs={12}>
              <Alert severity="warning">
                <FormattedMessage
                  id="payment.confirmed"
                  defaultMessage="Payment expired"
                />
              </Alert>
            </Grid>
          )}

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
              <CheckoutItemList id={id} token={token} />
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
                  <CheckoutTokenAutocomplete
                    tokens={tokens}
                    onChange={handleChangeToken}
                    chainId={137}
                    token={token}
                    disabled={disabled}
                  />
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1">
                      <FormattedMessage id="balance" defaultMessage="Balance" />
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
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
                  {isActive ? (
                    <Button
                      disabled={!hasSufficientBalance || disabled}
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
                            amount:
                              total &&
                              ethers.utils.formatUnits(total, token?.decimals),
                          }}
                        />
                      ) : (
                        <FormattedMessage
                          id="insufficient.balance"
                          defaultMessage="Insufficient balance"
                        />
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConnectWallet}
                      startIcon={<Wallet />}
                      fullWidth
                      variant="contained"
                      size="large"
                    >
                      <FormattedMessage
                        id="connect.wallet"
                        defaultMessage="Connect wallet"
                      />
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
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
