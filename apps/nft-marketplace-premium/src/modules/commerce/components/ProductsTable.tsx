import { Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import { useMemo, useState } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import useProductList from '../hooks/useProductList';
import { ProductFormType } from '../types';

import NextLink from 'next/link';

export interface ProducstTableProps {
  query: string;
}

export default function ProductsTable({ query }: ProducstTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 5,
    pageSize: 10,
  });

  const { data } = useProductList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        field: 'name',
        flex: 1,
        headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
        renderCell: ({ row }) => (
          <Link
            component={NextLink}
            href={`/u/account/commerce/products/${row.id}`}
          >
            {row.name}
          </Link>
        ),
      },
      {
        field: 'price',
        flex: 1,
        headerName: formatMessage({ id: 'price', defaultMessage: 'Price' }),
        renderCell: ({ row }) => (
          <Typography variant="inherit">
            <FormattedNumber
              currency="usd"
              minimumFractionDigits={2}
              maximumFractionDigits={2}
              style="currency"
              value={new Decimal(row.price).toNumber()}
            />
          </Typography>
        ),
      },
    ] as GridColDef<ProductFormType>[];
  }, []);

  return (
    <DataGrid
      columns={columns}
      rowCount={data?.totalItems}
      rows={data?.items ?? []}
      paginationMode="client"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  );
}
