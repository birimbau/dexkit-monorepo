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

import {
  GET_APP_RANKINGS_QUERY,
  useAppRankingListQuery,
} from '@dexkit/ui/modules/wizard/hooks/ranking';
import Add from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
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
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  useAddAppRankingMutation,
  useDeleteAppRankingMutation,
} from '../../hooks';
import { AppRanking } from '../../types/ranking';
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
    <Box
      sx={{
        overflowWrap: 'break-word',
        whiteSpace: 'initial',
        width: '100%',
        py: 2,
      }}
    >
      {expanded ? value : value.slice(0, 20)}&nbsp;
      {value.length > 20 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit' }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </Box>
  );
}

function EmptyRankings() {
  return (
    <Stack
      py={2}
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <LeaderboardIcon fontSize="inherit" sx={{ fontSize: '3rem' }} />

      <Stack>
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
      </Stack>
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

  const { data, isLoading, refetch } = useAppRankingListQuery({
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

    if (sortModel.length > 0) {
      setQueryOptions((queryOptions: any) => ({
        ...queryOptions,
        sortField: sortModel[0].field,
        sort: sortModel[0].sort,
      }));
    } else {
      setQueryOptions((queryOptions: any) => {
        return {
          ...queryOptions,
        };
      });
    }
    refetch();
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
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
      flex: 1,
    },
    {
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <ExpandableCell {...params} />
      ),
    },
    {
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: ({ row }) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={async (e) => {
                e.stopPropagation();

                onClickPreview({ ranking: row });
                await refetch();
              }}
            >
              <Tooltip
                title={
                  <FormattedMessage id="preview" defaultMessage="Preview" />
                }
              >
                <VisibilityIcon />
              </Tooltip>
            </IconButton>

            <IconButton
              onClick={async (e) => {
                e.stopPropagation();
                onClickExport({ ranking: row });
                await refetch();
              }}
            >
              <Tooltip
                title={<FormattedMessage id="export" defaultMessage="Export" />}
              >
                <FileDownloadIcon />
              </Tooltip>
            </IconButton>

            <IconButton
              color={'error'}
              onClick={async (e) => {
                e.stopPropagation();
                onClickDelete({ ranking: row });
                await refetch();
              }}
            >
              <Tooltip
                title={
                  <FormattedMessage id={'delete'} defaultMessage={'Delete'} />
                }
              >
                <DeleteIcon />
              </Tooltip>
            </IconButton>
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
        rowHeight={100}
        key={data?.total}
        slots={{
          toolbar: GridToolbar,
          noRowsOverlay: EmptyRankings,
          noResultsOverlay: EmptyRankings,
        }}
        onRowClick={({ row }) => {
          onClickEdit({ ranking: row });
        }}
        rows={rows}
        columns={columns}
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        disableColumnFilter
        sortingMode="server"
        getRowHeight={() => 'auto'}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        hideFooterPagination={rowCountState === 0}
        onPaginationModelChange={setPaginationModel}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        onSortModelChange={handleSortModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        loading={isLoading}
        rowSelectionModel={rowSelection}
        disableRowSelectionOnClick
        onRowSelectionModelChange={(rows) => setRowSelection(rows)}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none !important',
          },
          border: 'none',
          '--DataGrid-overlayHeight': '150px', // disable cell selection style
          '.MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // pointer cursor on ALL rows
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
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
    console.log('ranking', ranking);

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

  const [saved, setSaved] = useState(false);

  const [showDiscard, setShowDiscard] = useState(false);

  const handleCloseEditRanking = () => {
    if (saved) {
      setSelectedEditRanking(undefined);
      setSaved(false);
      return;
    }

    return setShowDiscard(true);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const queryClient = useQueryClient();

  const mutationAddRanking = useAddAppRankingMutation();

  return (
    <>
      {showDiscard && (
        <AppConfirmDialog
          DialogProps={{
            open: showDiscard,
            maxWidth: 'xs',
            fullWidth: true,
            onClose: () => setShowDiscard(false),
          }}
          onConfirm={() => {
            setSelectedEditRanking(undefined);
            setShowDiscard(false);
          }}
          title={
            <FormattedMessage
              id="Leave.without.saving"
              defaultMessage="Leave Without Saving"
            />
          }
          actionCaption={<FormattedMessage id="leave" defaultMessage="Leave" />}
          cancelCaption={<FormattedMessage id="stay" defaultMessage="Stay" />}
        >
          <Stack spacing={1}>
            <Typography variant="body1">
              <FormattedMessage
                id="you.have.unsaved.changes."
                defaultMessage="You have unsaved changes."
              />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage
                id="are.you.sure.you.want.to.leave.without.saving"
                defaultMessage="Are you sure you want to leave without saving?"
              />
            </Typography>
          </Stack>
        </AppConfirmDialog>
      )}
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
          onConfirm={async () => {
            setOpenConfirmRemove(false);

            await deleteAppRankingMutation.mutateAsync(
              { siteId: siteId, rankingId: selectedRanking?.id },
              {
                onSuccess: handleAppRankingRemoved,
                onError: handleAppRankingRemovedError,
              },
            );

            await queryClient.removeQueries({
              queryKey: [GET_APP_RANKINGS_QUERY],
            });
            setSelectedRanking(undefined);
          }}
          title={
            <Typography variant="inherit" fontWeight="bold">
              <FormattedMessage
                id="delete.leaderboard.name"
                defaultMessage="Delete Leaderboard: {name}"
                values={{
                  name: (
                    <Typography
                      component="span"
                      fontWeight="300"
                      variant="inherit"
                    >
                      {selectedRanking?.title}
                    </Typography>
                  ),
                }}
              />
            </Typography>
          }
        >
          <FormattedMessage
            id="are.you.sure.you want.to.delete.this.leaderboard"
            defaultMessage="Are you sure you want to delete this leaderboard?"
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
                      key={selectedEditRanking.title}
                      title={selectedEditRanking.title}
                      onClose={handleCloseEditRanking}
                      onEditTitle={async (title: string) => {
                        setSelectedEditRanking({
                          ...selectedEditRanking,
                          title,
                        });

                        if (selectedEditRanking) {
                          console.log('hello', selectedEditRanking);
                          try {
                            await mutationAddRanking.mutateAsync({
                              ...selectedEditRanking,
                              title,
                              settings: selectedEditRanking.settings
                                ? selectedEditRanking.settings
                                : [],
                              description: selectedEditRanking.description,
                              from: selectedEditRanking.from,
                              to: selectedEditRanking.to,
                              rankingId: selectedEditRanking.id,
                              siteId,
                            });

                            enqueueSnackbar(
                              <FormattedMessage
                                id="title.updated"
                                defaultMessage="Title updated"
                              />,
                              { variant: 'success' },
                            );
                          } catch (err) {
                            enqueueSnackbar(String(err), { variant: 'error' });
                          }
                        }
                      }}
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
                        title={selectedEditRanking.title}
                        onSave={handleSave}
                        onChange={() => {
                          setSaved(false);
                        }}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <RankingMetadataForm
                        siteId={siteId}
                        rankingId={selectedEditRanking.id}
                        title={selectedEditRanking.title}
                        description={selectedEditRanking.description}
                        onSave={handleSave}
                      />
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
