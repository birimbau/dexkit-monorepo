import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import {
  Button,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SiteResponse } from '../../../../types/whitelabel';
import {
  useAppVersionQuery,
  useDeleteAppVersionMutation,
  useSetAppVersionMutation,
} from '../../hooks';
import AddAppVersionFormDialog from '../dialogs/AddAppVersionFormDialog';
import InfoDialog from '../dialogs/InfoDialog';

interface AppVersion {
  id: number;
  version: string;
  createdAt: number;
  description: string;
}

interface Props {
  site?: SiteResponse | null;
  onClickDelete({ version }: { version: AppVersion }): void;
  onClickEdit({ version }: { version: AppVersion }): void;
  onClickSetVersion({ version }: { version: AppVersion }): void;
  onClickPreview({ version }: { version: AppVersion }): void;
  versions?: AppVersion[];
}

function AppVersions({ site, onClickDelete }: Props) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useAppVersionQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: site?.id,
  });

  const [rowCountState, setRowCountState] = useState((data?.total as any) || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: number) =>
      data?.total !== undefined ? data?.total : prevRowCountState,
    );
  }, [data?.total, setRowCountState]);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setQueryOptions({
      ...queryOptions,
      sort:
        sortModel && sortModel.length
          ? [sortModel[0].field, sortModel[0].sort]
          : [],
    });
  }, []);

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let filter = { ...queryOptions?.filter };
    if (filterModel.quickFilterValues?.length) {
      filter = {
        ...filter,
        q: filterModel.quickFilterValues[0],
      };
    }

    setQueryOptions({ ...queryOptions, filter });
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },

    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'version',
      headerName: 'version',
      width: 50,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction={'row'} spacing={1}>
            <Tooltip
              title={
                <FormattedMessage
                  id={'preview.app.version'}
                  defaultMessage={'Preview app version'}
                />
              }
            >
              <IconButton>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'edit.version'}
                  defaultMessage={'Edit version'}
                />
              }
            >
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'set.app.to.this.version'}
                  defaultMessage={'Set app to this version'}
                />
              }
            >
              <IconButton>
                <SettingsBackupRestoreIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <DataGrid
      slots={{ toolbar: GridToolbar }}
      rows={(data?.data as any) || []}
      columns={columns}
      rowCount={rowCountState}
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
      loading={isLoading}
    />
  );
}

export default function AppVersionWizardContainer({ site, versions }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [openInfo, setOpenInfo] = useState(false);
  const [openAddVersion, setOpenAddVersion] = useState(false);
  const [titleInfo, setTitleInfo] = useState('');
  const [contentInfo, setContentInfo] = useState('');

  const [selectedVersion, setSelectedVersion] = useState<
    AppVersion | undefined
  >(undefined);

  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);

  const [openConfirmSetVersion, setOpenConfirmSetVersion] = useState(false);
  const setAppVersionMutation = useSetAppVersionMutation();
  const deleteAppVersionMutation = useDeleteAppVersionMutation();
  const { formatMessage } = useIntl();
  const handleClickDelete = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenConfirmRemove(true);
  };

  const handleClickPreview = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
  };

  const handleClickEdit = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenAddVersion(true);
  };

  const handleSetVersion = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
    setOpenConfirmSetVersion(true);
  };

  const handlePreviewVersion = ({ version }: { version: AppVersion }) => {
    setSelectedVersion(version);
  };

  const handleAppVersionRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'app version removed',
        id: 'app.version.removed',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionRemovedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on removing app version',
        id: 'error.removing.app.version',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionSet = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'app version set',
        id: 'app.version.set',
      }),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleAppVersionSetError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on set app version',
        id: 'error.set.app.version',
      }),
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      },
    );
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setTitleInfo('');
    setContentInfo('');
  };

  return (
    <>
      {openConfirmRemove && (
        <AppConfirmDialog
          DialogProps={{
            open: openConfirmRemove,
            onClose: () => {
              setOpenConfirmRemove(false);
            },
          }}
          onConfirm={() => {
            setOpenConfirmRemove(false);
            deleteAppVersionMutation.mutate(
              { siteId: site?.id, siteVersionId: selectedVersion?.id },
              {
                onSuccess: handleAppVersionRemoved,
                onError: handleAppVersionRemovedError,
              },
            );

            setSelectedVersion(undefined);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.app.version"
            defaultMessage="Do you really want to remove this app version {version}"
            values={{
              version: selectedVersion?.version,
            }}
          />
        </AppConfirmDialog>
      )}

      {openConfirmSetVersion && (
        <AppConfirmDialog
          DialogProps={{
            open: openConfirmSetVersion,
            onClose: () => {
              setOpenConfirmSetVersion(false);
            },
          }}
          onConfirm={() => {
            setOpenConfirmSetVersion(false);
            setAppVersionMutation.mutate(
              { siteId: site?.id, siteVersionId: selectedVersion?.id },
              {
                onSuccess: handleAppVersionSet,
                onError: handleAppVersionSetError,
              },
            );

            setSelectedVersion(undefined);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.set.to.this.app.version"
            defaultMessage="Do you really want to set this app to version {version}. Make sure you backup any changes to your backup."
            values={{
              version: selectedVersion?.version,
            }}
          />
        </AppConfirmDialog>
      )}
      <InfoDialog
        dialogProps={{
          open: openInfo,
          onClose: handleCloseInfo,
        }}
        title={titleInfo}
        content={contentInfo}
      />
      <AddAppVersionFormDialog
        dialogProps={{
          open: openAddVersion,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: () => {
            setOpenAddVersion(false);
          },
        }}
        version={selectedVersion?.version}
        description={selectedVersion?.description}
        versionId={selectedVersion?.id}
        siteId={site?.id}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="app.version" defaultMessage="App version" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="add.versions.to.your.app"
                defaultMessage="Add versions to your app"
              />
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              setOpenAddVersion(true);
            }}
          >
            <FormattedMessage
              id={'add.app.version'}
              defaultMessage={'Add app version'}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {versions ? (
            <AppVersions
              site={site}
              versions={versions}
              onClickDelete={handleClickDelete}
              onClickEdit={handleClickEdit}
              onClickSetVersion={handleSetVersion}
              onClickPreview={handlePreviewVersion}
            />
          ) : (
            <Stack
              spacing={1}
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
            >
              <WorkHistoryIcon sx={{ fontSize: '50px' }} />
              <Typography variant="h6">
                <FormattedMessage
                  id={'no.app.versions'}
                  defaultMessage={'No app versions'}
                />
              </Typography>
              <Typography variant="subtitle1">
                <FormattedMessage
                  id={'add.versions.to.your.app'}
                  defaultMessage={'Add versions to your app'}
                />
              </Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
