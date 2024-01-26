import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import Container from '@mui/material/Container';
import type { CellPlugin } from '@react-page/editor';
import { CollectionFromApiCard } from '../../../../nft/components/CollectionFromApi';
import { CollectionAutocomplete } from '../components/CollectionAutocomplete';
import { ImagePicker } from '../components/ImagePicker';
type Data = {
  image: string;
  name: string;
  backgroundImage: string;
  network: string;
  contractAddress: string;
  description?: string;
  uri?: string;
};

// you can pass the shape of the data as the generic type argument
const CollectionPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => {
    const { getNetworkFromName } = useNetworkMetadata();

    return (
      <CollectionFromApiCard
        chainId={getNetworkFromName(data.network)?.chainId}
        contractAddress={data.contractAddress}
        totalSupply={0}
        backgroundImageUrl={data.backgroundImage}
        title={data.name}
        variant={'simple'}
        disabled={true}
      />
    );
  },
  id: 'collection-plugin',
  title: 'Collection Banner',
  description: 'Show a collection banner',
  version: 1,
  controls: [
    {
      title: 'Your collections',
      controls: {
        type: 'custom',
        Component: (data) => (
          <Container sx={{ p: 2 }}>
            {' '}
            <CollectionAutocomplete data={data} />{' '}
          </Container>
        ),
      },
    },
    {
      title: 'Import',
      controls: {
        type: 'autoform',
        schema: {
          // this JSONschema is type checked against the generic type argument
          // the autocompletion of your IDE helps to create this schema
          properties: {
            image: {
              type: 'string',
              uniforms: {
                component: ImagePicker,
              },
            },
            backgroundImage: {
              type: 'string',
              uniforms: {
                component: ImagePicker,
              },
              // pattern: '(https?://.*.(?:png|jpg|jpeg|gif|svg))',
            },
            name: {
              type: 'string',
            },
            network: {
              type: 'string',
              // TODO: add networks logic
              enum: [],
            },
            contractAddress: {
              type: 'string',
              pattern: '^0x[a-fA-F0-9]{40}$',
            },
            description: {
              type: 'string',
            },
          },
          required: [
            'network',
            'contractAddress',
            'name',
            'image',
            'backgroundImage',
          ],
        },
      },
    },
  ],
};

export default CollectionPlugin;
