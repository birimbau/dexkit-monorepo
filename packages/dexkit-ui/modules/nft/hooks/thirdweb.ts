import { useMutation } from "@tanstack/react-query";
import { NFTDrop } from '@thirdweb-dev/sdk';

export function useClaimNft({ contract }: { contract?: NFTDrop }) {
  return useMutation(async ({ quantity }: { quantity: number }) => {
    return await contract?.erc721.claim.prepare(quantity);
  });
}