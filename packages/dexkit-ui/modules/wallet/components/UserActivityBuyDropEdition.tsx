import { useNftMetadataQuery, useNftQuery } from "@dexkit/core";
import { FormattedMessage } from "react-intl";
import { UserEvent } from "../hooks/useUserActivity";

export interface UserActivityBuyDropEditionProps {
  event: UserEvent;
}

export default function UserActivityBuyDropEdition({
  event,
}: UserActivityBuyDropEditionProps) {
  const { price, token, collection, tokenId } = event.processedMetadata;

  const nftQuery = useNftQuery({});

  const nftMetadata = useNftMetadataQuery({
    tokenURI: nftQuery.data?.tokenURI,
  });

  console.log("nftQuery", nftQuery.data);

  return (
    <>
      {JSON.stringify(event.processedMetadata)}
      {JSON.stringify(nftQuery.error)}
      <FormattedMessage
        id="buy.edition.drop.for"
        defaultMessage="Buy Drop Edition {collectionName} {tokenId} for {price} {tokenSymbol}"
        values={{
          collectionName: <strong>{nftMetadata.data?.name}</strong>,
          price: <strong>{price}</strong>,
          tokenId: <strong>{tokenId}</strong>,
          tokenSymbol: <strong>{token?.symbol}</strong>,
        }}
      />
    </>
  );
}
