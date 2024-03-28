import { useJsonRpcProvider } from '@/modules/wizard/hooks';
import { ShowCaseItem } from '@/modules/wizard/types/section';
import { ChainId, useNftMetadataQuery, useNftQuery } from '@dexkit/core';
import { ipfsUriToUrl } from '@dexkit/core/utils';
import useContractMetadata from '@dexkit/ui/hooks/blockchain';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'src/components/Link';
import { getNetworkSlugFromChainId } from 'src/utils/blockchain';

export interface ShowCaseCardProps {
  item: ShowCaseItem;
}

export default function ShowCaseCard({ item }: ShowCaseCardProps) {
  const providerQuery = useJsonRpcProvider({
    chainId:
      item.type === 'asset' || item.type === 'collection'
        ? item.chainId
        : ChainId.Ethereum,
  });

  const nftQuery = useNftQuery(
    item.type === 'asset'
      ? {
          chainId: item.chainId,
          contractAddress: item.contractAddress,
          provider: providerQuery.data,
          tokenId: item.tokenId,
        }
      : {}
  );

  const metadataQuery = useNftMetadataQuery({
    tokenURI: nftQuery.data?.tokenURI
      ? ipfsUriToUrl(nftQuery.data?.tokenURI)
      : undefined,
  });

  const contractMetadata = useContractMetadata(
    item.type === 'collection'
      ? {
          chainId: item.chainId,
          contractAddress: item.contractAddress,
          provider: providerQuery.data,
        }
      : undefined
  );

  if (item.type === 'image') {
    return (
      <Card>
        <CardActionArea
          LinkComponent={Link}
          href={
            item.action && item.action?.type === 'link'
              ? item.action?.url
              : item.action && item.action.type === 'page'
              ? item.action?.page
              : ''
          }
        >
          {item.imageUrl ? (
            <CardMedia image={item.imageUrl} sx={{ aspectRatio: '1/1' }} />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: '1/1',
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            />
          )}
          <Divider />
          <CardContent sx={{ minHeight: (theme) => theme.spacing(16) }}>
            <Stack spacing={1}>
              <Box>
                {item.title && (
                  <Typography
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    variant="body1"
                    fontWeight="bold"
                  >
                    {item.title}
                  </Typography>
                )}
                {item.subtitle && (
                  <Typography
                    sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  if (item.type === 'collection') {
    return (
      <Card>
        <CardActionArea
          LinkComponent={Link}
          href={`/collection/${getNetworkSlugFromChainId(item.chainId)}/${
            item.contractAddress
          }`}
        >
          {item.imageUrl ? (
            <CardMedia image={item.imageUrl} sx={{ aspectRatio: '1/1' }} />
          ) : contractMetadata.data?.image ? (
            <CardMedia
              image={
                contractMetadata.data?.image
                  ? ipfsUriToUrl(contractMetadata.data?.image)
                  : undefined
              }
              sx={{ aspectRatio: '1/1' }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: '1/1',
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            />
          )}

          <Divider />
          <CardContent sx={{ minHeight: (theme) => theme.spacing(16) }}>
            <Stack spacing={1}>
              <Box>
                <Typography
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                  variant="body1"
                  fontWeight="bold"
                >
                  {item.title ? (
                    item.title
                  ) : contractMetadata.data?.name ? (
                    contractMetadata.data?.name
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
                <Typography
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                  variant="body2"
                  color="text.secondary"
                >
                  {item.subtitle ? (
                    item.subtitle
                  ) : contractMetadata.data?.name ? (
                    contractMetadata.data?.description
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card>
      <CardActionArea
        LinkComponent={Link}
        href={`/asset/${getNetworkSlugFromChainId(item.chainId)}/${
          item.contractAddress
        }/${item.tokenId}`}
      >
        {metadataQuery.data?.image ? (
          <CardMedia
            image={
              metadataQuery.data?.image
                ? ipfsUriToUrl(metadataQuery.data?.image)
                : undefined
            }
            sx={{ aspectRatio: '1/1' }}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{
              aspectRatio: '1/1',
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        )}

        <Divider />
        <CardContent sx={{ minHeight: (theme) => theme.spacing(16) }}>
          <Stack spacing={1}>
            <Box>
              <Typography
                sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                variant="body1"
                fontWeight="bold"
              >
                {metadataQuery.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    {metadataQuery.data?.name
                      ? metadataQuery.data?.name
                      : `${nftQuery.data?.collectionName} #${nftQuery.data?.tokenId}`}
                  </>
                )}
              </Typography>
              <Typography
                sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                variant="body2"
                color="text.secondary"
              >
                {metadataQuery.isLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    {metadataQuery.data?.description
                      ? metadataQuery.data?.description
                      : `${nftQuery.data?.collectionName} #${nftQuery.data?.tokenId}`}
                  </>
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
