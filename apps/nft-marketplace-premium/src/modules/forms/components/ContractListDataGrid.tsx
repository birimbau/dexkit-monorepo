import Box from '@mui/material/Box';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { useListDeployedContracts } from '../hooks';

export default function ContractListDataGrid() {
  const { data } = useListDeployedContracts({});
  const handleGoToForm = (id: string) => {
    return undefined;
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
    },
    {
      field: 'network',
      headerName: 'Network',
      width: 110,
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<></>}
            label="Create Form"
            className="textPrimary"
            onClick={handleGoToForm(id.toString())}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data?.data as any}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
