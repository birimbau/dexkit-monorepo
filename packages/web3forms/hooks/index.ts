import { DexkitApiProvider } from "@dexkit/core/providers";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import axios from "axios";

import { ChainId } from "@dexkit/core/constants";

import { ETHER_SCAN_API_URL } from "../constants";

import { getNormalizedUrl } from "@dexkit/core/utils";
import { useWeb3React } from "@web3-react/core";
import { useContext, useEffect, useState } from "react";
import { fetchAbi } from "../services";
import {
  AbiFragment,
  ContractDeployParams,
  ContractFormParams,
  FormConfigParams,
  ThirdwebMetadata,
} from "../types";

export interface UseContractCallMutationOptions {
  contractAddress?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
  onSuccess?: (data: { name: string; result: any }) => void;
}

export interface UseContractCallMutationParams {
  call?: boolean;
  args: any[];
  name: string;
  payable?: boolean;
  value?: BigNumber;
  rpcProvider?: ethers.providers.JsonRpcProvider;
}

export function useContractCallMutation({
  contractAddress,
  abi,
  provider,
  onSuccess,
}: UseContractCallMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      call,
      name,
      args,
      payable,
      value,
      rpcProvider,
    }: UseContractCallMutationParams) => {
      let contract: ethers.Contract;

      let currProvider = rpcProvider ? rpcProvider : provider;

      if (!contractAddress || !provider) {
        throw new Error("no provider");
      }

      let cb;

      if (call) {
        contract = new ethers.Contract(
          contractAddress,
          abi,
          provider?.getSigner()
        );
      } else {
        contract = new ethers.Contract(contractAddress, abi, currProvider);
      }

      try {
        cb = contract[name];

        let result: any;

        if (args.length > 0) {
          if (payable) {
            result = await cb(...args, { value });
          } else {
            result = await cb(...args);
          }
        } else {
          if (payable) {
            result = await cb({ value });
          } else {
            result = await cb();
          }
        }

        return { name, result };
      } catch (err) {
        throw err;
      }
    },
    {
      onSuccess: onSuccess,
      onError: (err: any) => {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      },
    }
  );
}

export interface UseContractDeployMutationOptions {
  contractBytecode?: string;
  abi: ethers.ContractInterface;
  provider?: ethers.providers.Web3Provider;
  onContractCreated?: (contract: ethers.Contract) => void;
}

export function useContractDeployMutation({
  contractBytecode,
  abi,
  provider,
  onContractCreated,
}: UseContractDeployMutationOptions) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      params,
      value,
    }: {
      params: ContractDeployParams;
      value: BigNumber;
    }) => {
      if (!contractBytecode || !provider) {
        return;
      }

      const { payable, args } = params;

      const factory = new ethers.ContractFactory(
        abi,
        contractBytecode,
        provider.getSigner()
      );

      let result;

      try {
        if (args.length > 0) {
          if (payable) {
            result = await factory.deploy(...args, {
              value,
            });
          } else {
            result = await factory.deploy(...args);
          }
        } else {
          if (payable) {
            result = await factory.deploy({ value });
          } else {
            result = await factory.deploy();
          }
        }

        if (onContractCreated) {
          onContractCreated(result);
        }
      } catch (err: any) {
        enqueueSnackbar(
          formatMessage(
            { id: "error.err", defaultMessage: "Error: {err}" },
            { err: String(err.code) }
          ),
          { variant: "error" }
        );
      }

      return result;
    }
  );
}

export const CALL_ON_MOUNT_QUERY = "CALL_ON_MOUNT_QUERY";

export function useCallOnMountFields({
  contractAddress,
  abi,
  provider,
  params,
  onSuccess,
}: {
  contractAddress: string;
  abi: AbiFragment[];
  provider?: ethers.providers.JsonRpcProvider;
  params: ContractFormParams;
  onSuccess: (results: { [key: string]: any }) => void;
}) {
  return useQuery(
    [CALL_ON_MOUNT_QUERY, params],
    async () => {
      if (provider) {
        let contract = new ethers.Contract(contractAddress, abi, provider);

        let results: { [key: string]: any } = {};

        for (let field of Object.keys(params.fields)) {
          if (params.fields[field].callOnMount) {
            const cb = contract[field];
            const args = Object.keys(params.fields[field].input).map(
              (key) => params.fields[field].input[key].defaultValue
            );

            let result = await cb(...args);

            results[field] = result;
          }
        }

        return results;
      }

      return {};
    },
    {
      onSuccess,
    }
  );
}

// https://api.etherscan.io/api?module=contract&action=getabi&address=0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359

export const SCAN_CONTRACT_ABI = "SCAN_CONTRACT_ABI";

