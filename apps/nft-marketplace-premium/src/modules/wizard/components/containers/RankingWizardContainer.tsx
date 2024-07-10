import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { useCallback, useEffect, useState } from 'react';

import { useAppRankingListQuery } from '@dexkit/ui/modules/wizard/hooks/ranking';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import LeaderboardIcon from '@mui/icons-material/LeaderboardOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDeleteAppRankingMutation } from '../../hooks';
import { AppRanking } from '../../types/ranking';
import { ExportRanking } from '../ExportRanking';
import GamificationPointForm from '../forms/Gamification/GamificationPointForm';
import LeaderboardHeader from '../forms/Gamification/LeaderboardHeader';
import RankingMetadataForm from '../forms/Gamification/RankingMetadataForm';
const AddAppRankingFormDialog = dynamic(
  () => import('../dialogs/AddAppRankingFormDialog'),
);
const RankingDialog = dynamic(() => import('../dialogs/RankingDialog'));
const ExportRankingDialog = dynamic(
  () => import('../dialogs/ExportRankingDialog'),
);
export interface RankingWizardContainerProps {
  siteId?: number;
}

interface TableProps {
  siteId?: number | null;
  onClickDelete({ ranking }: { ranking: AppRanking }): void;
  onClickEdit({ ranking }: { ranking: AppRanking }): void;
  onClickPreview({ ranking }: { ranking: AppRanking }): void;
  onClickExport({ ranking }: { ranking: AppRanking }): void;
  rankings?: AppRanking[];
}

