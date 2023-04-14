import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../constants/connectors/metamask";
import { Token, WalletActivateParams } from "../types";

import { PrimitiveAtom, useAtom } from "jotai";
import { ChainId } from "../constants";
import { magic } from "../constants/connectors/magic";
import { walletConnect } from "../constants/connectors/walletConnect";
import { NETWORK_PROVIDER } from "../constants/networks";
import { getPricesByChain } from "../services";

export function useWalletActivate({
  magicRedirectUrl,
  selectedWalletAtom,
}: {
  magicRedirectUrl: string;
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const { connector } = useWeb3React();

  const [walletConnector, setWalletConnector] = useAtom(selectedWalletAtom);

  const mutation = useMutation(async (params: WalletActivateParams) => {
    if (connector.deactivate) {
      await connector.deactivate();
    }

    if (params.connectorName === "metamask") {
      setWalletConnector("metamask");
      return await metaMask.activate();
    } else if (params.connectorName === "magic") {
      setWalletConnector("magic");
      return await magic.activate({
        loginType: params.loginType,
        email: params.email,
        redirectUrl: magicRedirectUrl,
      });
    } else if (params.connectorName === "walletConnect") {
      setWalletConnector("walletConnect");
      return await walletConnect.activate();
    }
  });

  return { connectorName: walletConnector, mutation };
}


export const COIN_PRICES_QUERY = "COIN_PRICES_QUERY";

export function useCoinPrices({
  currency,
  tokens,
  chainId,
}: {
  tokens?: Token[];
  chainId?: ChainId;
  currency?: string;
}) {
  return useQuery([COIN_PRICES_QUERY, chainId, tokens, currency], async () => {
    if (!chainId || !tokens || !currency) {
      return;
    }

    return await getPricesByChain(chainId, tokens, currency);
  });
}

export const ENS_NAME_QUERY = "ENS_NAME_QUERY";

export function useEnsNameQuery({
  address
}: {
  address?: string;
}) {
  return useQuery([ENS_NAME_QUERY, address], async () => {
    if (!address) {
      return;
    }
    if (address.split('.').length < 2) {
      return
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return;
    }

    return await provider.resolveName(address);
  });
}

export function useEnsNameMutation(
) {
  return useMutation(async (address: string) => {
    if (!address) {
      return;
    }
    if (address.split('.').length < 2) {
      return
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return;
    }

    return await provider.resolveName(address);
  });
}