import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import useProductCollectionList from '@dexkit/ui/modules/commerce/hooks/useProductCollectionList';

export interface CollectionsTableProps {
  query: string;
}

export default function CollectionsTable({ query }: CollectionsTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useProductCollectionList({
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
            href={`/u/account/commerce/collections/${row.id}`}
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
        rowCount={data?.items.length}
        paginationMode="client"
        getRowId={(row) => String(row.id)}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={isLoading}
        sx={{ height: 300 }}
        slots={{
          noRowsOverlay: noRowsOverlay(
            <FormattedMessage
              id="no.collections"
              defaultMessage="No Collections"
            />,
            <FormattedMessage
              id="create.a.collection.to.see.it.here"
              defaultMessage="Create a collection to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage
              id="no.collections"
              defaultMessage="No Collections"
            />,
            <FormattedMessage
              id="create.a.collections.to.see.it.here"
              defaultMessage="Create a collections to see it here"
            />,
          ),
        }}
      />
    </Box>
  );
}