function ExpandableCell({ value }: GridRenderCellParams) {
  const [expanded, setExpanded] = useState(false);

  if (!value) {
    return <></>;
  }

  return (
    <div>
      {expanded ? value : value.slice(0, 100)}&nbsp;
      {value.length > 100 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

function EmptyRankings() {
  return (
    <Stack
      py={2}
      spacing={1}
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <LeaderboardIcon fontSize="large" />
      <Box>
        <Typography textAlign="center" variant="h5">
          <FormattedMessage
            id="no.leaderboard"
            defaultMessage="No leaderboard"
          />
        </Typography>
        <Typography textAlign="center" variant="body1" color="text.secondary">
          <FormattedMessage
            id="add.leaderboards.to.your.app"
            defaultMessage="Add leaderboards to your app"
          />
        </Typography>
      </Box>
    </Stack>
  );
}

function AppRankingList({
  siteId,
  onClickDelete,
  onClickEdit,
  onClickPreview,
  onClickExport,
}: TableProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useAppRankingListQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: siteId,
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
      field: 'title',
      headerName: 'Title',
      width: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 350,
      renderCell: (params: GridRenderCellParams) => (
        <ExpandableCell {...params} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip
              title={<FormattedMessage id="preview" defaultMessage="Preview" />}
            >
              <IconButton onClick={() => onClickPreview({ ranking: row })}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={<FormattedMessage id="edit" defaultMessage="Edit" />}
            >
              <IconButton onClick={() => onClickEdit({ ranking: row })}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={<FormattedMessage id="export" defaultMessage="Export" />}
            >
              <IconButton onClick={() => onClickExport({ ranking: row })}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={
                <FormattedMessage id={'delete'} defaultMessage={'Delete'} />
              }
            >
              <IconButton
                color={'error'}
                onClick={() => onClickDelete({ ranking: row })}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const rows = (data?.data as any) || [];

  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([]);

  return (
    <>
      <DataGrid
        autoHeight
        slots={{ toolbar: GridToolbar, noRowsOverlay: EmptyRankings }}
        rows={rows}
        columns={columns}
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        sortingMode="server"
        getRowHeight={() => 'auto'}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        loading={isLoading}
        rowSelectionModel={rowSelection}
        disableRowSelectionOnClick
        checkboxSelection
        onRowSelectionModelChange={(rows) => setRowSelection(rows)}
        sx={{ '--DataGrid-overlayHeight': '150px' }}
      />
    </>
  );
}

export default function RankingWizardContainer({
  siteId,
}: RankingWizardContainerProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
  const [openAddRanking, setOpenAddRanking] = useState(false);
  const [openExportRanking, setOpenExportRanking] = useState(false);
  const [openPreviewRanking, setOpenPreviewRanking] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState<
    AppRanking | undefined
  >(undefined);

  const [selectedEditRanking, setSelectedEditRanking] = useState<
    AppRanking | undefined
  >(undefined);

  const deleteAppRankingMutation = useDeleteAppRankingMutation();

  const handleClickDelete = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenConfirmRemove(true);
  };

  const handleClickEdit = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedEditRanking(ranking);
  };

  const handleClickExport = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenExportRanking(true);
  };

  const handlePreviewRanking = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
    setOpenPreviewRanking(true);
  };

  const handleAppRankingRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App leaderboard removed',
        id: 'app.leaderboard.removed',
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

  const handleAppRankingRemovedError = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'Error on removing app leaderboard',
        id: 'error.removing.app.leaderboard',
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

  const handleCloseEditRanking = () => {
    setSelectedEditRanking(undefined);
  };

  return (
    <>
      {openAddRanking && (
        <AddAppRankingFormDialog
          dialogProps={{
            open: openAddRanking,
            fullWidth: true,
            maxWidth: 'sm',
            onClose: () => {
              setOpenAddRanking(false);
            },
          }}
          title={selectedRanking?.title}
          description={selectedRanking?.description}
          rankingId={selectedRanking?.id}
          siteId={siteId}
        />
      )}
      {openPreviewRanking && (
        <RankingDialog
          dialogProps={{
            open: openPreviewRanking,
            fullWidth: true,
            maxWidth: 'md',
            onClose: () => {
              setOpenPreviewRanking(false);
            },
          }}
          rankingId={selectedRanking?.id}
        />
      )}

      {openExportRanking && (
        <ExportRankingDialog
          dialogProps={{
            open: openExportRanking,
            fullWidth: true,
            maxWidth: 'md',
            onClose: () => {
              setOpenExportRanking(false);
            },
          }}
          rankingId={selectedRanking?.id}
        />
      )}

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
            deleteAppRankingMutation.mutate(
              { siteId: siteId, rankingId: selectedRanking?.id },
              {
                onSuccess: handleAppRankingRemoved,
                onError: handleAppRankingRemovedError,
              },
            );

            setSelectedRanking(undefined);
          }}
        >
          <FormattedMessage
            id="do.you.really.want.to.remove.this.app.leaderboard"
            defaultMessage="Do you really want to remove this app leaderboard {title}"
            values={{
              title: selectedRanking?.title,
            }}
          />
        </AppConfirmDialog>
      )}

      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack>
              <Typography variant={'h6'}>
                <FormattedMessage
                  id="leaderboard"
                  defaultMessage="Leaderboard"
                />
              </Typography>
              <Typography variant={'body2'}>
                <FormattedMessage
                  id="create.leaderboards.and.gamify.your.app"
                  defaultMessage="Create leaderboards from your events and gamify your app"
                />
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          {!selectedEditRanking && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenAddRanking(true);
                }}
                startIcon={<Add />}
              >
                <FormattedMessage
                  id="new.leaderboard"
                  defaultMessage="New leaderboard"
                />
              </Button>
            </Grid>
          )}
          {!selectedEditRanking && (
            <Grid item xs={12}>
              <AppRankingList
                siteId={siteId}
                onClickDelete={handleClickDelete}
                onClickEdit={handleClickEdit}
                onClickPreview={handlePreviewRanking}
                onClickExport={handleClickExport}
              />
            </Grid>
          )}
          {selectedEditRanking && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div>
                    <LeaderboardHeader
                      title={selectedEditRanking.title}
                      onClose={handleCloseEditRanking}
                      onEditTitle={() => {}}
                      onPreview={() => {
                        if (selectedEditRanking) {
                          handlePreviewRanking({
                            ranking: selectedEditRanking,
                          });
                        }
                      }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab
                          label={
                            <FormattedMessage
                              id={'rules'}
                              defaultMessage={'Rules'}
                            />
                          }
                          value="1"
                        />
                        <Tab
                          label={
                            <FormattedMessage
                              id={'metadata'}
                              defaultMessage={'Metadata'}
                            />
                          }
                          value="2"
                        />
                        <Tab
                          label={
                            <FormattedMessage
                              id={'export'}
                              defaultMessage={'Export'}
                            />
                          }
                          value="3"
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <GamificationPointForm
                        settings={selectedEditRanking.settings}
                        siteId={siteId}
                        from={selectedEditRanking.from}
                        to={selectedEditRanking.to}
                        rankingId={selectedEditRanking.id}
                        ranking={selectedEditRanking}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <RankingMetadataForm
                        siteId={siteId}
                        rankingId={selectedEditRanking.id}
                        title={selectedEditRanking.title}
                        description={selectedEditRanking.description}
                      />
                    </TabPanel>
                    <TabPanel value="3">
                      <ExportRanking rankingId={selectedEditRanking.id} />
                    </TabPanel>
                  </TabContext>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