export function useScanContractAbiMutation() {
  return useMutation(
    async ({
      contractAddress,
      chainId,
    }: {
      contractAddress: string;
      chainId: ChainId;
    }) => {
      if (!ethers.utils.isAddress(contractAddress)) {
        throw new Error("invalid contract address");
      }

      if (!chainId) {
        throw new Error("no chain id");
      }

      const resp = await axios.get(
        `https://${ETHER_SCAN_API_URL[chainId] ?? ""}/api`,
        {
          params: {
            action: "getabi",
            module: "contract",
            address: contractAddress,
          },
        }
      );

      if (resp.data.message === "NOTOK") {
        throw new Error("rate limit");
      }

      return JSON.parse(resp.data.result);
    }
  );
}

export function useIfpsUploadMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      content,
      isImage,
    }: {
      content: Buffer;
      token?: string;
      isImage?: boolean;
    }) => {
      const formData = new FormData();

      formData.append("file", new Blob([content]));

      if (isImage) {
      }

      if (instance) {
        const pinataKey = (await instance.get("/auth/pinata-key")).data.JWT;

        const res = await axios.post<{
          IpfsHash: string;
          PinSize: number;
          Timestamp: string;
        }>(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formData, {
          headers: {
            "Content-Type": `multipart/form-data;`,
            Authorization: `Bearer ${pinataKey}`,
          },
        });

        await instance.post("/account-file/ipfs/add-file", {
          cid: res.data.IpfsHash,
          isImage,
        });

        return res.data.IpfsHash;
      }
    }
  );
}

export const IPFS_FILE_LIST_QUERY = "IPFS_FILE_LIST_QUERY";

export function useIpfsFileListQuery({
  page = 1,
  onlyImages,
}: {
  page?: number;
  onlyImages?: boolean;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery<{ items: { cid: string }[]; nextCursor?: number }>(
    [IPFS_FILE_LIST_QUERY, page],
    async ({ pageParam }) => {
      if (instance) {
        return (
          await instance.get<{ items: { cid: string }[]; nextCursor?: number }>(
            "/account-file/ipfs/files",
            {
              params: { cursor: pageParam, limit: 12, onlyImages },
            }
          )
        ).data;
      }

      return { items: [], nextCursor: undefined };
    },
    {
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }
  );
}

export const FORM_CONFIG_PARAMS_QUERY = "FORM_CONFIG_PARAMS_QUERY";

export function useFormConfigParamsQuery({
  creator,
  contract,
}: {
  contract: string;
  creator: string;
}) {
  return useQuery<FormConfigParams>(
    [FORM_CONFIG_PARAMS_QUERY, creator, contract],
    async () => {
      const result = (
        await axios.get(
          `https://raw.githubusercontent.com/DexKit/assets/main/contracts/${creator}/${contract}.json`
        )
      ).data;

      return result;
    },
    { refetchOnWindowFocus: false }
  );
}

export function useDeployThirdWebContractMutation() {
  const { provider, chainId } = useWeb3React();
  const [sdk, setSdk] = useState<ThirdwebSDK>();

  useEffect(() => {
    if (provider) {
      setSdk(new ThirdwebSDK(provider.getSigner()));
    }
  }, [provider, chainId]);

  return useMutation(
    async ({
      params,
      chainId,
      order,
      metadata,
    }: {
      params: any;
      chainId: number;
      order: string[];
      metadata: ThirdwebMetadata;
    }) => {
      if (sdk) {
        const orderedParams = order.map((key) => {
          if (params[key]) {
            return params[key];
          }

          return null;
        });

        const factory =
          metadata.factoryDeploymentData.factoryAddresses[chainId.toString()];

        const implementation =
          metadata.factoryDeploymentData.implementationAddresses[
            chainId.toString()
          ];

        const abi = await fetchAbi({
          contractAddress: implementation,
          chainId: chainId,
        });

        const contractAddress = await sdk.deployer.deployViaFactory(
          factory,
          implementation,
          abi,
          "initialize",
          orderedParams
        );

        return contractAddress;
      }
    }
  );
}

export const THIRDWEB_CONTRACT_METADATA = "THIRDWEB_CONTRACT_METADATA";

export default function useThirdwebContractMetadataQuery({
  id,
}: {
  id: string;
}) {
  return useQuery([THIRDWEB_CONTRACT_METADATA, id], async () => {
    const contracts = await new ThirdwebSDK("polygon")
      .getPublisher()
      .getAll("deployer.thirdweb.eth");

    const contract = contracts.find(
      (c) => c.id?.toLowerCase() === id?.toLowerCase()
    );

    if (contract) {
      const normalizedUrl = getNormalizedUrl(contract.metadataUri);

      const result = (
        await axios.get<ThirdwebMetadata>(
          normalizedUrl.replace("gateway.pinata.cloud", "ipfs.io")
        )
      ).data;

      return result;
    }

    return null;
  });
}
