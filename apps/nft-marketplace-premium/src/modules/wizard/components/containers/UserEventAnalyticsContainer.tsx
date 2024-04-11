import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import {
  beautifyCamelCase,
  truncateAddress,
  truncateHash,
} from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import { UserEvent, useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridToolbar } from '@mui/x-data-grid/components';

import { UserOnChainEvents } from '@dexkit/core/constants/userEvents';
import { Button, FormControl, MenuItem } from '@mui/material';
import {
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid/models';
import { Field, Formik } from 'formik';
import { Select } from 'formik-mui';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';
import UserEventsTable from './UserEventsTable';
import EventDetailDialog from './dialogs/EventDetailDialog';

export interface OnChainDataGridProps {
  siteId?: number;
  onViewDetails: (event: UserEvent) => void;
}

function OnChainDataGrid({ siteId, onViewDetails }: OnChainDataGridProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: {
        not: null,
      },
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
  });

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({
      ...queryOptions,
      sort:
        sortModel && sortModel.length
          ? [sortModel[0].field, sortModel[0].sort]
          : [],
    });
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let filter = { ...queryOptions?.filter };
    if (filterModel.quickFilterValues?.length) {
      filter = {
        ...filter,
        q: filterModel.quickFilterValues[0],
      };
    }

    setQueryOptions({ ...queryOptions, filter });
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'from',
      headerName: 'Account',
      width: 200,
      renderCell: (params: any) =>
        params.row?.from || params.row?.account?.address ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row?.from || params.row?.account?.address
            }`}
          >
            {truncateAddress(params.row?.from || params.row?.account?.address)}
          </Link>
        ) : null,
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params: any) => (
        <Button onClick={() => onViewDetails(params.row)}>
          <FormattedMessage id="details" defaultMessage="Details" />
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      slots={{ toolbar: GridToolbar }}
      rows={(data?.data as any) || []}
      columns={columns}
      rowCount={rowCountState}
      paginationModel={paginationModel}
      paginationMode="server"
      disableColumnFilter
      sortingMode="server"
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={onFilterChange}
      onSortModelChange={handleSortModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      loading={isLoading}
    />
  );
}

function OffChainDataGrid({ siteId }: Props) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: null,
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
  });

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({
      ...queryOptions,
      sort:
        sortModel && sortModel.length
          ? [sortModel[0].field, sortModel[0].sort]
          : [],
    });
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let filter = { ...queryOptions?.filter };
    if (filterModel.quickFilterValues?.length) {
      filter = {
        ...filter,
        q: filterModel.quickFilterValues[0],
      };
    }

    setQueryOptions({ ...queryOptions, filter });
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'from',
      headerName: 'Account',
      width: 200,
      renderCell: (params: any) =>
        params.row?.from || params.row?.account?.address ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row?.from || params.row?.account?.address
            }`}
          >
            {truncateAddress(params.row?.from || params.row?.account?.address)}
          </Link>
        ) : null,
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
  ];

  return (
    <DataGrid
      autoHeight
      slots={{ toolbar: GridToolbar }}
      rows={(data?.data as any) || []}
      columns={columns}
      rowCount={rowCountState}
      paginationModel={paginationModel}
      paginationMode="server"
      disableColumnFilter
      sortingMode="server"
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={onFilterChange}
      onSortModelChange={handleSortModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      loading={isLoading}
    />
  );
}

const columnTypes: { [key: string]: GridColDef[] } = {
  [UserOnChainEvents.nftAcceptListERC1155]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'tokenId',
      headerName: 'tokenId',
      width: 200,
      renderCell: (params: any) => {
        return params.row.processedMetadata.tokenId;
      },
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
  ],
  [UserOnChainEvents.swap]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'amountIn',
      headerName: 'Amount In',
      width: 200,
      renderCell: (params: any) => {
        const { tokenInAmount, tokenIn } = params.row.processedMetadata;

        return (
          <Typography>
            {tokenInAmount} {tokenIn?.symbol?.toUpperCase()}
          </Typography>
        );
      },
    },
    {
      field: 'amountOut',
      headerName: 'Amount Out',
      width: 200,
      renderCell: (params: any) => {
        const { tokenOut, tokenOutAmount } = params.row.processedMetadata;

        return (
          <Typography>
            {tokenOutAmount} {tokenOut?.symbol?.toUpperCase()}
          </Typography>
        );
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
    },
  ],
  [UserOnChainEvents.transfer]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'from',
      headerName: 'From',
      width: 160,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.from
            }`}
          >
            {truncateAddress(params.row.from)}
          </Link>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 160,
      renderCell: (params: any) => {
        return params.row.processedMetadata.amount;
      },
    },
    {
      field: 'to',
      headerName: 'To',
      width: 160,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.processedMetadata.to
            }`}
          >
            {truncateAddress(params.row.processedMetadata.to)}
          </Link>
        );
      },
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
  [UserOnChainEvents.nftAcceptOfferERC1155]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      headerName: 'tokenId',
      field: 'tokenId',
      renderCell: (params: any) => {
        const { tokenId } = params.row.processedMetadata;

        return tokenId;
      },
    },
    {
      headerName: 'Token Amount',
      field: 'tokenAmount',
      renderCell: (params: any) => {
        const { tokenAmount } = params.row.processedMetadata;
        return tokenAmount;
      },
    },
    {
      headerName: 'Collection Name',
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        return collection.name;
      },
    },
    {
      headerName: 'NFT Amount',
      field: 'nftAmount',
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return nftAmount;
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
  [UserOnChainEvents.nftAcceptOfferERC721]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      headerName: 'Token Amount',
      field: 'tokenAmount',
      renderCell: (params: any) => {
        const { tokenAmount } = params.row.processedMetadata;
        return tokenAmount;
      },
    },
    {
      headerName: 'Collection Name',
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        return collection.name;
      },
    },
    {
      headerName: 'NFT Amount',
      field: 'nftAmount',
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return nftAmount;
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
  [UserOnChainEvents.nftAcceptListERC721]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      headerName: 'Token Amount',
      field: 'tokenAmount',
      renderCell: (params: any) => {
        const { tokenAmount } = params.row.processedMetadata;
        return tokenAmount;
      },
    },
    {
      headerName: 'Collection Name',
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        return collection.name;
      },
    },
    {
      headerName: 'NFT Amount',
      field: 'nftAmount',
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return nftAmount;
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
  [UserOnChainEvents.buyDropCollection]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      headerName: 'Price',
      field: 'price',
      renderCell: (params: any) => {
        const { price } = params.row.processedMetadata;
        return price;
      },
    },
    {
      headerName: 'Collection Name',
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        return collection.name;
      },
    },
    {
      headerName: 'NFT Amount',
      field: 'nftAmount',
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return nftAmount;
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
  [UserOnChainEvents.buyDropEdition]: [
    {
      field: 'chainId',
      headerName: 'Network',
      width: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      width: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      headerName: 'Price',
      field: 'price',
      renderCell: (params: any) => {
        const { price } = params.row.processedMetadata;
        return price;
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage
          id="collection.name"
          defaultMessage="Collection Name"
        />
      ),
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        return collection.name;
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      field: 'nftAmount',
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return nftAmount;
      },
    },
    {
      field: 'referral',
      renderHeader: () => (
        <FormattedMessage id="referral" defaultMessage="Referral" />
      ),
      width: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
  ],
};

