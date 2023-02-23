import { Search } from '@mui/icons-material';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ChangeEvent, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CloseCircle from '../../../components/icons/CloseCircle';
import Funnel from '../../../components/icons/Filter';
import { ChainId } from '../../../constants/enum';
import { useHiddenAssets, useAccountAssetsBalance } from '../../../hooks/nft';
import { Asset } from '../../../types/nft';
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from '../../../utils/blockchain';
import { AssetCard } from '../../nft/components/AssetCard';

interface Props {
  onOpenFilters?: () => void;
  filters?: { myNfts: boolean; chainId?: ChainId; networks: string[] };
  onImport: () => void;
}

function WalletAssetsSection({ onOpenFilters, filters }: Props) {
  const { account } = useWeb3React();
  const { accountAssets } = useAccountAssetsBalance(account ? [account] : []);
  const { isHidden, toggleHidden, assets: hiddenAssets } = useHiddenAssets();
  const [search, setSearch] = useState('');
  const assets = useMemo(() => {
    if (accountAssets?.data) {
      return (
        (accountAssets?.data
          .map((a) => a.assets)
          .flat()
          .filter((a) => a) as Asset[]) || []
      );
    }
    return [];
  }, [accountAssets?.data]);

  const filteredAssetList = useMemo(() => {
    return assets
      .filter((asset) => !isHidden(asset))
      .filter((asset) => {
        return (
          asset.collectionName?.toLowerCase().search(search.toLowerCase()) >
            -1 ||
          (asset.metadata !== undefined &&
            asset.metadata?.name !== undefined &&
            asset.metadata?.name.toLowerCase().search(search.toLowerCase()) >
              -1)
        );
      })
      .filter((asset) => {
        if (filters?.myNfts) {
          return isAddressEqual(asset.owner, account);
        }
        /*if (filters?.chainId) {
          return Number(asset.chainId) === Number(filters.chainId);
        }*/
        if (filters?.networks && filters?.networks.length) {
          return filters.networks.includes(
            getNetworkSlugFromChainId(asset.chainId) || ''
          );
        }

        return true;
      });
  }, [assets, filters, search, hiddenAssets]);

  const { formatMessage } = useIntl();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const renderAssets = () => {
    if (filteredAssetList.length === 0) {
      return (
        <Grid item xs={12}>
          <Box sx={{ py: 4 }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle color="error" />
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="no.nfts.found"
                  defaultMessage="No NFTs Found"
                />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="import.or.favorite.nfts"
                  defaultMessage="Import or favorite NFTs"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
      );
    }

    return filteredAssetList.map((asset, index) => (
      <Grid item xs={6} sm={3} key={index}>
        <AssetCard
          asset={asset}
          key={index}
          showControls={true}
          onHide={toggleHidden}
          isHidden={isHidden(asset)}
        />
      </Grid>
    ));
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isDesktop ? (
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: 'search.for.a.nft',
                  defaultMessage: 'Search for a NFT',
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Chip
                label={
                  <>
                    {filteredAssetList.length}{' '}
                    <FormattedMessage id="nfts" defaultMessage="NFTs" />
                  </>
                }
                color="secondary"
              />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                alignContent="center"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  alignContent="center"
                >
                  <Chip
                    label={
                      <>
                        {assets.length}{' '}
                        <FormattedMessage id="nfts" defaultMessage="NFTs" />
                      </>
                    }
                    color="secondary"
                  />
                </Stack>
                <IconButton onClick={onOpenFilters}>
                  <Funnel />
                </IconButton>
              </Stack>
              <TextField
                type="search"
                size="small"
                value={search}
                onChange={handleChange}
                placeholder={formatMessage({
                  id: 'search.for.a.nft',
                  defaultMessage: 'Search for a NFT',
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          )}
        </Grid>
        {renderAssets()}
      </Grid>
    </>
  );
}

export default WalletAssetsSection;
