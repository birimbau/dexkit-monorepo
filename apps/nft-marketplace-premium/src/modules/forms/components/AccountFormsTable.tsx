import { useIsMobile } from '@dexkit/core';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { getWindowUrl } from '@dexkit/core/utils/browser';
import { AppConfirmDialog } from '@dexkit/ui';
import ShareDialog from '@dexkit/ui/components/dialogs/ShareDialog';
import { ContractFormData } from '@dexkit/ui/modules/forms/hooks/index';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import { ADMIN_FORMS_ACTION_LIST } from '../constants/actions';

export interface AccountFormsTableProps {
  forms: ContractFormData[];
}

export default function AccountFormsTable({ forms }: AccountFormsTableProps) {
  const router = useRouter();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { formatMessage } = useIntl();

  const isMobile = useIsMobile();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [rowId, setRowId] = useState<GridRowId>();

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setRowId(undefined);
  };

  const [showRemove, setShowRemove] = useState(false);

  const handleCloseRemove = () => {
    setShowRemove(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handlePreview = (id: GridRowId) => {
    const config = forms.find((c) => c.id === id);
  };

  const handleEdit = (id: GridRowId) => {
    const form = forms.find((c) => c.id === id);
    handleCloseMenu();

    router.push(`/admin/edit/${form?.id}`);
  };

  const [selectedId, setSelectedId] = useState<number>();

  const handleRemove = (id: GridRowId) => {
    setShowRemove(true);
    setSelectedId(id as number);
    handleCloseMenu();
  };

  const [showShare, setShowShare] = useState(false);

  const handleShare = (id: GridRowId) => {
    setShowShare(true);
    setSelectedId(id as number);
  };

  const handleCloseShare = () => {
    setShowShare(false);
    setSelectedId(undefined);
  };

  const handleAction = (action: string, id: GridRowId) => {
    switch (action) {
      case 'preview':
        handlePreview(id);
        break;
      case 'edit':
        handleEdit(id);
        break;
      case 'delete':
        handleRemove(id);
        break;
      case 'share':
        handleShare(id);
        break;
      default:
        break;
    }
  };

  const renderIconButton = (row: ContractFormData, menuItem: any) => {
    if (menuItem.value === 'explorer') {
      return (
        <IconButton
          LinkComponent={Link}
          href={`${getBlockExplorerUrl(row.params.chainId)}/address/${
            row.params.contractAddress
          }`}
          target="_blank"
        >
          {menuItem.icon}
        </IconButton>
      );
    }

    return (
      <IconButton onClick={() => handleAction(menuItem.value, row.id)}>
        {menuItem.icon}
      </IconButton>
    );
  };

  const columns: GridColDef<ContractFormData>[] = [
    {
      field: 'name',
      headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),

      flex: 1,
      valueGetter: ({ row }) => {
        return row.name;
      },
    },
    {
      field: 'description',
      flex: 1,
      headerName: formatMessage({
        id: 'description',
        defaultMessage: 'Description',
      }),
      minWidth: 200,
      renderCell: ({ row }) => {
        return row.description;
      },
    },
    {
      field: 'action',
      flex: 1,
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      minWidth: 200,
      renderCell: ({ row }) => {
        if (isMobile) {
          return (
            <IconButton
              onClick={(e) => {
                setRowId(row.id);
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
          );
        }

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            {ADMIN_FORMS_ACTION_LIST.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  <FormattedMessage
                    id={item.title.id}
                    defaultMessage={item.title.defaultMessage}
                  />
                }
              >
                {renderIconButton(row, item)}
              </Tooltip>
            ))}
            <div>{}</div>
          </Stack>
        );
      },
    },
  ];

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {}, []);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'rating',
      sort: 'desc',
    },
  ]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    setSortModel(sortModel);
  }, []);

  const handleClickAction = (action: string, id?: GridRowId) => {
    return () => {
      if (id !== undefined) {
        handleAction(action, id);
      }
    };
  };

  const handleConfirmRemove = () => {
    setSelectedId(undefined);
    setShowRemove(false);
  };

  return (
    <>
      <ShareDialog
        dialogProps={{
          open: showShare,
          onClose: handleCloseShare,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        url={`${getWindowUrl()}/forms/${selectedId}`}
      />
      {rowId && (
        <Menu open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {ADMIN_FORMS_ACTION_LIST.map((item, index) => (
            <MenuItem
              onClick={handleClickAction(item.value, rowId)}
              key={index}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={item.title.id}
                    defaultMessage={item.title.defaultMessage}
                  />
                }
              />
            </MenuItem>
          ))}
        </Menu>
      )}
      {selectedId && (
        <AppConfirmDialog
          DialogProps={{
            open: showRemove,
            onClose: handleCloseRemove,
          }}
          onConfirm={handleConfirmRemove}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.app"
            defaultMessage="Do you really want to remove this app"
          />
        </AppConfirmDialog>
      )}

      <DataGrid
        getRowId={(row) => row.id}
        autoHeight
        rows={forms}
        columns={columns}
        rowCount={forms.length}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sortModel={sortModel}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        loading={false}
      />
    </>
  );
}
