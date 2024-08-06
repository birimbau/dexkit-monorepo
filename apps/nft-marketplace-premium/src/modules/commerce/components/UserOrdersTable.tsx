import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Order } from '../types';

import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { useTokenDataQuery } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Box, Skeleton } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import useUserOrderList from '../hooks/orders/useUserOrdersList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

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
          const { data: tokenData } = useTokenDataQuery({
            address: row.contractAddress,
            chainId: row.chainId,
          });

          return `${row.amount} ${tokenData?.symbol}`;
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
          const { data: tokenData, isLoading } = useTokenDataQuery({
            address: row.contractAddress,
            chainId: row.chainId,
          });

          return (
            <Link
              target="_blank"
              href={`${getBlockExplorerUrl(row.chainId)}/address/${
                row.contractAddress
              }`}
            >
              {isLoading ? <Skeleton /> : tokenData?.name}
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
        sx={{ height: 300 }}
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
          ),
        }}
      />
    </Box>
  );
}
