import { UserEvents } from '@dexkit/core/constants/userEvents';
import { useDexKitContext } from '@dexkit/ui/hooks';
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useMutation, useQuery } from '@tanstack/react-query';
import { WalletService, Web3Service } from "@unlock-protocol/unlock-js";
import { useWeb3React } from '@web3-react/core';
import { Lock } from '../constants/types';
const networks = {
  80001: {
    unlockAddress: "0x1FF7e338d5E582138C46044dc238543Ce555C963", // Smart contracts docs include all addresses on all networks
    provider: "https://rpc.unlock-protocol.com/80001",
  },
};

export function usePurchaseLockKeysMutation() {
  const { provider, chainId, account } = useWeb3React();
  const trackUserEvent = useTrackUserEventsMutation()
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  return useMutation(async ({ lockAddress, lockName, currency, keyPrice }: { lockAddress: string, lockName?: string, currency: string | null, keyPrice: string }) => {
    if (!provider || !account || !chainId) {
      return;
    }

    const walletService = new WalletService(networks);
    const web3Service = new Web3Service(networks);
    await walletService.connect(provider);
    let params = { name: lockName || '' };
    watchTransactionDialog.setError(undefined);
    watchTransactionDialog.open('purchaseKey', params);
    try {
      let userBalance;

      if (currency) {
        userBalance = await web3Service.getTokenBalance(
          currency,
          account,
          chainId
        )

      } else {
        userBalance = await web3Service.getAddressBalance(
          account,
          chainId
        )

      }
      if (parseFloat(userBalance) < parseFloat(keyPrice)) {
        throw new Error(
          `You don't have enough funds to complete this purchase.`
        )
      }


      await walletService.purchaseKey(
        {
          lockAddress,
        },
        {}, // transaction options
        (error, hash) => {
          if (hash && chainId) {
            createNotification({
              type: 'transaction',
              subtype: 'purchaseKey',
              values: params,
              metadata: { hash: hash, chainId },
            });

            watchTransactionDialog.watch(hash);
            trackUserEvent.mutate({
              event: UserEvents.purchaseKey, hash: hash, chainId, metadata: JSON.stringify({
                lockAddress,
                lockName

              }),
            })


          }
          if (error) {
            watchTransactionDialog.setError(error);
          }
        }
      );
    } catch (e: any) {

      if ('code' in e) {
        if (e.code === 'ACTION_REJECTED') {
          watchTransactionDialog.setError(new Error('User rejected transaction'));
        } else {
          watchTransactionDialog.setError(e);
        }

      } else {
        watchTransactionDialog.setError(e);
      }

    }
  })
}

export function useLockQuery({ lockAddress, lockChainId }: { lockAddress?: string, lockChainId?: number }) {


  return useQuery([lockAddress, lockChainId], async (): Promise<Lock | null> => {
    if (!lockAddress || !lockChainId) {
      return null;
    }
    const web3Service = new Web3Service(networks);
    return await web3Service.getLock(lockAddress, lockChainId);

  })
}

export function useLockBalanceQuery({ lockAddress, lockChainId, account }: { lockAddress?: string, lockChainId?: number, account?: string }) {


  return useQuery([lockAddress], async (): Promise<Lock | null> => {
    if (!lockAddress || !lockChainId || !account) {
      return null;
    }
    const web3Service = new Web3Service(networks);
    return await web3Service.balanceOf(lockAddress, account, lockChainId);

  })
}

export function useLockKeybyOwnerQuery({ lockAddress, lockChainId, account }: { lockAddress?: string, lockChainId?: number, account?: string }) {


  return useQuery([lockAddress], async (): Promise<{
    lock: string;
    owner: string;
    expiration: number;
    tokenId: number
  } | null> => {
    if (!lockAddress || !lockChainId || !account) {
      return null;
    }
    const web3Service = new Web3Service(networks);
    return await web3Service.getKeyByLockForOwner(lockAddress, account, lockChainId);

  })
}