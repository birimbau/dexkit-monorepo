import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export default function CheckoutsTable() {
  const data: any[] = [];

  const { formatMessage } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: formatMessage({ id: 'id', defaultMessage: 'id' }),
      },
      {
        field: 'total',
        headerName: formatMessage({ id: 'total', defaultMessage: 'total' }),
      },
    ] as GridColDef[];
  }, []);

  return <DataGrid columns={columns} rows={data} paginationMode="server" />;
}
