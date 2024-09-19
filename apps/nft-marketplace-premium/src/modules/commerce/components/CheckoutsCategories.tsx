import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CategoryType } from '../types';

import useDeleteCategory from '@dexkit/ui/modules/commerce/hooks/useDeleteCategory';
import Delete from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack } from '@mui/material';
import Link from '@mui/material/Link';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import useCategoryList from '../hooks/useCategoryList';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface CategoriesTableProps {
  query: string;
}

export default function CategoriesTable({ query }: CategoriesTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading, refetch } = useCategoryList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteCategory, isLoading: isLoadingDelete } =
    useDeleteCategory();

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
        await deleteCategory({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="category.deleted"
            defaultMessage="Category deleted"
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
            href={`/u/account/commerce/categories/${row.id}`}
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
              id="delete.category"
              defaultMessage="Delete category"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.category"
            defaultMessage="Do you really want to delete this categogry?"
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
    </>
  );
}
