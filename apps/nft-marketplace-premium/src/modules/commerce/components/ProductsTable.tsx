import { Avatar, Box, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import { useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import useProductList from '../hooks/useProductList';
import { ProductFormType } from '../types';

import NextLink from 'next/link';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

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
        field: 'image',
        headerName: formatMessage({
          id: 'image',
          defaultMessage: 'Image',
        }),
        renderCell: ({ row }) => (
          <Avatar variant="rounded" src={row.imageUrl} />
        ),
      },
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
              maximumFractionDigits={18}
              style="currency"
              value={new Decimal(row.price).toNumber()}
            />
          </Typography>
        ),
      },
    ] as GridColDef<ProductFormType>[];
  }, []);

  return (
    <Box>
      <DataGrid
        columns={columns}
        rowCount={data?.totalItems}
        rows={data?.items ?? []}
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{ height: 300 }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage id="no.products" defaultMessage="No Products" />,
            <FormattedMessage
              id="create.products.to.see.it.here"
              defaultMessage="Create products to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage id="no.products" defaultMessage="No Products" />,
            <FormattedMessage
              id="create.products.to.see.it.here"
              defaultMessage="Create products to see it here"
            />,
          ),
        }}
      />
    </Box>
  );
}
