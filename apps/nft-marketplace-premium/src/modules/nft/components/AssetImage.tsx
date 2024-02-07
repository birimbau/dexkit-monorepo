import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/future/image';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { isWhitelistedDomain } from '../../../utils/image';
import { ipfsUriToUrl } from '../../../utils/ipfs';
const LightBoxDialog = dynamic(() => import('src/components/LightBoxDialog'));

interface Props {
  src: string;
}

export function AssetImage({ src }: Props) {
  const { formatMessage } = useIntl();
  const [openLightBox, setOpenLightBox] = useState(false);

  return (
    <>
      {openLightBox && (
        <LightBoxDialog
          imageUrl={ipfsUriToUrl(src)}
          open={openLightBox}
          onClose={() => {
            setOpenLightBox(false);
          }}
        />
      )}
      <Box
        onClick={() => setOpenLightBox(true)}
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          cursor: 'pointer',
        }}
      >
        {isWhitelistedDomain(src) ? (
          <Image
            src={ipfsUriToUrl(src)}
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
            fill
            alt={formatMessage({
              id: 'nft.image',
              defaultMessage: 'NFT Image',
            })}
          />
        ) : (
          <Image
            src={ipfsUriToUrl(src)}
            unoptimized={true}
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
            fill
            alt={formatMessage({
              id: 'nft.image',
              defaultMessage: 'NFT Image',
            })}
          />
        )}
      </Box>
    </>
  );
}
