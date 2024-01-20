import {
  Alert,
  AlertTitle,
  Autocomplete as AutocompleteMUI,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Divider,
  Fab,
  FormControl,
  Stack,
  TextField as TextFieldMUI,
  Typography,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, LinearProgress } from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';

import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import { GamificationPoint } from '../../../types';
import CollectionFilterForm from './Filters/CollectionFilterForm';
import DropCollectionFilterForm from './Filters/DropCollectionFilter';
import SwapFilterForm from './Filters/SwapFilterForm';

const userEvents = [
  {
    name: beautifyCamelCase(UserEvents.loginSignMessage),
    value: UserEvents.loginSignMessage,
  },
  {
    name: beautifyCamelCase(UserEvents.swap),
    value: UserEvents.swap,
  },
  {
    value: UserEvents.nftAcceptListERC721,
    name: 'Accept listing ERC721',
  },
  {
    value: UserEvents.nftAcceptListERC1155,
    name: 'Accept listing ERC1155',
  },
  {
    value: UserEvents.nftAcceptOfferERC721,
    name: 'Accept offer ERC721',
  },
  {
    value: UserEvents.nftAcceptOfferERC1155,
    name: 'Accept offer ERC1155',
  },
  {
    value: UserEvents.buyDropCollection,
    name: 'Buy drop collection',
  },
  {
    value: UserEvents.buyDropEdition,
    name: 'Buy drop edition',
  },
];

const options = userEvents.map((op) => op.value);

const GamificationPointSchema = Yup.array(
  Yup.object().shape({
    userEventtype: Yup.string().required(),
    points: Yup.number().required(),
    filter: Yup.string(),
  }),
);

const RankingPointsScheme = Yup.object().shape({
  settings: GamificationPointSchema,
});

interface Props {
  onCancel?: () => void;
  onSubmit?: (settings: GamificationPoint[]) => void;
  settings?: GamificationPoint[];
}

