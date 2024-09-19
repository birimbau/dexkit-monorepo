import {
  Avatar,
  Box,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Decimal from 'decimal.js';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import useProductList from '../hooks/useProductList';
import { ProductFormType } from '../types';

import NextLink from 'next/link';
import { LoadingOverlay } from './LoadingOverlay';
import { noRowsOverlay } from './NoRowsOverlay';

import Delete from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import useDeleteProduct from '../hooks/useDeleteProduct';
const AppConfirmDialog = dynamic(
  () => import('@dexkit/ui/components/AppConfirmDialog'),
);

export interface ProducstTableProps {
  query: string;
}

export default function ProductsTable({ query }: ProducstTableProps) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 5,
    pageSize: 10,
  });

  const { data, isFetched, refetch } = useProductList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
    q: query,
  });

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: deleteProduct, isLoading } = useDeleteProduct();

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
        await deleteProduct({ id: selectedId });

        enqueueSnackbar(
          <FormattedMessage
            id="product.deleted"
            defaultMessage="Product deleted"
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
        field: 'image',
        headerName: formatMessage({
          id: 'image',
          defaultMessage: 'Image',
        }),
        renderCell: ({ row }) => (
          <Avatar variant="rounded" src={row.imageUrl}>
            <InventoryIcon />
          </Avatar>
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
    ] as GridColDef<ProductFormType>[];
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
              id="delete.product"
              defaultMessage="Delete product"
            />
          }
        >
          <FormattedMessage
            id="do.you.really.want.to.delete.this.product"
            defaultMessage="Do you really want to delete this product?"
          />
        </AppConfirmDialog>
      )}
      <Box>
        {isFetched && (
          <DataGrid
            columns={columns}
            rowCount={data?.totalItems}
            rows={data?.items ?? []}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ height: 300 }}
            slots={{
              noRowsOverlay: noRowsOverlay(
                <FormattedMessage
                  id="no.products"
                  defaultMessage="No Products"
                />,
                <FormattedMessage
                  id="create.products.to.see.it.here"
                  defaultMessage="Create products to see it here"
                />,
              ),
              loadingOverlay: LoadingOverlay,
              noResultsOverlay: noRowsOverlay(
                <FormattedMessage
                  id="no.products"
                  defaultMessage="No Products"
                />,
                <FormattedMessage
                  id="create.products.to.see.it.here"
                  defaultMessage="Create products to see it here"
                />,
              ),
            }}
          />
        )}
      </Box>
    </>
  );
}
