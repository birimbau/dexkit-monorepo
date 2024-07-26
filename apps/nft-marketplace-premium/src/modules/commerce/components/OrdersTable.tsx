import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { CheckoutFormType } from '../types';

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
        field: 'title',
        headerName: formatMessage({ id: 'title', defaultMessage: 'Title' }),
        renderCell: ({ row }) => (
          <Link
            component={NextLink}
            href={`/u/account/commerce/checkouts/${row.id}`}
          >
            {row.title}
          </Link>
        ),
      },
      {
        field: 'description',
        headerName: formatMessage({
          id: 'description',
          defaultMessage: 'Description',
        }),
      },
      {
        field: 'total',
        headerName: formatMessage({ id: 'total', defaultMessage: 'total' }),
      },
    ] as GridColDef<CheckoutFormType>[];
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
