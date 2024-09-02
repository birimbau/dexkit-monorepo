import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useCheckoutList from '../hooks/checkout/useCheckoutList';
import { CheckoutFormType } from '../types';

import { getWindowUrl } from '@dexkit/core/utils/browser';
import Share from '@mui/icons-material/Share';
import { Box, IconButton, Tooltip } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

export interface CheckoutsTableProps {
  query: string;
  onShare: (url: string) => void;
}

export default function CheckoutsTable({
  query,
  onShare,
}: CheckoutsTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading } = useCheckoutList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        flex: 1,
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
        flex: 1,
        field: 'description',
        headerName: formatMessage({
          id: 'description',
          defaultMessage: 'Description',
        }),
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
    ] as GridColDef<CheckoutFormType>[];
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
