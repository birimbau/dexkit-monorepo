import { useMutation, useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import { metaMask } from "../constants/connectors/metamask";
import { WalletActivateParams } from "../types";

import { BigNumber, ethers } from "ethers";
import { PrimitiveAtom, useAtom } from "jotai";
import { magic } from "../constants/connectors/magic";
import { walletConnect } from "../constants/connectors/walletConnect";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants/zrx";
import { isAddressEqual } from "../utils";
import { ERC20Abi } from "./abis";

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

export const ERC20_BALANCE = "ERC20_BALANCE";

export interface Erc20BalanceParams {
  account?: string;
  contractAddress?: string;
  provider?: ethers.providers.BaseProvider;
}

export function useErc20Balance({
  account,
  contractAddress,
  provider,
}: Erc20BalanceParams) {
  return useQuery([ERC20_BALANCE, account, contractAddress], async () => {
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
