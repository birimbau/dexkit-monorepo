import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import { Box, IconButton, Stack } from '@mui/material';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import useDeleteProductCollection from '@dexkit/ui/modules/commerce/hooks/useDeleteProductCollection';
import useProductCollectionList from '@dexkit/ui/modules/commerce/hooks/useProductCollectionList';
import Delete from '@mui/icons-material/DeleteOutline';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';

import LabelIcon from '@mui/icons-material/Label';

const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface CollectionsTableProps {
  query: string;
}

export default function CollectionsTable({ query }: CollectionsTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading, refetch } = useProductCollectionList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteProductCollection, isLoading: isLoadingDelete } =
    useDeleteProductCollection();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();

  const handleDelete = useCallback((id: string) => {
    return () => {
      setSelectedId(id);
      setShowConfirm(true);
    };
  }, []);

  const handleClose = () => {
    setShowConfirm(false);
    setSelectedId(undefined);
  };

  const handleConfirm = async () => {
    if (selectedId) {
      try {
        await deleteProductCollection({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="collection.deleted"
            defaultMessage="Collection deleted"
          />,
          { variant: 'success' },
        );
        setShowConfirm(false);
        setSelectedId(undefined);
      } catch (err) {
        enqueueSnackbar(String(err), { variant: 'error' });
      }
    }

    await refetch();
  };

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
      {
        field: 'actions',
        flex: 1,
        headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
        renderCell: ({ row }) => (
          <Stack direction="row">
            <IconButton onClick={handleDelete(row.id ?? '')}>
              <Delete color="error" />
            </IconButton>
          </Stack>
        ),
      },
    ] as GridColDef<CategoryType>[];
  }, []);

  return (
    <>
      {showConfirm && (
        <AppConfirmDialog
          DialogProps={{ open: showConfirm, onClose: handleClose }}
          onConfirm={handleConfirm}
          isConfirming={isLoading}
          title={
            <FormattedMessage
              id="delete.collection"
              defaultMessage="Delete collection"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.collection"
            defaultMessage="Do you really want to delete this collection?"
          />
        </AppConfirmDialog>
      )}
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
                id="no.collections"
                defaultMessage="No Collections"
              />,
              <FormattedMessage
                id="create.a.collection.to.see.it.here"
                defaultMessage="Create a collection to see it here"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <LabelIcon fontSize="inherit" />
              </Box>,
            ),
            loadingOverlay: LoadingOverlay,
            noResultsOverlay: noRowsOverlay(
              <FormattedMessage
                id="no.collections"
                defaultMessage="No collections"
              />,
              <FormattedMessage
                id="add.collections.to.your.store"
                defaultMessage="Add collections to your store"
              />,
              <Box sx={{ fontSize: '3rem' }}>
                <LabelIcon fontSize="inherit" />
              </Box>,
            ),
          }}
        />
      </Box>
    </>
  );
}
