import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import {
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { AssetListCollection } from '@/modules/nft/components/AssetListCollection';
import { AssetList } from '@/modules/nft/components/AssetListOrderbook';
import { CollectionHeader } from '@/modules/nft/components/CollectionHeader';
import { CollectionTraits } from '@/modules/nft/components/CollectionTraits';
import { TableSkeleton } from '@/modules/nft/components/tables/TableSkeleton';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Search from '@mui/icons-material/Search';
import { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppErrorBoundary } from 'src/components/AppErrorBoundary';
import SidebarFilters from 'src/components/SidebarFilters';
import SidebarFiltersContent from 'src/components/SidebarFiltersContent';
import { CollectionSyncStatus } from 'src/constants/enum';
import { useCollection } from 'src/hooks/nft';
import { CollectionPageSection } from '../../types/section';

export interface CollectionSectionProps {
  section: CollectionPageSection;
}

export default function CollectionSection({ section }: CollectionSectionProps) {
  const chainId = NETWORK_FROM_SLUG(section.config.network as string)?.chainId;

  const { hideDrops, hideFilters, hideHeader, hideAssets } = section.config;

  const { data: collection } = useCollection(section.config.address, chainId);

  const [search, setSearch] = useState('');

  const handleChange = (value: string) => {
    setSearch(value);
  };

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { formatMessage } = useIntl();

  const renderSidebar = (onClose?: () => void) => {
    return (
      <SidebarFilters
        title={<FormattedMessage id="filters" defaultMessage="Filters" />}
        onClose={onClose}
      >
        <SidebarFiltersContent>
          <TextField
            fullWidth
            size="small"
            type="search"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={formatMessage({
              id: 'search.in.collection',
              defaultMessage: 'Search in collection',
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <CollectionTraits
            address={section.config.address as string}
            chainId={chainId}
          />
        </SidebarFiltersContent>
      </SidebarFilters>
    );
  };

  const handleCloseDrawer = () => {
    setIsFiltersOpen(false);
  };

  const renderDrawer = () => {
    return (
      <Drawer
        open={isFiltersOpen}
        onClose={handleCloseDrawer}
        anchor="right"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          {renderSidebar(handleCloseDrawer)}
        </Box>
      </Drawer>
    );
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  console.log(section.config);

  return (
    <>
      {!hideFilters && renderDrawer()}
      <Box>
        <Container>
          <Grid container spacing={2}>
            {!hideHeader && (
              <Grid item xs={12}>
                <CollectionHeader
                  address={section.config.address}
                  chainId={chainId}
                  lazy
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <LazyTextField
                    TextFieldProps={{
                      size: 'small',
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search color="primary" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={handleChange}
                  />
                  {!hideFilters && (
                    <IconButton onClick={handleOpenFilters}>
                      <FilterAltIcon />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            </Grid>
            {!hideAssets && (
              <Grid item xs={12}>
                <NoSsr>
                  <AppErrorBoundary
                    fallbackRender={({ resetErrorBoundary, error }) => (
                      <Stack justifyContent="center" alignItems="center">
                        <Typography variant="h6">
                          <FormattedMessage
                            id="something.went.wrong"
                            defaultMessage="Oops, something went wrong"
                            description="Something went wrong error message"
                          />
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {String(error)}
                        </Typography>
                        <Button color="primary" onClick={resetErrorBoundary}>
                          <FormattedMessage
                            id="try.again"
                            defaultMessage="Try again"
                            description="Try again"
                          />
                        </Button>
                      </Stack>
                    )}
                  >
                    {collection?.syncStatus === CollectionSyncStatus.Synced ||
                    collection?.syncStatus === CollectionSyncStatus.Syncing ? (
                      <AssetListCollection
                        contractAddress={section.config.address}
                        network={section.config.network}
                        search={search}
                      />
                    ) : (
                      <Suspense fallback={<TableSkeleton rows={4} />}>
                        <AssetList
                          contractAddress={section.config.address as string}
                          chainId={chainId}
                          search={search}
                        />
                      </Suspense>
                    )}
                  </AppErrorBoundary>
                </NoSsr>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
