import { useMutation } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { isBalancesVisibleAtom } from '../state/atoms';

import { CONNECTORS } from '@dexkit/core';

export function usePositionPaginator(pageSize = 5) {
  const [position, setPosition] = useState({ offset: 0, limit: pageSize });

  const handleNext = useCallback(() => {
    setPosition((value) => ({ ...value, offset: value.offset + pageSize }));
  }, [pageSize]);

  const handlePrevious = useCallback(() => {
    if (position.offset - pageSize >= 0) {
      setPosition((value) => ({ ...value, offset: value.offset - pageSize }));
    }
  }, [position, pageSize]);

  return { position, handleNext, handlePrevious, pageSize };
}

export function useIsBalanceVisible() {
  return useAtomValue(isBalancesVisibleAtom);
}

export function useWalletActivate() {
  return useMutation(async ({ connectorName }: { connectorName: string }) => {
    if (connectorName === 'metamask') {
      return await CONNECTORS['metamask'][0].activate();
    } else if (connectorName === 'walletConnect') {
      return await CONNECTORS['walletConnect'][0].activate();
    }
  });
}

const showSelectIsOpenAtom = atom(false);

export function useSelectNetworkDialog() {
  const [isOpen, setIsOpen] = useAtom(showSelectIsOpenAtom);

  return { isOpen, setIsOpen };
}

export function useDebounce<T>(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
