import {
  Alert,
  AlertTitle,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  Stack,
  TextField as TextFieldMUI,
  Typography,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

import { Grid, LinearProgress } from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Autocomplete, TextField } from 'formik-mui';

import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

import { UserEvents } from '@dexkit/core/constants/userEvents';
import { beautifyCamelCase } from '@dexkit/core/utils';
import { GamificationPoint } from '../../../types';

const userEvents = [
  {
    name: beautifyCamelCase(UserEvents.loginSignMessage),
    value: UserEvents.loginSignMessage,
  },
];

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
          settings: settings || ([{}] as GamificationPoint[]),
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
            <Box sx={{ p: 2 }}>
              <Button variant="contained" onClick={() => setOpen(true)}>
                <FormattedMessage
                  id={'preview'}
                  defaultMessage={'Preview'}
                ></FormattedMessage>
              </Button>
            </Box>

            <FieldArray
              name="settings"
              render={(arrayHelpers) => (
                <Box sx={{ p: 2 }}>
                  {values.settings.map((condition, index) => (
                    <Box sx={{ p: 2 }} key={index}>
                      <Grid container spacing={4} key={index}>
                        {index !== 0 && (
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        )}
                        {index !== 0 && (
                          <Grid item xs={12}>
                            <FormControl fullWidth variant="filled">
                              <InputLabel shrink>
                                <FormattedMessage
                                  id="user.event"
                                  defaultMessage="User Event"
                                />
                              </InputLabel>
                              <Field
                                name={`settings[${index}].userEventType`}
                                component={Autocomplete}
                                options={userEvents}
                                getOptionLabel={(option: {
                                  name: string;
                                  value: string;
                                }) => option.name}
                                style={{ width: 300 }}
                                renderInput={(
                                  params: AutocompleteRenderInputParams,
                                ) => (
                                  <TextFieldMUI
                                    {...params}
                                    // We have to manually set the corresponding fields on the input component
                                    name={`settings[${index}].userEventType`}
                                    //@ts-ignore
                                    error={
                                      //@ts-ignore
                                      touched[
                                        `settings[${index}].userEventType`
                                      ] &&
                                      //@ts-ignore
                                      !!errors[
                                        `settings[${index}].userEventType`
                                      ]
                                    }
                                    helperText={
                                      //@ts-ignore
                                      errors[`settings[${index}].userEventType`]
                                    }
                                    label="Autocomplete"
                                    variant="outlined"
                                  />
                                )}
                              />
                              ;
                            </FormControl>
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
                                  id="condition.index.value"
                                  defaultMessage="Condition {index}"
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
                          <Field
                            component={TextField}
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
                        id="add.condition"
                        defaultMessage="Add condition"
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
              <Button onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}
