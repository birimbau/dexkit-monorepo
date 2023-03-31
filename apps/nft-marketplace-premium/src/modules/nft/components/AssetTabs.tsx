import {
  Button,
  Grid,
  NoSsr,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import { QueryErrorResetBoundary, useQueryClient } from '@tanstack/react-query';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../../../constants';

import {
  GET_NFT_ORDERS,
  useApproveAssetMutation,
  useAsset,
  useAssetMetadata,
  useCancelSignedOrderMutation,
  useFillSignedOrderMutation,
  useSwapSdkV4,
} from '../../../hooks/nft';
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from '../../../utils/blockchain';
import { ConfirmBuyDialog } from './dialogs/ConfirmBuyDialog';
import TableSkeleton from './tables/TableSkeleton';

import { useDexKitContext } from '@dexkit/ui';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { ethers } from 'ethers';
import { OrderDirection } from 'src/types/orderbook';
import { useTransactionDialog } from '../../../hooks/app';
import { useSwitchNetwork, useTokenList } from '../../../hooks/blockchain';
import {
  getERC20Decimals,
  getERC20Name,
  getERC20Symbol,
} from '../../../services/balances';
import { SwapApiOrder } from '../../../types/nft';
import { getWindowUrl } from '../../../utils/browser';
import { getAssetProtocol } from '../../../utils/nfts';
import ShareDialog from './dialogs/ShareDialog';

const ListingsTable = dynamic(() => import('./tables/ListingsTable'), {
  ssr: false,
  suspense: true,
});

const OffersTable = dynamic(() => import('./tables/OffersTable'), {
  ssr: false,
  suspense: true,
});

enum AssetTabsOptions {
  Listings,
  Offers,
}

interface Props {
  address: string;
  id: string;
}

export function AssetTabs({ address, id }: Props) {
  const { account, provider, chainId } = useWeb3React();

  const { data: asset } = useAsset(address, id);
  const { data: metadata } = useAssetMetadata(asset);

  const [selectedTab, setSelectedTab] = useState<AssetTabsOptions>(
    AssetTabsOptions.Listings
  );

  const transactions = useTransactionDialog();

  const { createNotification } = useDexKitContext();

  const nftSwapSdk = useSwapSdkV4(provider, chainId);

  const handleApproveAsset = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === 'ERC721' || swapAsset.type === 'ERC1155') {
          createNotification({
            type: 'transaction',
            subtype: 'approveForAll',
            values: {
              name: asset.collectionName,
              tokenId: asset.id,
            },
            metadata: {
              chainId,
              hash,
            },
          });
        } else {
          createNotification({
            type: 'transaction',
            subtype: 'approve',
            values: {
              name: asset.collectionName,
              tokenId: asset.id,
            },
            metadata: {
              chainId,
              hash,
            },
          });
        }

        transactions.watch(hash);
      }
    },
    [transactions, provider, asset, chainId]
  );

  const approveAsset = useApproveAssetMutation(
    nftSwapSdk,
    account,
    handleApproveAsset,
    {
      onError: (error: any) => transactions.setDialogError(error),
      onMutate: async (variable: { asset: SwappableAssetV4 }) => {
        if (asset) {
          if (
            variable.asset.type === 'ERC721' ||
            variable.asset.type === 'ERC1155'
          ) {
            const values = { asset: asset };

            transactions.open('approveForAll', values);
          } else {
            const symbol = await getERC20Symbol(
              asset.contractAddress,
              provider
            );

            const name = await getERC20Name(asset.contractAddress, provider);

            const values = { name, symbol };

            transactions.open('approve', values);
          }
        }
      },
    }
  );

  const handleBuyOrderSuccess = useCallback(
    async ({
      hash,
      accept,
      order,
    }: {
      hash: string;
      accept: boolean;
      order: SwapApiOrder;
    }) => {
      if (provider === undefined || asset === undefined) {
        return;
      }

      const decimals = await getERC20Decimals(order.erc20Token, provider);

      const symbol = await getERC20Symbol(order.erc20Token, provider);

      if (accept) {
        const values = {
          amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };

        createNotification({
          type: 'transaction',
          subtype: 'acceptOffer',
          values,
          metadata: { chainId, hash },
        });
      } else {
        const values = {
          amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };

        createNotification({
          type: 'transaction',
          subtype: 'buyNft',
          values,
          metadata: { chainId, hash },
        });
      }

      queryClient.invalidateQueries([GET_NFT_ORDERS]);
    },
    [transactions, provider, asset]
  );

  const handleFillSignedOrderError = useCallback(
    (error: any) => transactions.setDialogError(error),
    [transactions]
  );

  const handleMutateSignedOrder = useCallback(
    async ({ order, accept }: { order: SwapApiOrder; accept?: boolean }) => {
      if (asset && order) {
        const decimals = await getERC20Decimals(order.erc20Token, provider);

        const symbol = await getERC20Symbol(order.erc20Token, provider);

        if (accept) {
          const values = {
            amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
            symbol,
            collectionName: asset.collectionName,
            id: asset.id,
          };

          return transactions.open('acceptOffer', values);
        }

        const values = {
          amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
          symbol,
          collectionName: asset.collectionName,
          id: asset.id,
        };

        transactions.open('buyNft', values);
      }
    },
    [transactions, asset]
  );

  const fillSignedOrder = useFillSignedOrderMutation(nftSwapSdk, account, {
    onSuccess: handleBuyOrderSuccess,
    onError: handleFillSignedOrderError,
    onMutate: handleMutateSignedOrder,
  });

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: AssetTabsOptions
  ) => {
    setSelectedTab(newValue);
  };

  const [openConfirmBuy, setOpenConfirmBuy] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [openShare, setOpenShare] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const queryClient = useQueryClient();

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries([GET_NFT_ORDERS]);
  };

  const handleCloseConfirmBuy = () => {
    setSelectedOrder(undefined);
    setOpenConfirmBuy(false);
  };

  const handleCancelOrderHash = useCallback(
    (hash: string, order: SwapApiOrder) => {
      if (asset !== undefined) {
        const values = { collectionName: asset.collectionName, id: asset.id };

        if (order.direction === OrderDirection.Buy) {
          createNotification({
            type: 'transaction',
            subtype: 'cancelOffer',
            values,
            metadata: {
              chainId,
              hash,
            },
          });
        } else {
          createNotification({
            type: 'transaction',
            subtype: 'cancelListing',
            values,
            metadata: {
              chainId,
              hash,
            },
          });
        }

        transactions.watch(hash);
      }
    },
    [transactions, asset]
  );

  const handleCancelSignedOrderError = useCallback(
    (error: any) => transactions.setDialogError(error),
    [transactions]
  );

  const handleCancelSignedOrderMutate = useCallback(
    ({ order }: { order: SwapApiOrder }) => {
      if (asset !== undefined) {
        if (order.direction === OrderDirection.Buy) {
          transactions.open('cancelOffer', {
            collectionName: asset.collectionName,
            id: asset.id,
          });
        } else {
          transactions.open('cancelListing', {
            collectionName: asset.collectionName,
            id: asset.id,
          });
        }
      }
    },
    [transactions, asset]
  );

  const cancelSignedOrder = useCancelSignedOrderMutation(
    nftSwapSdk,
    getAssetProtocol(asset),
    handleCancelOrderHash,
    {
      onError: handleCancelSignedOrderError,
      onMutate: handleCancelSignedOrderMutate,
    }
  );

  const switchNetwork = useSwitchNetwork();

  const handleBuyAsset = useCallback(
    (order: any) => {
      if (asset?.chainId !== undefined && chainId !== undefined) {
        if (chainId !== asset?.chainId) {
          switchNetwork.openDialog(asset?.chainId);
        } else {
          setSelectedOrder(order);
          setOpenConfirmBuy(true);
        }
      }
    },
    [asset, chainId, switchNetwork]
  );

  const handleConfirmBuy = useCallback(async () => {
    if (!account || selectedOrder === undefined) {
      return;
    }

    setOpenConfirmBuy(false);

    if (
      !isAddressEqual(selectedOrder.erc20Token, ZEROEX_NATIVE_TOKEN_ADDRESS)
    ) {
      const asset: any = {
        tokenAddress: selectedOrder.erc20Token,
        tokenAmount: selectedOrder.erc20TokenAmount,
        type: 'ERC20',
      };

      const status = await nftSwapSdk?.loadApprovalStatus(asset, account);

      if (!status?.contractApproved) {
        await approveAsset.mutateAsync({
          asset,
        });
      }
    }

    await fillSignedOrder.mutateAsync({
      order: selectedOrder,
    });
  }, [
    transactions,
    fillSignedOrder,
    nftSwapSdk,
    address,
    id,
    account,
    selectedOrder,
    approveAsset,
  ]);

  const handleCancelOrder = useCallback(
    async (order?: SwapApiOrder) => {
      if (
        asset?.chainId !== undefined &&
        chainId !== undefined &&
        order !== undefined
      ) {
        if (chainId !== asset?.chainId) {
          switchNetwork.openDialog(asset?.chainId);
        } else {
          await cancelSignedOrder.mutateAsync({ order });
          handleInvalidateCache();
        }
      }
    },
    [cancelSignedOrder, switchNetwork, chainId, asset]
  );

  const handleAcceptOffer = useCallback(
    async (order: any) => {
      if (!account) {
        return;
      }

      const tempAsset: any = {
        tokenAddress: address,
        tokenId: id,
        type: getAssetProtocol(asset),
      };

      const status = await nftSwapSdk?.loadApprovalStatus(tempAsset, account);

      if (!status?.contractApproved) {
        await approveAsset.mutateAsync({
          asset: tempAsset,
        });
      }

      fillSignedOrder.mutateAsync({
        order,
        accept: true,
      });
    },
    [fillSignedOrder, nftSwapSdk, address, id, account, approveAsset, asset]
  );

  const handleCloseShareDialog = () => {
    setOpenShare(false);
    setShareUrl(undefined);
  };

  const handleShareOrder = (nonce: string) => {
    if (asset) {
      setOpenShare(true);
      setShareUrl(
        `${getWindowUrl()}/order/${getNetworkSlugFromChainId(
          asset.chainId
        )}/${nonce}`
      );
    }
  };

  const tokens = useTokenList({ chainId: chainId, includeNative: true });

  return (
    <NoSsr>
      <ConfirmBuyDialog
        tokens={tokens}
        asset={asset}
        metadata={metadata}
        order={selectedOrder}
        dialogProps={{
          open: openConfirmBuy,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: handleCloseConfirmBuy,
        }}
        onConfirm={() => handleConfirmBuy()}
      />
      <ShareDialog
        dialogProps={{
          open: openShare,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: handleCloseShareDialog,
        }}
        url={shareUrl}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={selectedTab} onChange={handleChangeTab}>
            <Tab
              value={AssetTabsOptions.Listings}
              label={
                <FormattedMessage id="listings" defaultMessage="Listings" />
              }
            />
            <Tab
              value={AssetTabsOptions.Offers}
              label={<FormattedMessage id="offers" defaultMessage="Offers" />}
            />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {selectedTab === AssetTabsOptions.Listings ? (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ resetErrorBoundary, error }) => (
                    <Paper sx={{ p: 1 }}>
                      <Stack justifyContent="center" alignItems="center">
                        <Typography variant="h6">
                          <FormattedMessage
                            id="something.went.wrong"
                            defaultMessage="Oops, something went wrong"
                            description="Something went wrong error message"
                          />
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {String(error)}
                        </Typography>
                        <Button color="primary" onClick={resetErrorBoundary}>
                          <FormattedMessage
                            id="try.again"
                            defaultMessage="Try again"
                            description="Try again"
                          />
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                >
                  <Suspense fallback={<TableSkeleton rows={4} />}>
                    <ListingsTable
                      address={address}
                      id={id}
                      onBuy={handleBuyAsset}
                      onCancel={handleCancelOrder}
                      onShare={handleShareOrder}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          ) : (
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  fallbackRender={({ resetErrorBoundary, error }) => (
                    <Paper sx={{ p: 1 }}>
                      <Stack justifyContent="center" alignItems="center">
                        <Typography variant="h6">
                          <FormattedMessage
                            id="something.went.wrong"
                            defaultMessage="Oops, something went wrong"
                            description="Something went wrong error message"
                          />
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {String(error)}
                        </Typography>
                        <Button color="primary" onClick={resetErrorBoundary}>
                          <FormattedMessage
                            id="try.again"
                            defaultMessage="Try again"
                            description="Try again"
                          />
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                >
                  <Suspense fallback={<TableSkeleton rows={4} />}>
                    <OffersTable
                      address={address}
                      id={id}
                      onAcceptOffer={handleAcceptOffer}
                      onCancelOffer={handleCancelOrder}
                      onShare={handleShareOrder}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          )}
        </Grid>
      </Grid>
    </NoSsr>
  );
}
