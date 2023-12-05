import { EditionDropPageSection } from '@/modules/wizard/types/section';
import { Grid } from '@mui/material';
import { ThirdwebSDKProvider, useContract, useNFTs } from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { Formik } from 'formik';
import { THIRDWEB_CLIENT_ID } from 'src/constants';
import NFTGrid from '../../NFTGrid';

export interface DexGeneratorEditionDropFormProps {
  onChange: (section: EditionDropPageSection) => void;
  params: { network: string; address: string };
  section?: EditionDropPageSection;
}

function DexGeneratorEditionDropForm({
  onChange,
  params,
  section,
}: DexGeneratorEditionDropFormProps) {
  const { network, address } = params;

  const handleSubmit = ({ tokenId }: { tokenId?: string }) => {};

  const handleValidate = ({ tokenId }: { tokenId?: string }) => {
    onChange({
      type: 'edition-drop-section',
      config: { address, tokenId: tokenId || '' },
    });
  };

  const { data: contract } = useContract(address);
  const nftsQuery = useNFTs(contract);

  console.log(nftsQuery.data, nftsQuery.isError);

  return (
    <Formik
      initialValues={
        section && section.type === 'edition-drop-section'
          ? { tokenId: section.config.tokenId }
          : {}
      }
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {nftsQuery.data ? (
              <NFTGrid
                nfts={nftsQuery.data}
                network={network}
                address={address}
                selectedTokenId={values.tokenId}
                onClick={(tokenId: string) => {
                  if (tokenId === values.tokenId) {
                    return setFieldValue('tokenId', undefined);
                  }
                  setFieldValue('tokenId', tokenId);
                }}
              />
            ) : null}
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}

export default function Wrapper(props: DexGeneratorEditionDropFormProps) {
  const { chainId, provider } = useWeb3React();

  return (
    <ThirdwebSDKProvider
      signer={provider?.getSigner()}
      /* TODO: remove this logic */
      activeChain={chainId}
      clientId={THIRDWEB_CLIENT_ID}
    >
      <DexGeneratorEditionDropForm {...props} />
    </ThirdwebSDKProvider>
  );
}
