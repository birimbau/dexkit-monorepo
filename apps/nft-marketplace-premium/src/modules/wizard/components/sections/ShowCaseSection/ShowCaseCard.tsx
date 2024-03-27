import { useJsonRpcProvider } from '@/modules/wizard/hooks';
import { ShowCaseItem } from '@/modules/wizard/types/section';
import { ChainId, useNftMetadataQuery, useNftQuery } from '@dexkit/core';
import { ipfsUriToUrl } from '@dexkit/core/utils';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'src/components/Link';

export interface ShowCaseCardProps {
  item: ShowCaseItem;
}

export default function ShowCaseCard({ item }: ShowCaseCardProps) {
  const providerQuery = useJsonRpcProvider({
    chainId: item.type === 'asset' ? item.chainId : ChainId.Ethereum,
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

  if (item.type === 'image') {
    return (
      <Card>
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
            {item.action && item.action.url && (
              <Button
                variant="contained"
                fullWidth
                LinkComponent={Link}
                href={item.action.url}
                target="_blank"
              >
                {item.action.caption}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
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
              {metadataQuery.data?.name
                ? metadataQuery.data?.name
                : `${nftQuery.data?.collectionName} #${nftQuery.data?.tokenId}`}
            </Typography>
            <Typography
              sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
              variant="body2"
              color="text.secondary"
            >
              {metadataQuery.data?.description
                ? metadataQuery.data?.description
                : `${nftQuery.data?.collectionName} #${nftQuery.data?.tokenId}`}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
