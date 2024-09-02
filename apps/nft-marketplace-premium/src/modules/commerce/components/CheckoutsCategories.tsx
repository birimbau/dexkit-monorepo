import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import useCategoryList from '../hooks/useCategoryList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

export interface CategoriesTableProps {
  query: string;
}

export default function CategoriesTable({ query }: CategoriesTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useCategoryList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
        field: 'name',
        headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
        renderCell: ({ row }) => (
          <Link
            component={NextLink}
            href={`/u/account/commerce/categories/${row.id}`}
          >
            {row.name}
          </Link>
        ),
      },
    ] as GridColDef<CategoryType>[];
  }, []);

  return (
    <Box>
      <DataGrid
        columns={columns}
        rows={data?.items ?? []}
        rowCount={data?.totalItems}
        paginationMode="client"
        getRowId={(row) => String(row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={isLoading}
        sx={{ height: 300 }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage
              id="no.categories"
              defaultMessage="No Categories"
            />,
            <FormattedMessage
              id="create.a.category.to.see.it.here"
              defaultMessage="Create a category to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage
              id="no.categories"
              defaultMessage="No Categories"
            />,
            <FormattedMessage
              id="create.a.category.to.see.it.here"
              defaultMessage="Create a category to see it here"
            />,
          ),
        }}
      />
    </Box>
  );
}
