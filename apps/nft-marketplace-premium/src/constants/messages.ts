import { AppNotificationType } from '@dexkit/ui/types';

export const WHITELABEL_NOTIFICATION_TYPES: {
  [key: string]: AppNotificationType;
} = {
  acceptOffer: {
    type: 'acceptOffer',
    message:
      'Accept offer of {amount} {symbol} for the asset {collectionName} #{id}',
    id: 'accept.offer.transaction.title',
    icon: 'check',
  },
  buyNft: {
    type: 'buyNft',
    message: 'Buy {collectionName} #{id} for {amount} {symbol}',
    id: 'buy.asset.transaction.title',
    icon: 'local_mall',
  },
  createListing: {
    type: 'createListing',
    message: 'Create listing for {collectionName} #{id}',
    id: 'create.listing.for.collectionName.id',
    icon: 'list',
  },
  cancelOffer: {
    type: 'cancelOffer',
    message: 'Cancel offer for the asset {collectionName} #{id}',
    id: 'cancel.offer.for.asset.collectionName.id',
    icon: 'cancel',
  },
  cancelListing: {
    type: 'cancelOrder',
    message: 'Cancel listing for the asset {collectionName} #{id}',
    id: 'cancel.order',

    icon: 'cancel',
  },
  claimAirdrop: {
    type: 'claimAirdrop',
    message: 'Claimed KIT airdrop',
    id: 'claim.airdrop',
  },
  mintEditionDrop: {
    type: 'mintEditionDrop',
    message: 'Minting {quantity} with id {tokenId} from edition {name}',
    id: 'claim.airdrop',
  },
};
