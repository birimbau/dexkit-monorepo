import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import useCheckoutList from '../hooks/checkout/useCheckoutList';
import { CheckoutFormType } from '../types';

export default function CheckoutsTable() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data } = useCheckoutList({
    limit: paginationModel.pageSize,
    page: paginationModel.page,
  });

  const { formatMessage } = useIntl();

  console.log('vem amis', data);

  const columns = useMemo(() => {
    return [
      {
        field: 'title',
        headerName: formatMessage({ id: 'title', defaultMessage: 'Title' }),
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
