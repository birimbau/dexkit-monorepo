import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ConfigResponse } from '../../../../../types/whitelabel';

import { ADMIN_TABLE_LIST } from '@/modules/admin/constants';
import { useIsMobile } from '@dexkit/core';
import { AppLink } from '@dexkit/ui';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import MoreVert from '@mui/icons-material/MoreVert';
import { IconButton, Stack, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRowId,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { FormattedMessage, useIntl } from 'react-intl';
import Menu from './Menu';

interface Props {
  configs: ConfigResponse[];
  onConfigureDomain: (config: ConfigResponse) => void;
}

export default function MarketplacesTableV2({ configs }: Props) {
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

  const handleAction = (action: string, id: GridRowId) => {
    switch (action) {
      case '':
        break;
      case '':
        break;
      case '':
        break;
      case '':
        break;
      default:
        break;
    }
  };

  const handleMenuAction = (action: string) => {
    if (rowId) {
      handleAction(action, rowId);
    }
  };

  const columns: GridColDef<ConfigResponse>[] = [
    {
      field: 'name',
      headerName: formatMessage({ id: 'name', defaultMessage: 'Name' }),
      minWidth: 200,
      valueGetter: ({ row }) => {
        return row.slug;
      },
    },
    {
      field: 'domain',
      headerName: formatMessage({ id: 'domain', defaultMessage: 'Domain' }),
      minWidth: 200,
      renderCell: ({ row }) => {
        const appConfig: AppConfig = JSON.parse(row.config);

        if (row.previewUrl) {
          return <AppLink href={row.previewUrl}>{row.previewUrl}</AppLink>;
        }

        if (appConfig.domain && appConfig.domain !== '') {
          return (
            <AppLink href={appConfig.domain} target={'_blank'}>
              {appConfig.domain}
            </AppLink>
          );
        }
      },
    },
    {
      field: 'action',
      headerName: formatMessage({ id: 'actions', defaultMessage: 'Actions' }),
      minWidth: 200,
      renderCell: ({ row, id }) => {
        if (isMobile) {
          return (
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setRowId(id);
              }}
            >
              <MoreVert />
            </IconButton>
          );
        }

        return (
          <Stack direction="row" alignItems="center">
            {ADMIN_TABLE_LIST.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  <FormattedMessage
                    id={item.text.id}
                    defaultMessage={item.text.defaultMessage}
                  />
                }
              >
                <IconButton onClick={() => handleAction(item.value, id)}>
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        );
      },
    },
  ];

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {}, []);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {},
  []);

  return (
    <>
      {/* <AppConfirmDialog
        DialogProps={{
          open: isOpen,
          onClose: handleClose,
        }}
        onConfirm={handleConfirmRemove}
      >
        <FormattedMessage
          id="do.you.really.want.to.remove.this.app"
          defaultMessage="Do you really want to remove this app"
        />
      </AppConfirmDialog> */}
      <Menu
        anchorEl={anchorEl}
        onAction={handleMenuAction}
        onClose={handleCloseMenu}
        open={Boolean(anchorEl)}
      />
      <DataGrid
        getRowId={(row) => row.id}
        autoHeight
        slots={{ toolbar: GridToolbar }}
        rows={configs || []}
        columns={columns}
        rowCount={configs.length}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        sortingMode="server"
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
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
