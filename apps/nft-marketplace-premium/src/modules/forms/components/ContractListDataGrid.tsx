import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { truncateAddress } from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useListDeployedContracts } from '../hooks';

export default function ContractListDataGrid() {
  const { account } = useWeb3React();
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: { owner: account?.toLowerCase() },
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useListDeployedContracts({
    ...queryOptions,
    ...paginationModel,
  });

  useEffect(() => {
    setQueryOptions({
      ...queryOptions,
      filter: { ...queryOptions?.filter, owner: account?.toLowerCase() || '' },
    });
  }, [account]);

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState
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

  const { NETWORK_NAME, NETWORK_EXPLORER } = useNetworkMetadata();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
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
      field: 'contractAddress',
      headerName: 'Address',
      width: 160,
      renderCell: (params: any) => (
        <Link
          target="_blank"
          href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
            params.row.contractAddress
          }`}
        >
          {truncateAddress(params.row.contractAddress)}
        </Link>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <Button
              LinkComponent={Link}
              href={`/contract/${NETWORK_SLUG(row.chainId)}/${
                row.contractAddress
              }`}
              size="small"
              variant="outlined"
            >
              <FormattedMessage id="manage" defaultMessage="Manage" />
            </Button>
            <Button
              LinkComponent={Link}
              href={`/forms/create?contractAddress=${row.contractAddress}&chainId=${row.chainId}`}
              target="_blank"
              size="small"
              variant="outlined"
            >
              <FormattedMessage id="create.form" defaultMessage="Create form" />
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
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
    </Box>
  );
}
