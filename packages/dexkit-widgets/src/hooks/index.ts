import { useWeb3React, Web3ReactHooks } from "@web3-react/core";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Connector } from "@web3-react/types";
import { BigNumber, ethers, providers } from "ethers";
import { useAtomValue, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { currencyAtom, walletConnectorAtom } from "../components/atoms";
import { metaMask } from "../connectors";
import { MagicLoginType } from "../connectors/magic";
import { CONNECTORS, WRAPED_TOKEN_ADDRESS } from "../constants";
import { ERC20Abi, WETHAbi } from "../constants/abis";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../services/zeroex/constants";
import { isAddressEqual } from "../utils";

export function useOrderedConnectors() {
  const selectedWallet = useAtomValue(walletConnectorAtom);

  return useMemo(() => {
    let connectors: [Connector, Web3ReactHooks][] = [];

    if (selectedWallet) {
      const otherConnectors = Object.keys(CONNECTORS)
        .filter((key) => selectedWallet !== key)
        .map((key) => CONNECTORS[key]);

      connectors = [CONNECTORS[selectedWallet], ...otherConnectors];
    } else {
      const otherConnectors = Object.keys(CONNECTORS).map(
        (key) => CONNECTORS[key]
      );

      connectors = otherConnectors;
    }

    return connectors;
  }, [selectedWallet]);
}

export function useWalletActivate() {
  const { connector } = useWeb3React();

  const setWalletConnector = useSetAtom(walletConnectorAtom);

  return useMutation(
    async ({
      connectorName,
      loginType,
      email,
    }: {
      connectorName: string;
      loginType?: MagicLoginType;
      email?: string;
    }) => {
      if (connector.deactivate) {
        await connector.deactivate();
      }
      if (connectorName === "metamask") {
        setWalletConnector("metamask");
        return await metaMask.connector.activate();
      } else if (connectorName === "magic") {
        // setWalletConnector("magic");
        // return await magic.activate({
        //   loginType,
        //   email,
        // });
      }
    }
  );
}

export function useCurrency() {
  return useAtomValue(currencyAtom);
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

export function useDebounceCallback<T>(
  value: T,
  callback: (value: T) => void,
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
}

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  return isMounted;
}

export interface WrapTokenParams {
  provider?: providers.Web3Provider;
  amount: BigNumber;
  onHash: (hash: string) => void;
}

export function useWrapToken() {
  const { enqueueSnackbar } = useSnackbar();

  const wrapMutation = useMutation(
    async ({ provider, amount, onHash }: WrapTokenParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const chainId = (await provider?.getNetwork()).chainId;

      const contractAddress = WRAPED_TOKEN_ADDRESS[chainId];

      const contract = new ethers.Contract(
        contractAddress,
        WETHAbi,
        provider.getSigner()
      );

      const tx = await contract.deposit({ value: amount });

      onHash(tx.hash);

      return (await tx.wait()) as ethers.providers.TransactionReceipt;
    },
    {
      onError: (err: any) => {
        if (err.message) {
          enqueueSnackbar(err.message, { variant: "error" });
        } else {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      },
    }
  );

  const unwrapMutation = useMutation(
    async ({ provider, amount, onHash }: WrapTokenParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const chainId = (await provider?.getNetwork()).chainId;

      const contract = new ethers.Contract(
        WRAPED_TOKEN_ADDRESS[chainId],
        ["function withdraw(uint wad) public "],
        provider.getSigner()
      );

      const tx = await contract.withdraw(amount);

      onHash(tx.hash);

      return (await tx.wait()) as ethers.providers.TransactionReceipt;
    },
    {
      onError: (err: any) => {
        if (err.message) {
          enqueueSnackbar(err.message, { variant: "error" });
        } else {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      },
    }
  );

  return { wrapMutation, unwrapMutation };
}

export function useAsyncMemo<T>(
  cb: (initial: T) => Promise<T>,
  initial: T,
  args: unknown[]
) {
  const [result, setResult] = useState<T>(initial);

  useEffect(() => {
    async function load() {
      const res = await cb(result);
      if (!active) {
        return;
      }
      setResult(res);
    }

    let active = true;
    load();
    return () => {
      active = false;
    };
  }, args);

  return result;
}

export const TOKEN_BALANCE = "TOKEN_BALANCE";

export interface TokenBalanceParams {
  account?: string;
  contractAddress?: string;
  provider?: ethers.providers.Web3Provider;
}

export function useTokenBalance({
  account,
  contractAddress,
  provider,
}: TokenBalanceParams) {
  return useQuery([TOKEN_BALANCE, account, contractAddress], async () => {
    if (!contractAddress || !provider || !account) {
      return BigNumber.from(0);
    }

    if (isAddressEqual(contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
      return await provider.getBalance(account);
    }

    const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

    return (await contract.balanceOf(account)) as BigNumber;
  });
}
