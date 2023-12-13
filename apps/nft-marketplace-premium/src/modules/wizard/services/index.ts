import axios from 'axios';
import { Contract, providers, utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import {
  getBalanceOf,
  getBalanceOfERC1155,
  getERC20Balance,
} from 'src/services/balances';
import { myAppsApi } from 'src/services/whitelabel';
import {
  getNetworkSlugFromChainId,
  getProviderByChainId,
} from 'src/utils/blockchain';
import { Token } from '../../../types/blockchain';
import { GatedCondition } from '../types';

export async function getTokenList(url: string) {
  const response = await axios.get(url);
  return response.data.tokens as Token[];
}

export async function isContract(chainId: number, address: string) {
  return null;
}

export async function getContractImplementation({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: providers.JsonRpcProvider;
}): Promise<string> {
  const contract = new Contract(
    contractAddress,
    [
      {
        inputs: [],
        name: 'implementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    provider
  );

  return await contract.implementation();
}

export async function checkGatedConditions({
  account,
  conditions,
}: {
  account?: string;
  conditions: GatedCondition[];
}) {
  const balances: { [key: number]: string } = {};
  const partialResults: { [key: number]: boolean } = {};

  if (!account) {
    return { result: false, balances, partialResults };
  }
  if (account && conditions.length === 0) {
    return { result: true, balances, partialResults };
  }
  if (account && conditions) {
    let result;
    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[index];
      let thisCondition = false;
      // We check all conditions here now
      if (condition.type === 'coin') {
        const balance = await getERC20Balance(
          condition.address,
          account,
          getProviderByChainId(condition.chainId)
        );
        balances[index] = utils.formatUnits(balance, condition.decimals);
        partialResults[index] = false;
        if (
          balance.gte(
            utils.parseUnits(
              String(condition.amount),
              condition.decimals
            )
          )
        ) {
          thisCondition = true;
          partialResults[index] = true;
        }
      }
      if (condition.type === 'collection' && condition.protocol !== 'ERC1155') {
        const balance = await getBalanceOf(
          getNetworkSlugFromChainId(condition.chainId) as string,
          condition.address as string,
          account
        );
        balances[index] = utils.formatUnits(balance, 0);
        partialResults[index] = false;
        if (balance.gte(utils.parseUnits(String(condition.amount), 0))) {
          thisCondition = true;
          partialResults[index] = true;
        }
      }
      if (
        condition.type === 'collection' &&
        condition.protocol === 'ERC1155' &&
        condition.tokenId
      ) {
        const balance = await getBalanceOfERC1155(
          getNetworkSlugFromChainId(condition.chainId) as string,
          condition.address as string,
          account,
          condition.tokenId as string
        );
        balances[index] = utils.formatUnits(balance, 0);
        partialResults[index] = false;
        if (balance.gte(utils.parseUnits(String(condition.amount), 0))) {
          thisCondition = true;
          partialResults[index] = true;
        }
      }
      if (!condition.condition) {
        result = thisCondition;
      }
      if (condition.condition === 'or') {
        result = result || thisCondition;
      }
      if (condition.condition === 'and') {
        result = result && thisCondition;
      }
    }
    return { result, balances, partialResults };
  }
}

export function getGatedConditionsText({
  conditions,
}: {
  conditions: GatedCondition[];
}) {
  let text =
    'You  to unlock this content you need to meet the follow gated conditions: ';
  if (conditions) {
    for (const condition of conditions) {
      if (!condition.condition) {
      }
      if (condition.condition === 'or') {
        text = `${text} or`;
      }
      if (condition.condition === 'and') {
        text = `${text} and`;
      }

      // We check all conditions here now
      if (condition.type === 'coin') {
        text = `${text} have ${condition.amount
          } of coin ${condition.symbol?.toUpperCase()} with address ${condition.address
          } on network ${getNetworkSlugFromChainId(
            condition.chainId
          )?.toUpperCase()}`;
      }
      if (condition.type === 'collection' && condition.protocol !== 'ERC1155') {
        text = `${text} have ${condition.amount
          } of collection ${condition.symbol?.toUpperCase()} with address ${condition.address
          } on network ${getNetworkSlugFromChainId(
            condition.chainId
          )?.toUpperCase()}`;
      }
      if (
        condition.type === 'collection' &&
        condition.protocol === 'ERC1155' &&
        condition.tokenId
      ) {
        text = `${text} have ${condition.amount
          } of collection ${condition.symbol?.toUpperCase()} with id ${condition.tokenId
          } with address ${condition.address
          } on network ${getNetworkSlugFromChainId(
            condition.chainId
          )?.toUpperCase()} `;
      }
    }
    return text;
  }
  return '';
}
export async function isProxyContract({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: providers.JsonRpcProvider;
}): Promise<boolean> {
  try {
    const addr = await getContractImplementation({ contractAddress, provider });

    return isAddress(addr);
  } catch (err) {
    return false;
  }
}


export async function requestEmailConfirmatioForSite({ siteId, accessToken }: { siteId: number, accessToken: string }) {

  return axios.get(`/api/email/site-verification-link?siteId=${siteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

}

export async function addPermissionsMemberSite({ siteId, permissions, account }: { siteId: number, permissions: string, account: string }) {
  return myAppsApi.post(`/site/add-permissions/${siteId}`, {
    permissions,
    account
  });
}

export async function deleteMemberSite({ siteId, account }: { siteId: number, account: string }) {

  return myAppsApi.delete(`/site/remove-permissions/${siteId}/${account}`);

}

export async function upsertAppVersion({ siteId, version, description, versionId }: { siteId: number, version: string, description?: string, versionId?: number }) {
  return myAppsApi.post(`/site/upsert-version/${siteId}`, {
    version,
    description,
    versionId
  });
}

export async function deleteAppVersion({ siteId, siteVersionId }: { siteId: number, siteVersionId: number }) {
  return myAppsApi.delete(`/site/remove-site-version/${siteId}/${siteVersionId}`);
}

export async function setAppVersion({ siteId, siteVersionId }: { siteId: number, siteVersionId: number }) {
  return myAppsApi.get(`/site/set-site-version/${siteId}/${siteVersionId}`);
}