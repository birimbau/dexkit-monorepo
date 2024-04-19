import {
  NETWORKS,
  NETWORK_EXPLORER,
  NETWORK_NAME,
} from '@dexkit/core/constants/networks';
import {
  beautifyCamelCase,
  ipfsUriToUrl,
  parseChainId,
  truncateAddress,
  truncateHash,
} from '@dexkit/core/utils';
import Link from '@dexkit/ui/components/AppLink';
import {
  CountFilter,
  UserEvent,
  useUserEventsList,
} from '@dexkit/ui/hooks/userEvents';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridToolbar } from '@mui/x-data-grid/components';

import { UserOnChainEvents } from '@dexkit/core/constants/userEvents';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { useActiveChainIds } from '@dexkit/ui';
import { USER_EVENT_NAMES } from '@dexkit/ui/constants/userEventNames';
import {
  Avatar,
  Button,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField as MuiTextField,
} from '@mui/material';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid/models';

import { GridColDef } from '@mui/x-data-grid';

import { DateTimePicker } from '@mui/x-date-pickers';
import { isAddress } from 'ethers/lib/utils';
import { Field, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';
import moment, { Moment } from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import useColumns from '../../hooks/useColumns';
import CountEventsCard from './CountEventsCard';
import UserEventsTable from './UserEventsTable';
import EventDetailDialog from './dialogs/EventDetailDialog';

export interface OnChainDataGridProps {
  siteId?: number;
  filters?: CountFilter;
  onViewDetails: (event: UserEvent) => void;
}

function OnChainDataGrid({
  siteId,
  onViewDetails,
  filters,
}: OnChainDataGridProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: {
        not: null,
      },
      createdAt: { gte: filters?.start, lte: filters?.end },
      referral: filters?.referral ? filters.referral : undefined,
      from: filters?.from ? filters.from : undefined,
      chainId:
        filters?.chainId && filters?.chainId > 0 ? filters?.chainId : undefined,
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
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

  const { formatMessage } = useIntl();

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      minWidth: 200,
      valueGetter: ({ row }) => {
        return new Date(row.createdAt).toLocaleString();
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'chainId',
      headerName: 'Network',
      minWidth: 110,
      valueGetter: ({ row }) => {
        return NETWORK_NAME(row.chainId);
      },
    },
    {
      field: 'hash',
      headerName: 'TX',
      minWidth: 160,
      renderCell: (params: any) =>
        params.row.hash ? (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/tx/${
              params.row.hash
            }`}
          >
            {truncateHash(params.row.hash)}
          </Link>
        ) : null,
    },
    {
      field: 'referral',
      headerName: formatMessage({ id: 'referral', defaultMessage: 'Referral' }),
      minWidth: 200,
      renderCell: (params: any) => {
        return (
          <Link
            target="_blank"
            href={`${NETWORK_EXPLORER(params.row.chainId)}/address/${
              params.row.referral
            }`}
          >
            {truncateAddress(params.row.referral)}
          </Link>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: (params: any) => (
        <Button onClick={() => onViewDetails(params.row)}>
          <FormattedMessage id="details" defaultMessage="Details" />
        </Button>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
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

function OffChainDataGrid({ siteId }: Props) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      hash: null,
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
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
      field: 'type',
      headerName: 'Type',
      width: 150,
      valueGetter: ({ row }) => {
        return beautifyCamelCase(row.type);
      },
    },
    {
      field: 'referral',
      headerName: 'Referral',
      width: 200,
    },
  ];

  return (
    <DataGrid
      autoHeight
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

const addressSchema = z.string().refine((arg) => {
  return isAddress(arg);
}, 'invalid address');

const dateSchema = z.string().datetime({ offset: true });

const FilterSchema = z.object({
  siteId: z.number(),
  chainId: z.number().optional(),
  from: addressSchema.optional(),
  referral: addressSchema.optional(),
  start: dateSchema,
  end: dateSchema,
  type: z.string().optional(),
});

interface Props {
  siteId?: number;
}

export default function UserEventAnalyticsContainer({ siteId }: Props) {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [event, setEvent] = useState<UserEvent>();

  const handleClose = () => {
    setShowDetails(false);
    setEvent(undefined);
  };

  const handleViewDetails = (event: UserEvent) => {
    setShowDetails(true);
    setEvent(event);
  };

  const DEFAULT_VALUES = useMemo(
    () => ({
      siteId,
      start: moment().subtract(30, 'days').format(),
      end: moment().format(),
      type: '',
      chainId: 0,
      referral: undefined,
    }),
    [siteId],
  );

  const [filters, setFilters] = useState<CountFilter>(DEFAULT_VALUES);

  const columns = useColumns(filters.type);

  const handleSubmitFilters = async (values: CountFilter) => {
    setFilters(values);
  };

  const { activeChainIds } = useActiveChainIds();

  return (
    <>
      <EventDetailDialog
        DialogProps={{
          open: showDetails,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        event={event}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="events" defaultMessage="Events" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="view.user.interaction.data.within.your.dApp.to.gain.insights"
                defaultMessage="View user interaction data within your DApp to gain insights"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <FormattedMessage
              id={'add.ref.to.track.referrals'}
              defaultMessage={
                'Append ref to your url to track referrals on your events. Ex: yourSite.com?ref=your-referral'
              }
            />
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="events types">
                  <Tab
                    label={
                      <FormattedMessage
                        id={'onchain.events'}
                        defaultMessage={'Onchain events'}
                      />
                    }
                    value="1"
                  />
                  <Tab
                    label={
                      <FormattedMessage
                        id={'offchain.events'}
                        defaultMessage={'Offchain events'}
                      />
                    }
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {filters.type === '' && (
                        <>
                          <Grid item xs={12} sm={3}>
                            <DexkitApiProvider.Provider
                              value={{ instance: myAppsApi }}
                            >
                              <CountEventsCard filters={filters} />
                            </DexkitApiProvider.Provider>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12}>
                        <Box>
                          <Formik
                            initialValues={DEFAULT_VALUES}
                            onSubmit={handleSubmitFilters}
                            validationSchema={toFormikValidationSchema(
                              FilterSchema,
                            )}
                          >
                            {({
                              values,
                              submitForm,
                              isValid,
                              isSubmitting,
                              setFieldValue,
                              setValues,
                              errors,
                              resetForm,
                            }) => (
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <FormControl fullWidth>
                                    <Field
                                      fullWidth
                                      component={Select}
                                      name="type"
                                      displayEmpty
                                      notched
                                      inputLabel={{ shrink: true }}
                                      label={
                                        <FormattedMessage
                                          id="event.type"
                                          defaultMessage="Event Type"
                                        />
                                      }
                                    >
                                      <MenuItem value="">
                                        <FormattedMessage
                                          id="all"
                                          defaultMessage="All"
                                        />
                                      </MenuItem>
                                      {Object.keys(USER_EVENT_NAMES).map(
                                        (key) => (
                                          <MenuItem key={key} value={key}>
                                            <FormattedMessage
                                              id={USER_EVENT_NAMES[key].id}
                                              defaultMessage={
                                                USER_EVENT_NAMES[key]
                                                  .defaultMessage
                                              }
                                            />
                                          </MenuItem>
                                        ),
                                      )}
                                    </Field>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <DateTimePicker
                                    label={
                                      <FormattedMessage
                                        id="start"
                                        defaultMessage="Start"
                                      />
                                    }
                                    value={moment(values.start)}
                                    onChange={(value: Moment | null) => {
                                      if (value) {
                                        setFieldValue('start', value?.format());
                                      }
                                    }}
                                    renderInput={(props) => (
                                      <MuiTextField {...props} fullWidth />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <DateTimePicker
                                    label={
                                      <FormattedMessage
                                        id="end"
                                        defaultMessage="End"
                                      />
                                    }
                                    value={moment(values.end)}
                                    onChange={(value: Moment | null) => {
                                      if (value) {
                                        setFieldValue('end', value?.format());
                                      }
                                    }}
                                    renderInput={(props) => (
                                      <MuiTextField {...props} fullWidth />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <FormControl fullWidth>
                                    <Field
                                      component={Select}
                                      type="number"
                                      name="chainId"
                                      label={
                                        <FormattedMessage
                                          id="network"
                                          defaultMessage="Network"
                                        />
                                      }
                                      renderValue={(value: number) => {
                                        const key = parseChainId(value);

                                        if (key === 0) {
                                          return (
                                            <Typography>
                                              <FormattedMessage
                                                id="all"
                                                defaultMessage="All"
                                              />
                                            </Typography>
                                          );
                                        }

                                        return (
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            alignContent="center"
                                            spacing={1}
                                          >
                                            <Avatar
                                              src={ipfsUriToUrl(
                                                NETWORKS[key]?.imageUrl || '',
                                              )}
                                              style={{
                                                width: '1rem',
                                                height: '1rem',
                                              }}
                                            />
                                            <Typography variant="body1">
                                              {NETWORKS[key].name}
                                            </Typography>
                                          </Stack>
                                        );
                                      }}
                                      fullWidth
                                    >
                                      <MenuItem value={0}>
                                        <ListItemText
                                          primary={
                                            <FormattedMessage
                                              id="all"
                                              defaultMessage="All"
                                            />
                                          }
                                        />
                                      </MenuItem>
                                      {Object.keys(NETWORKS)
                                        .filter((n) =>
                                          activeChainIds.includes(Number(n)),
                                        )
                                        .map((key) => (
                                          <MenuItem
                                            key={key}
                                            value={parseChainId(key)}
                                          >
                                            <ListItemIcon>
                                              <Avatar
                                                sx={{
                                                  height: '1rem',
                                                  width: '1rem',
                                                }}
                                                src={
                                                  NETWORKS[parseChainId(key)]
                                                    .imageUrl
                                                }
                                              />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={
                                                NETWORKS[parseChainId(key)].name
                                              }
                                            />
                                          </MenuItem>
                                        ))}
                                    </Field>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    component={TextField}
                                    name="referral"
                                    label={
                                      <FormattedMessage
                                        id="referral"
                                        defaultMessage="Referral"
                                      />
                                    }
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Field
                                    component={TextField}
                                    name="from"
                                    label={
                                      <FormattedMessage
                                        id="from"
                                        defaultMessage="From"
                                      />
                                    }
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Box>
                                    <Stack
                                      spacing={2}
                                      alignItems="center"
                                      direction="row"
                                    >
                                      <Button
                                        onClick={submitForm}
                                        disabled={!isValid || isSubmitting}
                                        variant="contained"
                                      >
                                        <FormattedMessage
                                          id="filter"
                                          defaultMessage="Filter"
                                        />
                                      </Button>
                                      <Button
                                        onClick={() => resetForm()}
                                        disabled={!isValid || isSubmitting}
                                        variant="outlined"
                                      >
                                        <FormattedMessage
                                          id="reset.filters"
                                          defaultMessage="Reset filters"
                                        />
                                      </Button>
                                    </Stack>
                                  </Box>
                                </Grid>
                              </Grid>
                            )}
                          </Formik>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {filters.type === '' ? (
                      <OnChainDataGrid
                        siteId={siteId}
                        filters={filters}
                        key={JSON.stringify(filters)}
                        onViewDetails={handleViewDetails}
                      />
                    ) : (
                      <UserEventsTable
                        key={JSON.stringify(filters)}
                        filters={filters}
                        type={filters.type as UserOnChainEvents}
                        columns={columns}
                        siteId={siteId}
                      />
                    )}
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <OffChainDataGrid siteId={siteId} />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