interface Props {
  siteId?: number;
}

export default function UserEventAnalyticsContainer({ siteId }: Props) {
  const [value, setValue] = useState('1');
  const { formatMessage } = useIntl();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [event, setEvent] = useState<UserEvent>();

  const handleClose = () => {
    setShowDetails(false);
    setEvent(undefined);
  };

  const handleViewDetails = (event: UserEvent) => {
    setShowDetails(true);
    setEvent(event);
  };

  const handleSubmit = (values: any) => {};

  const getColumns = (type: string): GridColDef[] => {
    return columnTypes[type];
  };

  return (
    <>
      <EventDetailDialog
        DialogProps={{
          open: showDetails,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        event={event}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage
                id="user.events.analytics"
                defaultMessage="User events analytics"
              />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="user.events.analytics.wizard.description"
                defaultMessage="User events analytics on your app"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id={'add.ref.to.track.referrals'}
              defaultMessage={
                'Append ref to your url to track referrals on your events. Ex: yourSite.com?ref=your-referral'
              }
            />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="events types">
                  <Tab
                    label={
                      <FormattedMessage
                        id={'onchain.events'}
                        defaultMessage={'Onchain events'}
                      />
                    }
                    value="1"
                  />
                  <Tab
                    label={
                      <FormattedMessage
                        id={'offchain.events'}
                        defaultMessage={'Offchain events'}
                      />
                    }
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Formik
                  initialValues={{ txType: 'all' }}
                  onSubmit={handleSubmit}
                >
                  {({ values }) => (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <Field
                            fullWidth
                            component={Select}
                            name="txType"
                            label={
                              <FormattedMessage
                                id="event.type"
                                defaultMessage="Event type"
                              />
                            }
                          >
                            <MenuItem value="all">
                              <FormattedMessage id="all" defaultMessage="All" />
                            </MenuItem>
                            <MenuItem value={UserOnChainEvents.swap}>
                              <FormattedMessage
                                id="swap"
                                defaultMessage="Swap"
                              />
                            </MenuItem>
                            <MenuItem value={UserOnChainEvents.transfer}>
                              <FormattedMessage
                                id="transfer"
                                defaultMessage="Transfer"
                              />
                            </MenuItem>
                            <MenuItem
                              value={UserOnChainEvents.nftAcceptListERC1155}
                            >
                              <FormattedMessage
                                id="accept.nft.listing.erc1155"
                                defaultMessage="Accept NFT Listing ERC1155"
                              />
                            </MenuItem>
                            <MenuItem
                              value={UserOnChainEvents.nftAcceptOfferERC1155}
                            >
                              <FormattedMessage
                                id="accepted.offers.erc1155"
                                defaultMessage="Accepted Offers ERC1155"
                              />
                            </MenuItem>
                            <MenuItem
                              value={UserOnChainEvents.nftAcceptOfferERC721}
                            >
                              <FormattedMessage
                                id="accepted.offers.erc721"
                                defaultMessage="Accepted Offers ERC721"
                              />
                            </MenuItem>
                            <MenuItem
                              value={UserOnChainEvents.buyDropCollection}
                            >
                              <FormattedMessage
                                id="buy.collection.drop"
                                defaultMessage="Buy Collection Drops"
                              />
                            </MenuItem>
                            <MenuItem value={UserOnChainEvents.buyDropEdition}>
                              <FormattedMessage
                                id="buy.edition.drop"
                                defaultMessage="Buy Edition Drops"
                              />
                            </MenuItem>
                          </Field>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        {values.txType === 'all' && (
                          <OnChainDataGrid
                            siteId={siteId}
                            onViewDetails={handleViewDetails}
                          />
                        )}
                        {values.txType !== 'all' && (
                          <UserEventsTable
                            key={values.txType}
                            type={values.txType as UserOnChainEvents}
                            columns={getColumns(values.txType)}
                            siteId={siteId}
                          />
                        )}
                      </Grid>
                    </Grid>
                  )}
                </Formik>
              </TabPanel>
              <TabPanel value="2">
                <OffChainDataGrid siteId={siteId} />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
