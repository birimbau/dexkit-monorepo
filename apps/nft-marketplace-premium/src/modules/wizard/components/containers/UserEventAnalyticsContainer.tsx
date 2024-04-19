import {
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import {
  beautifyCamelCase,
  formatStringNumber,
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
      minWidth: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'chainId',
      headerName: 'Network',
      minWidth: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      minWidth: 160,
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
    referralColumn,
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
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

const accountColumn: GridColDef = {
  renderHeader: () => (
    <FormattedMessage id="account" defaultMessage="Account" />
  ),
  minWidth: 200,
  flex: 1,
  field: 'from',
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
};

const chainIdColumn: GridColDef = {
  field: 'chainId',
  renderHeader: () => (
    <FormattedMessage id="network" defaultMessage="Network" />
  ),
  minWidth: 200,
  valueGetter: ({ row }) => {
    return NETWORK_NAME(row.chainId);
  },
};

const hashColunn: GridColDef = {
  field: 'hash',
  disableReorder: true,
  headerName: 'TX',
  minWidth: 200,
  renderCell: (params: any) =>
    params.row.hash ? (
      <Link
        target="_blank"
        href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${params.row.hash}`}
      >
        {truncateHash(params.row.hash)}
      </Link>
    ) : null,
};

const referralColumn: GridColDef = {
  field: 'referral',
  headerName: 'Referral',
  minWidth: 200,
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
};

const createdAtColumn: GridColDef = {
  field: 'createdAt',
  headerName: 'Created At',
  minWidth: 200,
  valueGetter: ({ row }) => {
    return new Date(row.createdAt).toLocaleString();
  },
};

const commonColumns = [
  createdAtColumn,
  chainIdColumn,
  hashColunn,
  accountColumn,
];

const columnTypes: { [key: string]: GridColDef[] } = {
  [UserOnChainEvents.nftAcceptListERC1155]: [
    ...commonColumns,
    {
      field: 'paidAmount',

      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="paid.amount" defaultMessage="Paid amount" />
      ),
      minWidth: 200,
      renderCell: (params: any) => {
        const { tokenAmount, token } = params.row.processedMetadata;

        return (
          <>
            {formatStringNumber(tokenAmount)} {token?.symbol?.toUpperCase()}
          </>
        );
      },
    },
    {
      field: 'paidAmount',

      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="paid.amount" defaultMessage="Paid amount" />
      ),
      minWidth: 200,
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection?.name) {
          return (
            <Link
              href={`${NETWORK_EXPLORER(
                params.row.chainId,
              )}/address/${collection?.address}`}
              target="_blank"
            >
              {collection?.name}
            </Link>
          );
        }
      },
    },
    {
      field: 'tokenId',

      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="token.id" defaultMessage="Token ID" />
      ),
      minWidth: 200,
      renderCell: (params: any) => {
        return params.row.processedMetadata.tokenId;
      },
    },
    {
      field: 'amount',
      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="amount" defaultMessage="Amount" />
      ),
      minWidth: 200,
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        return <>{nftAmount}</>;
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.swap]: [
    ...commonColumns,
    {
      field: 'amountIn',
      disableReorder: true,
      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="amount.in" defaultMessage="Amount In" />
      ),
      minWidth: 280,
      flex: 1,
      renderCell: (params: any) => {
        const { tokenInAmount, tokenIn } = params.row.processedMetadata;

        return (
          <Typography>
            {formatStringNumber(tokenInAmount)} {tokenIn?.symbol?.toUpperCase()}
          </Typography>
        );
      },
    },
    {
      field: 'amountOut',
      disableReorder: true,
      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="amount.out" defaultMessage="Amount Out" />
      ),
      flex: 1,
      minWidth: 280,
      renderCell: (params: any) => {
        const { tokenOut, tokenOutAmount } = params.row.processedMetadata;

        return (
          <Typography>
            {formatStringNumber(tokenOutAmount)}{' '}
            {tokenOut?.symbol?.toUpperCase()}
          </Typography>
        );
      },
    },
    {
      field: 'receivedFee',
      disableReorder: true,
      sortable: false,
      renderHeader: () => (
        <FormattedMessage id="Received.fee" defaultMessage="Received Fee" />
      ),
      flex: 1,
      minWidth: 280,
      renderCell: (params: any) => {
        const { receivedFee, tokenIn } = params.row.processedMetadata;

        if (receivedFee && tokenIn && tokenIn?.symbol) {
          return (
            <Typography>
              {formatStringNumber(receivedFee)} {tokenIn?.symbol?.toUpperCase()}
            </Typography>
          );
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.transfer]: [
    ...commonColumns,
    {
      field: 'amount',
      sortable: false,
      flex: 1,
      renderHeader: () => (
        <FormattedMessage id="amount" defaultMessage="Amount" />
      ),
      minWidth: 160,
      renderCell: (params: any) => {
        const { amount, token } = params.row.processedMetadata;
        if (amount && token) {
          return (
            <>
              {formatStringNumber(amount)} {token.symbol.toUpperCase()}
            </>
          );
        }
      },
    },
    {
      field: 'to',
      sortable: false,
      renderHeader: () => <FormattedMessage id="to" defaultMessage="To" />,
      minWidth: 160,
      flex: 1,
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
    referralColumn,
  ],
  [UserOnChainEvents.nftAcceptOfferERC1155]: [
    ...commonColumns,
    {
      renderHeader: () => (
        <FormattedMessage id="tokenId" defaultMessage="Token ID" />
      ),
      field: 'tokenId',

      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const { tokenId } = params.row.processedMetadata;

        if (tokenId) {
          return tokenId;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
      ),
      field: 'tokenAmount',

      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const { tokenAmount } = params.row.processedMetadata;
        if (tokenAmount) {
          return tokenAmount;
        }
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

      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection) {
          return collection?.name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      field: 'nftAmount',
      flex: 1,

      sortable: false,
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        if (nftAmount) {
          return nftAmount;
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.nftAcceptOfferERC721]: [
    ...commonColumns,
    {
      renderHeader: () => (
        <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
      ),
      minWidth: 200,
      flex: 1,
      field: 'tokenAmount',

      sortable: false,
      renderCell: (params: any) => {
        const { tokenAmount, token } = params.row.processedMetadata;
        if (tokenAmount) {
          return (
            <>
              {formatStringNumber(tokenAmount)} {token?.symbol?.toUpperCase()}
            </>
          );
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage
          id="collection.name"
          defaultMessage="Collection Name"
        />
      ),
      minWidth: 200,
      flex: 1,

      sortable: false,
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection?.name) {
          return collection?.name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      flex: 1,
      minWidth: 200,
      field: 'nftAmount',

      sortable: false,
      renderCell: (params: any) => {
        const { nftAmount, token } = params.row.processedMetadata;

        if (nftAmount) {
          return <>{nftAmount}</>;
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.nftAcceptListERC721]: [
    ...commonColumns,
    {
      renderHeader: () => (
        <FormattedMessage id="token.amount" defaultMessage="Token Amount" />
      ),
      minWidth: 200,
      field: 'tokenAmount',

      sortable: false,
      flex: 1,
      renderCell: (params: any) => {
        const { tokenAmount, token } = params.row.processedMetadata;

        if (tokenAmount && token) {
          return (
            <>
              {formatStringNumber(tokenAmount)} {token?.symbol?.toUpperCase()}
            </>
          );
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage
          id="collection.name"
          defaultMessage="Collection name"
        />
      ),
      flex: 1,
      minWidth: 200,

      sortable: false,
      field: 'collectionName',
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection?.name) {
          return collection?.name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      field: 'nftAmount',

      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        if (nftAmount) {
          return nftAmount;
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.buyDropCollection]: [
    ...commonColumns,
    {
      renderHeader: () => (
        <FormattedMessage id="price" defaultMessage="Price" />
      ),
      minWidth: 200,
      field: 'price',
      flex: 1,
      sortable: false,
      renderCell: (params: any) => {
        const { price } = params.row.processedMetadata;

        if (price) {
          return price;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage
          id="collection.name"
          defaultMessage="Collection Name"
        />
      ),
      minWidth: 200,
      flex: 1,
      field: 'collectionName',

      sortable: false,
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection?.name) {
          return collection?.name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      field: 'nftAmount',

      sortable: false,
      minWidth: 200,
      flex: 1,
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        if (nftAmount) {
          return nftAmount;
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.buyDropEdition]: [
    ...commonColumns,
    {
      renderHeader: () => (
        <FormattedMessage id="price" defaultMessage="Price" />
      ),
      minWidth: 200,
      field: 'price',
      flex: 1,
      sortable: false,
      renderCell: (params: any) => {
        const { price } = params.row.processedMetadata;

        if (price) {
          return price;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage
          id="collection.name"
          defaultMessage="Collection Name"
        />
      ),
      flex: 1,
      minWidth: 200,
      field: 'collectionName',

      sortable: false,
      renderCell: (params: any) => {
        const { collection } = params.row.processedMetadata;

        if (collection?.name) {
          return collection?.name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="nft.amount" defaultMessage="NFT Amount" />
      ),
      minWidth: 200,
      field: 'nftAmount',
      flex: 1,
      sortable: false,
      renderCell: (params: any) => {
        const { nftAmount } = params.row.processedMetadata;

        if (nftAmount) {
          return nftAmount;
        }
      },
    },
    referralColumn,
  ],
  [UserOnChainEvents.deployContract]: [
    ...commonColumns,
    {
      renderHeader: () => <FormattedMessage id="type" defaultMessage="Type" />,
      minWidth: 200,
      flex: 1,
      field: 'type',
      sortable: false,
      renderCell: (params: any) => {
        const { type } = params.row.processedMetadata;

        if (type) {
          return type;
        }
      },
    },
    {
      renderHeader: () => <FormattedMessage id="name" defaultMessage="Name" />,
      minWidth: 200,
      flex: 1,
      field: 'name',
      sortable: false,
      renderCell: (params: any) => {
        const { name } = params.row.processedMetadata;

        if (name) {
          return name;
        }
      },
    },
    {
      renderHeader: () => (
        <FormattedMessage id="address" defaultMessage="Address" />
      ),
      minWidth: 200,
      flex: 1,
      field: 'address',
      sortable: false,
      renderCell: (params: any) => {
        const { address } = params.row.processedMetadata;

        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${address}`}
          >
            {truncateAddress(address)}
          </Link>
        );
      },
    },
    referralColumn,
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

  const handleSubmitFilters = () => {};

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
              <FormattedMessage id="events" defaultMessage="Events" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="view.user.interaction.data.within.your.dApp.to.gain.insights"
                defaultMessage="View user interaction data within your DApp to gain insights"
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
        {/* <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                <Formik
                  initialValues={{ start: '', end: '' }}
                  onSubmit={handleSubmitFilters}
                >
                  {({}) => (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Field
                          component={DateTimePicker}
                          label={
                            <FormattedMessage
                              id="start"
                              defaultMessage="Start"
                            />
                          }
                          name="name"
                          textField={{
                            fullWidth: true,
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Field
                          component={DateTimePicker}
                          label={
                            <FormattedMessage id="end" defaultMessage="End" />
                          }
                          name="name"
                          textField={{
                            fullWidth: true,
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  )}
                </Formik>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage
                      id="total.events"
                      defaultMessage="Total events"
                    />
                  </Typography>
                  <Typography variant="h5">300</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopEventsCard />
            </Grid>
          </Grid>
        </Grid> */}
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

                            <MenuItem
                              value={UserOnChainEvents.nftAcceptListERC1155}
                            >
                              <FormattedMessage
                                id="accept.nft.listing.erc1155"
                                defaultMessage="Accept NFT Listing ERC1155"
                              />
                            </MenuItem>

                            <MenuItem
                              value={UserOnChainEvents.nftAcceptListERC721}
                            >
                              <FormattedMessage
                                id="accept.nft.list.erc721"
                                defaultMessage="Accept NFT List ERC721"
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
                            <MenuItem value={UserOnChainEvents.deployContract}>
                              <FormattedMessage
                                id="contract.deployment"
                                defaultMessage="Contract deployment"
                              />
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
