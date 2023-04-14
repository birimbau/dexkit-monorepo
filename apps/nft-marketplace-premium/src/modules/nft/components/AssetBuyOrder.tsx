import { Button, Grid, NoSsr, Paper, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Suspense, useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import { QueryErrorResetBoundary, useQueryClient } from '@tanstack/react-query';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../../../constants';

import {
  GET_NFT_ORDERS,
  useApproveAssetMutation,
  useCancelSignedOrderMutation,
  useFillSignedOrderMutation,
  useSwapSdkV4,
} from '../../../hooks/nft';
import { isAddressEqual } from '../../../utils/blockchain';
import { ConfirmBuyDialog } from './dialogs/ConfirmBuyDialog';
import TableSkeleton from './tables/TableSkeleton';

import { useDexKitContext } from '@dexkit/ui';
import CancelIcon from '@mui/icons-material/Cancel';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { ethers } from 'ethers';
import { useConnectWalletDialog } from 'src/hooks/app';
import { OrderDirection } from 'src/types/orderbook';
import { useSwitchNetwork, useTokenList } from '../../../hooks/blockchain';
import {
  getERC20Decimals,
  getERC20Name,
  getERC20Symbol,
} from '../../../services/balances';
import { Asset, OrderBookItem, SwapApiOrder } from '../../../types/nft';
import { getAssetProtocol } from '../../../utils/nfts';
import { AssetBuyOrderPrice } from './AssetBuyOrderPrice';
import ShareDialog from './dialogs/ShareDialog';

interface Props {
  orderBookItem?: OrderBookItem;
  asset?: Asset;
}

export function AssetBuyOrder({ asset, orderBookItem }: Props) {
  const { account, provider, chainId } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();

  const nftSwapSdk = useSwapSdkV4(provider, asset?.chainId);

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const handleApproveAsset = useCallback(
    async (hash: string, swapAsset: SwappableAssetV4) => {
      if (asset !== undefined) {
        if (swapAsset.type === 'ERC721' || swapAsset.type === 'ERC1155') {
          const values = { name: asset.collectionName, tokenId: asset.id };

          createNotification({
            type: 'transaction',
            subtype: 'approveForAll',
            values,
            metadata: { chainId, hash },
          });

          watchTransactionDialog.watch(hash);
        } else {
          const symbol = await getERC20Symbol(swapAsset.tokenAddress, provider);
          const name = await getERC20Symbol(swapAsset.tokenAddress, provider);

          const values = { name, symbol };

          createNotification({
            type: 'transaction',
            subtype: 'approve',
            values,
            metadata: { chainId, hash },
          });

          watchTransactionDialog.watch(hash);
        }
      }
    },
    [watchTransactionDialog, provider, asset, createNotification, chainId]
  );

  const approveAsset = useApproveAssetMutation(
    nftSwapSdk,
    account,
    handleApproveAsset,
    {
      onError: (error: any) => watchTransactionDialog.setDialogError(error),
      onMutate: async (variable: { asset: SwappableAssetV4 }) => {
        if (asset) {
          if (
            variable.asset.type === 'ERC721' ||
            variable.asset.type === 'ERC1155'
          ) {
            const values = { name: asset.collectionName, tokenId: asset.id };

            watchTransactionDialog.open('approveForAll', values);
          } else {
            const symbol = await getERC20Symbol(
              asset.contractAddress,
              provider
            );

            const name = await getERC20Name(asset.contractAddress, provider);

            const values = { name, symbol };

            watchTransactionDialog.open('approve', values);
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

      const values = {
        collectionName: asset.collectionName,
        id: asset.id,
        amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
        symbol,
      };

      if (accept) {
        createNotification({
          type: 'transaction',
          subtype: 'acceptOffer',
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      } else {
        createNotification({
          type: 'transaction',
          subtype: 'buyNft',
          values,
          metadata: {
            chainId,
            hash,
          },
        });
      }

      watchTransactionDialog.watch(hash);

      queryClient.invalidateQueries([GET_NFT_ORDERS]);
    },
    [watchTransactionDialog, provider, asset]
  );

  const handleFillSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog]
  );

  const handleMutateSignedOrder = useCallback(
    async ({ order, accept }: { order: SwapApiOrder; accept?: boolean }) => {
      if (asset && order) {
        const decimals = await getERC20Decimals(order.erc20Token, provider);

        const symbol = await getERC20Symbol(order.erc20Token, provider);

        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
          amount: ethers.utils.formatUnits(order.erc20TokenAmount, decimals),
          symbol,
        };

        if (accept) {
          return watchTransactionDialog.open('acceptOffer', values);
        }

        watchTransactionDialog.open('buyNft', values);
      }
    },
    [watchTransactionDialog, asset]
  );

  const fillSignedOrder = useFillSignedOrderMutation(nftSwapSdk, account, {
    onSuccess: handleBuyOrderSuccess,
    onError: handleFillSignedOrderError,
    onMutate: handleMutateSignedOrder,
  });

  const [openConfirmBuy, setOpenConfirmBuy] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const queryClient = useQueryClient();

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries([GET_NFT_ORDERS]);
  };

  const handleCloseConfirmBuy = () => {
    setOpenConfirmBuy(false);
  };

  const handleCancelOrderHash = useCallback(
    (hash: string, order: SwapApiOrder) => {
      if (asset !== undefined) {
        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };

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

        watchTransactionDialog.watch(hash);
      }
    },
    [watchTransactionDialog, asset]
  );

  const handleCancelSignedOrderError = useCallback(
    (error: any) => watchTransactionDialog.setDialogError(error),
    [watchTransactionDialog]
  );

  const handleCancelSignedOrderMutate = useCallback(
    ({ order }: { order: SwapApiOrder }) => {
      if (asset !== undefined) {
        const values = {
          collectionName: asset.collectionName,
          id: asset.id,
        };
        if (order.direction === OrderDirection.Buy) {
          watchTransactionDialog.open('cancelOffer', values);
        } else {
          watchTransactionDialog.open('cancelOrder', values);
        }
      }
    },
    [watchTransactionDialog]
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

  const handleBuyAsset = useCallback(() => {
    if (asset?.chainId !== undefined && chainId !== undefined) {
      if (chainId !== asset?.chainId) {
        switchNetwork.openDialog(asset?.chainId);
      } else {
        setOpenConfirmBuy(true);
      }
    } else {
      connectWalletDialog.setOpen(true);
    }
  }, [asset, chainId, switchNetwork]);

  const handleConfirmBuy = useCallback(async () => {
    if (!account || orderBookItem === undefined) {
      return;
    }

    setOpenConfirmBuy(false);

    if (
      !isAddressEqual(orderBookItem.erc20Token, ZEROEX_NATIVE_TOKEN_ADDRESS)
    ) {
      const asset: any = {
        tokenAddress: orderBookItem.erc20Token,
        tokenAmount: orderBookItem.erc20TokenAmount,
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
      order: orderBookItem.order,
    });
  }, [
    watchTransactionDialog,
    fillSignedOrder,
    nftSwapSdk,
    account,
    orderBookItem,
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

  const handleCloseShareDialog = () => {
    setOpenShare(false);
    setShareUrl(undefined);
  };

  const tokens = useTokenList({ chainId: chainId, includeNative: true });

  return (
    <NoSsr>
      <ConfirmBuyDialog
        tokens={tokens}
        asset={asset}
        metadata={asset?.metadata}
        order={orderBookItem}
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
                  <Stack spacing={2}>
                    <AssetBuyOrderPrice
                      asset={asset}
                      orderBookItem={orderBookItem}
                    />
                    {isAddressEqual(account, orderBookItem?.order?.maker) ? (
                      <Button
                        startIcon={<CancelIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCancelOrder!(orderBookItem?.order)}
                      >
                        <FormattedMessage
                          id="cancel"
                          defaultMessage="Cancel"
                          description="Cancel"
                        />
                      </Button>
                    ) : (
                      <Button
                        startIcon={<CancelIcon />}
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleBuyAsset!()}
                      >
                        <FormattedMessage
                          id="buy"
                          defaultMessage="Buy"
                          description="Buy asset button text"
                        />
                      </Button>
                    )}
                  </Stack>
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Grid>
      </Grid>
    </NoSsr>
  );
}
