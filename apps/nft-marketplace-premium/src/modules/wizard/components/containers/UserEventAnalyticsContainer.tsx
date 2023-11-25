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
import { useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridToolbar } from '@mui/x-data-grid/components';

import {
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from '@mui/x-data-grid/models';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';

function OnChainDataGrid({ siteId }: Props) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
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
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${params.row.hash}`}
        >
          {truncateHash(params.row.hash)}
        </Link>
      ),
    },
    {
      field: 'from',
      headerName: 'Account',
      width: 200,
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${params.row
            ?.from}`}
        >
          {truncateAddress(params.row?.from)}
        </Link>
      ),
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
  ];

  return (
    <DataGrid
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
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${params.row
            ?.from}`}
        >
          {truncateAddress(params.row?.from)}
        </Link>
      ),
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
  ];

  return (
    <DataGrid
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

interface Props {
  siteId?: number;
}

export default function UserEventAnalyticsContainer({ siteId }: Props) {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
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
              <OnChainDataGrid siteId={siteId} />
            </TabPanel>
            <TabPanel value="2">
              <OffChainDataGrid siteId={siteId} />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
    </Grid>
  );
}
