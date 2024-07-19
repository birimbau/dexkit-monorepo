import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export default function ProductsTable() {
  const data: any[] = [];

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: formatMessage({ id: 'id', defaultMessage: 'id' }),
      },
      {
        field: 'name',
        headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
      },
      {
        field: 'price',
        headerName: formatMessage({ id: 'price', defaultMessage: 'Price' }),
      },
    ] as GridColDef[];
  }, []);

  return <DataGrid columns={columns} rows={data} paginationMode="server" />;
}