export default function GamificationPointForm({
  onCancel,
  onSubmit,
  settings,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Formik
        onSubmit={(values) => {
          if (values && onSubmit) {
            onSubmit(values.settings);
          }
        }}
        initialValues={{
          settings:
            settings ||
            ([{ userEventType: UserEvents.swap }] as GamificationPoint[]),
        }}
        validationSchema={RankingPointsScheme}
      >
        {({
          submitForm,
          isSubmitting,
          isValid,
          values,
          setFieldValue,
          errors,
          resetForm,
          touched,
        }) => (
          <Form>
            <Alert severity="info">
              <AlertTitle>
                <FormattedMessage
                  id="info.alert.title.filter.ranking.points"
                  defaultMessage="Define and attribute points to each user event to build a ranking"
                />
              </AlertTitle>
            </Alert>
            {false && (
              <Box sx={{ p: 2 }}>
                <Button variant="contained" onClick={() => setOpen(true)}>
                  <FormattedMessage
                    id={'preview'}
                    defaultMessage={'Preview'}
                  ></FormattedMessage>
                </Button>
              </Box>
            )}

            <FieldArray
              name="settings"
              render={(arrayHelpers) => (
                <Box sx={{ p: 2 }}>
                  {values.settings.map((condition, index) => (
                    <Box sx={{ p: 2 }} key={index}>
                      <Grid container spacing={2} key={index}>
                        {index !== 0 && (
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Stack
                            direction="row"
                            justifyContent={'space-between'}
                            alignItems="center"
                          >
                            <Typography align="left">
                              <b>
                                <FormattedMessage
                                  id="rule.index.value"
                                  defaultMessage="Rule {index}"
                                  values={{
                                    index: index + 1,
                                  }}
                                />
                              </b>
                            </Typography>
                            <Fab
                              variant="extended"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <DeleteIcon />
                            </Fab>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth variant="filled">
                            <AutocompleteMUI
                              value={userEvents.find(
                                (u) =>
                                  u.value ===
                                  values.settings[index]?.userEventType,
                              )}
                              options={userEvents}
                              onChange={(e: any, value: any) =>
                                setFieldValue(
                                  `settings[${index}].userEventType`,
                                  value?.value,
                                )
                              }
                              isOptionEqualToValue={(
                                option: any,
                                value: any,
                              ) => {
                                return option.value === value;
                              }}
                              getOptionLabel={(option: {
                                name: string;
                                value: string;
                              }) => option.name}
                              style={{ width: 350 }}
                              renderInput={(
                                params: AutocompleteRenderInputParams,
                              ) => (
                                <TextFieldMUI
                                  {...params}
                                  // We have to manually set the corresponding fields on the input component

                                  //@ts-ignore
                                  error={
                                    //@ts-ignore
                                    touched[
                                      `settings[${index}].userEventType`
                                    ] &&
                                    //@ts-ignore
                                    !!errors[`settings[${index}].userEventType`]
                                  }
                                  helperText={
                                    //@ts-ignore
                                    errors[`settings[${index}].userEventType`]
                                  }
                                  label={
                                    <FormattedMessage
                                      id="user.event"
                                      defaultMessage="User Event"
                                    />
                                  }
                                  variant="outlined"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            component={TextField}
                            type={'number'}
                            sx={{ maxWidth: '350px' }}
                            name={`conditions[${index}].points`}
                            label={
                              <FormattedMessage
                                id="points"
                                defaultMessage="Points"
                              />
                            }
                            fullWidth
                          />
                        </Grid>

                        {values.settings[index]?.userEventType ===
                          UserEvents.swap && (
                          <Grid item xs={12}>
                            <Accordion sx={{ maxWidth: '350px' }}>
                              <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="filter"
                                    defaultMessage="Filter"
                                  />
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <SwapFilterForm
                                  item={
                                    values?.settings[index]?.filter
                                      ? JSON.parse(
                                          values?.settings[index]
                                            ?.filter as string,
                                        )
                                      : undefined
                                  }
                                  onChange={(item) =>
                                    setFieldValue(
                                      `settings[${index}].filter`,
                                      item ? JSON.stringify(item) : undefined,
                                    )
                                  }
                                />
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        )}

                        {(values.settings[index]?.userEventType ===
                          UserEvents.nftAcceptListERC721 ||
                          values.settings[index]?.userEventType ===
                            UserEvents.nftAcceptOfferERC721 ||
                          values.settings[index]?.userEventType ===
                            UserEvents.nftAcceptOfferERC1155 ||
                          values.settings[index]?.userEventType ===
                            UserEvents.nftAcceptListERC1155) && (
                          <Grid item xs={12}>
                            <Accordion sx={{ maxWidth: '350px' }}>
                              <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="filter"
                                    defaultMessage="Filter"
                                  />
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <CollectionFilterForm
                                  item={
                                    values?.settings[index]?.filter
                                      ? JSON.parse(
                                          values?.settings[index]
                                            ?.filter as string,
                                        )
                                      : undefined
                                  }
                                  onChange={(item) =>
                                    setFieldValue(
                                      `settings[${index}].filter`,
                                      item ? JSON.stringify(item) : undefined,
                                    )
                                  }
                                  isERC1155={
                                    values.settings[index]?.userEventType ===
                                      UserEvents.nftAcceptOfferERC1155 ||
                                    values.settings[index]?.userEventType ===
                                      UserEvents.nftAcceptListERC1155
                                  }
                                />
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        )}
                        {(values.settings[index]?.userEventType ===
                          UserEvents.buyDropCollection ||
                          values.settings[index]?.userEventType ===
                            UserEvents.buyDropEdition) && (
                          <Grid item xs={12}>
                            <Accordion sx={{ maxWidth: '350px' }}>
                              <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                              >
                                <Typography>
                                  <FormattedMessage
                                    id="filter"
                                    defaultMessage="Filter"
                                  />
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <DropCollectionFilterForm
                                  item={
                                    values?.settings[index]?.filter
                                      ? JSON.parse(
                                          values?.settings[index]
                                            ?.filter as string,
                                        )
                                      : undefined
                                  }
                                  onChange={(item) =>
                                    setFieldValue(
                                      `settings[${index}].filter`,
                                      item ? JSON.stringify(item) : undefined,
                                    )
                                  }
                                  isERC1155={
                                    values.settings[index]?.userEventType ===
                                    UserEvents.buyDropEdition
                                  }
                                />
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}

                  <Box
                    sx={{ p: 2 }}
                    display={'flex'}
                    justifyContent={'flex-end'}
                  >
                    <Button
                      variant="contained"
                      onClick={() => arrayHelpers.push({})}
                    >
                      <FormattedMessage
                        id="add.rule"
                        defaultMessage="Add rule"
                      />
                    </Button>
                  </Box>
                </Box>
              )}
            />

            {isSubmitting && <LinearProgress />}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                disabled={!isValid || isSubmitting}
                variant="contained"
                onClick={submitForm}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button onClick={() => resetForm()}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}
