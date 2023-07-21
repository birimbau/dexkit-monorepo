import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";

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

export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on("block", handleBlockNumber);

      return () => {
        provider?.removeListener("block", handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}

export function useIsMobile() {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down("sm"));
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
