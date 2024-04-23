import { UserOnChainEvents } from "@dexkit/core/constants/userEvents";

export const USER_EVENT_NAMES: Record<
  string,
  { id: string; defaultMessage: string }
> = {
  [UserOnChainEvents.swap]: {
    id: "swap",
    defaultMessage: "Swap",
  },
  [UserOnChainEvents.transfer]: {
    id: "transfer",
    defaultMessage: "Transfer",
  },
  [UserOnChainEvents.nftAcceptListERC1155]: {
    id: "accept.nft.listing.erc1155",
    defaultMessage: "Accept NFT Listing ERC1155",
  },
  [UserOnChainEvents.nftAcceptOfferERC721]: {
    id: "accepted.offers.erc721",
    defaultMessage: "Accepted Offers ERC721",
  },
  [UserOnChainEvents.buyDropCollection]: {
    id: "buy.collection.drop",
    defaultMessage: "Buy Collection Drops",
  },
  [UserOnChainEvents.buyDropEdition]: {
    id: "buy.edition.drop",
    defaultMessage: "Buy Edition Drops",
  },
  [UserOnChainEvents.deployContract]: {
    id: "contract.deployment",
    defaultMessage: "Contract deployment",
  },
  [UserOnChainEvents.nftAcceptListERC721]: {
    defaultMessage: "Accept NFT List ERC721",
    id: "accept.nft.list.erc721",
  },
  [UserOnChainEvents.nftAcceptOfferERC1155]: {
    defaultMessage: "Accept NFT Offer ERC1155",
    id: "accept.nft.offer.erc1155",
  },
};
