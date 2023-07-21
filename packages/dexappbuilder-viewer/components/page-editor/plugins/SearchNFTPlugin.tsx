import Stack from '@mui/material/Stack';
import type { CellPlugin } from '@react-page/editor';
import { useMemo } from 'react';
import { CollectionAutcompleteUniform } from '../components/CollectionAutocompleteUniform';
import { SearchNFT } from '../components/SearchNFT';

type Data = {
  padding: number;
  position: string;
  collections?: {
    name: string;
    contractAddress: string;
    backgroundImage: string;
    network: string;
    chainId: number;
    image: string;
  }[];
};

// you can pass the shape of the data as the generic type argument
const SearchNFTPlugin: CellPlugin<Data> = {
  Renderer: ({ isEditMode, data }) => {
    const position = useMemo(() => {
      if (data.position === 'center') {
        return 'center';
      }
      if (data.position === 'start') {
        return 'flex-start';
      }
      if (data.position === 'end') {
        return 'flex-end';
      }
    }, [data.position]);

    return (
      <Stack
        sx={{ p: data.padding }}
        justifyContent={position}
        alignItems={position}
      >
        <SearchNFT disabled={isEditMode} collections={data.collections} />
      </Stack>
    );
  },

  id: 'dexkit-search-nft-plugin',
  title: 'Search NFT',
  description: 'Insert search nft.',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      // this JSONschema is type checked against the generic type argument
      // the autocompletion of your IDE helps to create this schema
      properties: {
        padding: {
          type: 'number',
          default: 2,
          minimum: 0,
        },
        position: {
          type: 'string',
          title: 'Position',
          enum: ['center', 'start', 'end'],
        },
        collections: {
          type: 'array',
          items: { properties: {} },
          uniforms: {
            component: CollectionAutcompleteUniform,
          },
        },
      },
      required: [],
    },
  },
};

export default SearchNFTPlugin;
