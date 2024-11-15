import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Order } from '../types';

import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import useUserOrderList from '../hooks/orders/useUserOrdersList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';
import TokenDataContainer from './TokenDataContainer';

import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/router';

export interface OrdersTableProps {
  query: string;
}

export default function UserOrdersTable({ query }: OrdersTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { account } = useWeb3React();

  const { data } = useUserOrderList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
    address: account ?? '',
  });

  const { formatMessage } = useIntl();

  const router = useRouter();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: 'order',
        headerName: formatMessage({
          id: 'order.id',
          defaultMessage: 'Order ID',
        }),
        renderCell: ({ row }) => (
          <Link component={NextLink} href={`/c/orders/${row.id}`}>
            {row.id.substring(10)}
          </Link>
        ),
      },
      {
        flex: 1,
        field: 'total',
        headerName: formatMessage({
          id: 'total',
          defaultMessage: 'Total',
        }),
        renderCell: ({ row }) => {
          return (
            <TokenDataContainer
              contractAddress={row.contractAddress}
              chainId={row.chainId}
            >
              {({ symbol }) => `${row.amount} ${symbol}`}
            </TokenDataContainer>
          );
        },
      },
      {
        flex: 1,
        field: 'contractAddress',
        headerName: formatMessage({
          id: 'token',
          defaultMessage: 'Token',
        }),
        renderCell: ({ row }) => {
          return (
            <Link
              target="_blank"
              href={`${getBlockExplorerUrl(row.chainId)}/address/${
                row.contractAddress
              }`}
            >
              <TokenDataContainer
                contractAddress={row.contractAddress}
                chainId={row.chainId}
              >
                {({ name }) => name}
              </TokenDataContainer>
            </Link>
          );
        },
      },
      {
        flex: 1,
        field: 'hash',
        headerName: formatMessage({
          id: 'transaction',
          defaultMessage: 'Transaction',
        }),
        renderCell: ({ row }) => {
          return (
            <Link
              target="_blank"
              href={`${getBlockExplorerUrl(row.chainId)}/tx/${row.hash}`}
            >
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </Link>
          );
        },
      },
    ] as GridColDef<Order>[];
  }, []);

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={data?.items ?? []}
        rowCount={0}
        paginationMode="server"
        getRowId={(row) => String(row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onRowClick={({ row }) => {
          router.push(`/c/orders/${row.id}`);
        }}
        disableRowSelectionOnClick
        sx={{
          height: 300,
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none !important',
          },
          border: 'none',
          '--DataGrid-overlayHeight': '150px', // disable cell selection style
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // pointer cursor on ALL rows
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage id="no.orders" defaultMessage="No Orders" />,
            <FormattedMessage
              id="create.orders.to.see.it.here"
              defaultMessage="Create orders to see it here"
            />,
            <Box sx={{ fontSize: '3rem' }}>
              <AssignmentIcon fontSize="inherit" />
            </Box>,
          ),
        }}
      />
    </Box>
  );
}
