import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  useAppRankingListQuery,
  useDeleteAppRankingMutation,
} from '../../hooks';
import { GamificationPoint } from '../../types';
import AddAppRankingFormDialog from '../dialogs/AddAppRankingFormDialog';
import GamificationPointForm from '../forms/Gamification/GamificationPointForm';
import RankingMetadataForm from '../forms/Gamification/RankingMetadataForm';
import RankingSection from '../sections/RankingSection';
export interface RankingWizardContainerProps {
  siteId?: number;
}

interface AppRanking {
  id: number;
  title: string;
  createdAt: number;
  description: string;
  settings: GamificationPoint[];
}

interface TableProps {
  siteId?: number | null;
  onClickDelete({ ranking }: { ranking: AppRanking }): void;
  onClickEdit({ ranking }: { ranking: AppRanking }): void;
  onClickPreview({ ranking }: { ranking: AppRanking }): void;
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
      spacing={1}
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}
    >
      <LeaderboardIcon sx={{ fontSize: '50px' }} />
      <Typography variant="h6">
        <FormattedMessage
          id={'no.app.rankings'}
          defaultMessage={'No app rankings'}
        />
      </Typography>
      <Typography variant="subtitle1">
        <FormattedMessage
          id={'add.rankings.to.your.app'}
          defaultMessage={'Add rankings to your app'}
        />
      </Typography>
    </Stack>
  );
}

function AppRankingList({
  siteId,
  onClickDelete,
  onClickEdit,
  onClickPreview,
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
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
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
          <Stack direction={'row'} spacing={1}>
            <Tooltip
              title={
                <FormattedMessage
                  id={'preview.app.ranking'}
                  defaultMessage={'Preview app ranking'}
                />
              }
            >
              <IconButton onClick={() => onClickPreview({ ranking: row })}>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'edit.ranking'}
                  defaultMessage={'Edit ranking'}
                />
              }
            >
              <IconButton onClick={() => onClickEdit({ ranking: row })}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <FormattedMessage
                  id={'delete.app.ranking'}
                  defaultMessage={'Delete app ranking'}
                />
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
        disableRowSelectionOnClick
        loading={isLoading}
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

  const handleClickPreview = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
  };

  const handleClickEdit = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedEditRanking(ranking);
  };

  const handlePreviewRanking = ({ ranking }: { ranking: AppRanking }) => {
    setSelectedRanking(ranking);
  };

  const handleAppRankingRemoved = () => {
    enqueueSnackbar(
      formatMessage({
        defaultMessage: 'App ranking removed',
        id: 'app.ranking.removed',
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
        defaultMessage: 'Error on removing app ranking',
        id: 'error.removing.app.ranking',
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
            id="do.you.really.want.to.remove.this.app.ranking"
            defaultMessage="Do you really want to remove this app ranking {title}"
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
                <FormattedMessage id="rankings" defaultMessage="Rankings" />
              </Typography>
              <Typography variant={'body2'}>
                <FormattedMessage
                  id="create.rankings.and.gamify.your.app"
                  defaultMessage="Create rankings from your events and gamify your app"
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
              >
                <FormattedMessage
                  id={'add.ranking'}
                  defaultMessage={'Add ranking'}
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
              />
            </Grid>
          )}
          {selectedEditRanking && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setSelectedEditRanking(undefined)}
                  >
                    <FormattedMessage
                      id={'back.to.ranking.list'}
                      defaultMessage={'Back to Ranking List'}
                    />{' '}
                  </Button>
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
                      {' '}
                      <GamificationPointForm
                        settings={selectedEditRanking.settings}
                        siteId={siteId}
                        rankingId={selectedEditRanking.id}
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
                  </TabContext>
                </Grid>

                <Grid item xs={12}>
                  <RankingSection
                    section={{
                      type: 'ranking',
                      settings: { rankingId: selectedEditRanking.id },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
