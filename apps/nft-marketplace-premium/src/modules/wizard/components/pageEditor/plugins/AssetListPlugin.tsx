import type { CellPlugin } from '@react-page/editor';
import { NETWORKS } from '../../../../../constants/chain';
import { getNetworkFromName } from '../../../../../utils/blockchain';
import { AssetList } from '../../../../nft/components/AssetListOrderbook';
import { CollectionAutocomplete } from '../components/CollectionAutocomplete';

type Data = {
  network: string;
  contractAddress: string;
};
// you can pass the shape of the data as the generic type argument
const AssetListPlugin: CellPlugin<Data> = {
  Renderer: ({ data }) => (
    <AssetList
      contractAddress={data.contractAddress}
      chainId={getNetworkFromName(data.network)?.chainId}
    />
  ),
  id: 'nft-list-plugin',
  title: 'NFT List',
  description: 'Show a list of nfts with orders on orderbook',
  version: 1,
  controls: [
    {
      title: 'From Collections',
      controls: {
        type: 'custom',
        Component: (data) => <CollectionAutocomplete data={data} />,
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
            network: {
              type: 'string',
              enum: Object.values(NETWORKS)
                .filter((n) => !n.testnet)
                .map((n) => String(n.name)),
            },
            contractAddress: {
              type: 'string',
            },
          },
          required: ['network', 'contractAddress'],
        },
      },
    },
  ],
};

export default AssetListPlugin;
