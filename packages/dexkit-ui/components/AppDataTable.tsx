import { Save } from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import Cancel from "@mui/icons-material/Cancel";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import ImportExport from "@mui/icons-material/ImportExport";
import { Box, Button } from "@mui/material";
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
import Papa from "papaparse";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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

      return [...oldRows, { id, isNew: true }];
    });
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = () => {
    inputRef.current?.click();
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    let fileReader = new FileReader();

    fileReader.onload = function (ev: ProgressEvent<FileReader>) {
      const text = ev.target?.result;

      if (typeof text === "string") {
        let csv = Papa.parse(text, { header: true });

        console.log("entra aqui", csv.data);

        if (
          csv.meta.fields?.includes("address") &&
          csv.meta.fields?.includes("quantity")
        ) {
          let newRows = csv.data.map((line: any, index: number) => {
            return {
              id: index.toString(),
              address: line.address as string,
              quantity: line.quantity as string,
              isNew: false,
            };
          });

          setRows((old) => newRows);
        }
      }
    };

    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      fileReader.readAsText(file);
    }
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        ref={(ref) => (inputRef.current = ref)}
        onChange={handleChangeFile}
        accept=".csv"
      />
      <GridToolbarContainer>
        <Button color="primary" startIcon={<Add />} onClick={handleClick}>
          <FormattedMessage id="add.record" defaultMessage="Add record" />
        </Button>
        <Button
          color="primary"
          startIcon={<ImportExport />}
          onClick={handleImport}
        >
          <FormattedMessage id="import" defaultMessage="Import" />
        </Button>
        <GridToolbarExport />
      </GridToolbarContainer>
    </>
  );
}

export interface AppDataTableProps<T extends { id?: string; isNew?: boolean }> {
  data: any[];
  dataColumns: {
    isValid?: (value: unknown) => boolean;
    name: string;
    headerName: string;
    editable?: boolean;
  }[];
  onChange: (value: any) => void;
}

export default function AppDataTable<
  Z extends { id?: string; isNew?: boolean }
>({ data, dataColumns, onChange }: AppDataTableProps<Z>) {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [rows, setRows] = useState<Z[]>(
    data.map((item, index) => {
      return { ...item, isNew: false, id: index.toString() };
    })
  );

  useEffect(() => {
    onChange(
      rows.map((row) => {
        let newRow = { ...row };

        delete newRow.id;
        delete newRow.isNew;

        return newRow;
      })
    );
  }, [rows]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    console.log("id", id);
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

  const processRowUpdate = (newRow: GridRowModel<Z>) => {
    const updatedRow: Z = { ...newRow, isNew: false };

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      ...dataColumns.map((column) => {
        return {
          field: column.name,
          headerName: column.headerName,
          editable: column.editable,
          preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            if (column.isValid && params.props.value !== undefined) {
              const hasError = !column.isValid(params.props.value);

              console.log("is error", hasError, column.name);

              return { ...params.props, error: hasError };
            }

            return { ...params.props };
          },
        };
      }),
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
  }, [
    dataColumns,
    handleSaveClick,
    handleDeleteClick,
    handleCancelClick,
    rowModesModel,
  ]);

  return (
    <Box sx={{ minHeight: 100, width: "100%" }}>
      <DataGrid
        autoHeight
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
    </Box>
  );
}
