import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { Box } from "@mui/material";
import Image from "next/image";
import { useIntl } from "react-intl";
import { isWhitelistedDomain } from "../../../utils/image";

interface Props {
  src: string;
}

export function AssetImage({ src }: Props) {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingTop: "100%",
      }}
    >
      {isWhitelistedDomain(src) ? (
        <Image
          src={ipfsUriToUrl(src)}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
          }}
          alt={formatMessage({
            id: "nft.image",
            defaultMessage: "NFT Image",
          })}
        />
      ) : (
        <Image
          src={ipfsUriToUrl(src)}
          unoptimized={true}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
          }}
          alt={formatMessage({
            id: "nft.image",
            defaultMessage: "NFT Image",
          })}
        />
      )}
    </Box>
  );
}
