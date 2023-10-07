import { Save } from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import Cancel from "@mui/icons-material/Cancel";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    setRows((oldRows) => {
      let id = oldRows.length + 1;

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }));

      return [...oldRows, { id, name: "", age: "", isNew: true }];
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        <FormattedMessage id="add.record" defaultMessage="Add record" />
      </Button>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export interface AppDataTableProps<T extends { id: string; isNew: boolean }> {
  data: T[];
  dataColumns: {
    validate: (value: unknown) => boolean;
    name: string;
    headerName: string;
  }[];
}

export default function AppDataTable<Z extends { id: string; isNew: boolean }>({
  data,
  dataColumns,
}: AppDataTableProps<Z>) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<Z[]>([]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow: Z = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", editable: true },
    {
      field: "price",
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError = params.props.value.length < 3;

        return { ...params.props, error: hasError };
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      slots={{
        toolbar: EditToolbar,
      }}
      slotProps={{
        toolbar: { setRows, setRowModesModel },
      }}
    />
  );
}
