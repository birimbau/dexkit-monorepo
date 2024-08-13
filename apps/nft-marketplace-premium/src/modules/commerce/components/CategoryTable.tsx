import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import { getWindowUrl } from '@dexkit/core/utils/browser';
import Share from '@mui/icons-material/Share';
import { Box, IconButton, Tooltip } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import useCategoryList from '../hooks/useCategoryList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

export interface CategoryTableProps {
  query: string;
  onShare: (url: string) => void;
}

export default function CategoryTable({ query, onShare }: CategoryTableProps) {
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
      {
        flex: 1,
        field: 'actions',
        headerName: formatMessage({
          id: 'actions',
          defaultMessage: 'Actions',
        }),
        renderCell: ({ row }) => (
          <IconButton onClick={() => onShare(`${getWindowUrl()}/c/${row.id}`)}>
            <Tooltip
              title={<FormattedMessage id="share" defaultMessage="Share" />}
            >
              <Share />
            </Tooltip>
          </IconButton>
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
              id="no.checkouts"
              defaultMessage="No Checkouts"
            />,
            <FormattedMessage
              id="create.checkouts.to.see.it.here"
              defaultMessage="Create checkouts to see it here"
            />,
          ),
          loadingOverlay: LoadingOverlay,
          noResultsOverlay: noRowsOverlay(
            <FormattedMessage
              id="no.checkouts"
              defaultMessage="No Checkouts"
            />,
            <FormattedMessage
              id="create.checkouts.to.see.it.here"
              defaultMessage="Create checkouts to see it here"
            />,
          ),
        }}
      />
    </Box>
  );
}
