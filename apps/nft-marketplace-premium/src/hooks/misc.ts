import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { isBalancesVisibleAtom } from '../state/atoms';


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
