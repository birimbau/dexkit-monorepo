import { NETWORKS, NETWORK_FROM_SLUG } from "@dexkit/core/constants/networks";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import type { CellPlugin } from "@react-page/editor";

import { AssetFromApi } from "@dexkit/ui/modules/nft/components";
import { SearchNFTAutocomplete } from "../components/SearchNFTAutocomplete";
import { SingleNFTAutocomplete } from "../components/SingleNFTAutocomplete";

type Data = {
  network: string;
  contractAddress: string;
  id: string;
};
// you can pass the shape of the data as the generic type argument
const AssetPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => (
    <Box
      sx={{
        maxWidth: 400,
      }}
    >
      <AssetFromApi
        tokenId={String(data.id)}
        contractAddress={data.contractAddress}
        chainId={NETWORK_FROM_SLUG(data.network)?.chainId as number}
      />
    </Box>
  ),
  id: "nft-plugin",
  title: "NFT",
  description: "Show a single nft",
  version: 1,
  controls: [
    {
      title: "Search NFT",
      controls: {
        type: "custom",
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            <SearchNFTAutocomplete data={data} />
          </Container>
        ),
      },
    },
    {
      title: "From Collections",
      controls: {
        type: "custom",
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            <SingleNFTAutocomplete data={data} />
          </Container>
        ),
      },
    },

    {
      title: "Import",
      controls: {
        type: "autoform",
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            network: {
              type: "string",
              enum: Object.values(NETWORKS)
                .filter((n) => !n.testnet)
                .map((n) => String(n.name)),
            },
            contractAddress: {
              type: "string",
            },
            id: {
              type: "string",
            },
          },
          required: ["network", "contractAddress", "id"],
        },
      },
    },
  ],
};

export default AssetPlugin;
