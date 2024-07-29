import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Order } from '../types';

import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import useOrderList from '../hooks/orders/useOrdersList';

export interface OrdersTableProps {
  query: string;
}

export default function OrdersTable({ query }: OrdersTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data } = useOrderList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
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
          <Link
            component={NextLink}
            href={`/u/account/commerce/orders/${row.id}`}
          >
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
          return row.amount;
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
              {truncateAddress(row.contractAddress)}
            </Link>
          );
        },
      },
      {
        flex: 1,
        field: 'senderAddress',
        headerName: formatMessage({ id: 'creator', defaultMessage: 'Creator' }),
        renderCell: ({ row }) => (
          <Link component={NextLink} href={`/`}>
            {truncateAddress(row.senderAddress)}
          </Link>
        ),
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
    <DataGrid
      columns={columns}
      rows={data?.items ?? []}
      rowCount={data?.totalItems}
      paginationMode="client"
      getRowId={(row) => String(row.id)}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  );
}
