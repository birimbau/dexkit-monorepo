import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FastField, Field, FormikConsumer } from 'formik';
import { Checkbox, Switch, TextField } from 'formik-mui';
import { memo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface Props {
  func: AbiFragment;
}

function ContractFormAccordion({ func }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion expanded={expanded}>
      <Stack
        sx={{ p: 1 }}
        direction="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={1}
        >
          <Field
            component={Checkbox}
            type="checkbox"
            name={`fields.${func.name}.visible`}
          />

          <Typography sx={{ fontWeight: 600 }}>{func.name}</Typography>
        </Stack>
        <IconButton onClick={() => setExpanded((value) => !value)}>
          <ExpandMoreIcon />
        </IconButton>
      </Stack>
      <Divider />
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FastField
              component={TextField}
              name={`fields.${func.name}.name`}
              label={
                <FormattedMessage
                  id="function.name"
                  defaultMessage="Function name"
                />
              }
              fullWidth
              size="small"
            />
          </Grid>
          <FormikConsumer>
            {({ values }) =>
              !(values as ContractFormParams).fields[func.name].callOnMount ? (
                <Grid item xs={12}>
                  <FastField
                    component={TextField}
                    name={`fields.${func.name}.callToAction`}
                    label={
                      <FormattedMessage
                        id="call.label"
                        defaultMessage="Call label"
                      />
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
              ) : null
            }
          </FormikConsumer>

          {func.inputs.length > 0 && (
            <Grid item>
              <FormControlLabel
                control={
                  <FastField
                    component={Switch}
                    type="checkbox"
                    name={`fields.${func.name}.lockInputs`}
                  />
                }
                label={
                  <FormattedMessage
                    id="lock.inputs"
                    defaultMessage="Lock inputs"
                  />
                }
              />
            </Grid>
          )}

          {func.stateMutability === 'view' && (
            <Grid item>
              <FormControlLabel
                control={
                  <FastField
                    component={Switch}
                    type="checkbox"
                    name={`fields.${func.name}.callOnMount`}
                  />
                }
                label={
                  <FormattedMessage
                    id="call.on.view"
                    defaultMessage="Call on view"
                  />
                }
              />
            </Grid>
          )}

          {func.inputs.length > 0 && (
            <Grid item>
              <FormControlLabel
                control={
                  <FastField
                    component={Switch}
                    type="checkbox"
                    name={`fields.${func.name}.hideInputs`}
                  />
                }
                label={
                  <FormattedMessage
                    id="hide.inputs"
                    defaultMessage="Hide inputs"
                  />
                }
              />
            </Grid>
          )}

          <FormikConsumer>
            {({ values }) =>
              !(values as ContractFormParams).fields[func.name].callOnMount ? (
                <Grid item>
                  <FormControlLabel
                    control={
                      <FastField
                        component={Switch}
                        type="checkbox"
                        name={`fields.${func.name}.collapse`}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="collapse"
                        defaultMessage="Collapse"
                      />
                    }
                  />
                </Grid>
              ) : undefined
            }
          </FormikConsumer>

          {func.inputs.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    <FormattedMessage id="inputs" defaultMessage="Inputs" />
                  </Typography>
                </Grid>
                {func.inputs.map((input, index) => (
                  <Grid item xs={12} key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <FastField
                          component={TextField}
                          name={`fields.${func.name}.input.${input.name}.label`}
                          label={
                            <FormattedMessage
                              id="label"
                              defaultMessage="Label"
                            />
                          }
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <FastField
                          component={TextField}
                          name={`fields.${func.name}.input.${input.name}.defaultValue`}
                          label={
                            <FormattedMessage
                              id="default.value"
                              defaultMessage="Default value"
                            />
                          }
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(ContractFormAccordion);
