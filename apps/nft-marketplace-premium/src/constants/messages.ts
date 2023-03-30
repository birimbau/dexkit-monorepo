import { AppNotificationType } from '@dexkit/ui/types';

export const WHITELABEL_NOTIFICATION_TYPES: {
  [key: string]: AppNotificationType;
} = {
  acceptOffer: {
    type: 'acceptOffer',
    message:
      'Accept offer of {amount} {symbol} for the asset {collectionName} #{id}',
    id: 'accept.offer.transaction.title',
  },
  buyNft: {
    type: 'buyNft',
    message: 'Buy {collectionName} #{id} for {amount} {symbol}',
    id: 'buy.asset.transaction.title',
  },
  createListing: {
    type: 'createListing',
    message: 'Create listing for {collectionName} #{id}',
    id: 'create.listing.for.collectionName.id',
  },
  cancelOffer: {
    type: 'cancelOffer',
    message: 'Cancel offer for the asset {collectionName} #{id}',
    id: 'cancel.offer.for.asset.collectionName.id',
  },
  cancelListing: {
    type: 'cancelOrder',
    message: 'Cancel listing for the asset {collectionName} #{id}',
    id: 'cancel.order',
  },
};
