import { useJsonRpcProvider } from '@/modules/wizard/hooks';
import { ShowCaseItemAsset } from '@/modules/wizard/types/section';
import { useNftMetadataQuery, useNftQuery } from '@dexkit/core';
import { ipfsUriToUrl } from '@dexkit/core/utils';
import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface AssetItemProps {
  item: ShowCaseItemAsset;
}

export default function AssetItem({ item }: AssetItemProps) {
  const providerQuery = useJsonRpcProvider({ chainId: item.chainId });

  const nftQuery = useNftQuery({
    chainId: item.chainId,
    contractAddress: item.contractAddress,
    provider: providerQuery.data,
    tokenId: item.tokenId,
  });

  const metadataQuery = useNftMetadataQuery({
    tokenURI: nftQuery.data?.tokenURI
      ? ipfsUriToUrl(nftQuery.data?.tokenURI)
      : undefined,
  });

  return (
    <>
      {metadataQuery.isLoading ? (
        <Skeleton
          variant="circular"
          sx={(theme) => ({
            width: theme.spacing(5),
            height: theme.spacing(5),
          })}
        />
      ) : (
        <Avatar
          variant="rounded"
          src={
            metadataQuery.data?.image
              ? ipfsUriToUrl(metadataQuery.data?.image)
              : undefined
          }
        />
      )}

      <Box>
        <Typography
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          variant="body1"
          fontWeight="bold"
        >
          {metadataQuery.isLoading ? (
            <Skeleton sx={{ flex: 1 }} />
          ) : (
            <>
              {metadataQuery.data?.name
                ? metadataQuery.data?.name
                : `${nftQuery.data?.collectionName} #${nftQuery.data?.tokenId}`}
            </>
          )}
        </Typography>
        {metadataQuery.data?.description && (
          <Typography
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            variant="body2"
            color="text.secondary"
          >
            {metadataQuery.isLoading ? (
              <Skeleton />
            ) : (
              <>
                {metadataQuery.data?.description ? (
                  metadataQuery.data?.description
                ) : (
                  <FormattedMessage
                    id="no.description"
                    defaultMessage="no description"
                  />
                )}
              </>
            )}
          </Typography>
        )}
      </Box>
    </>
  );
}
