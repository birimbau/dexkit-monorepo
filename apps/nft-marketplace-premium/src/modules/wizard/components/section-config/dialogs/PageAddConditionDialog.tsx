import { Token } from '@dexkit/core/types';
import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { AppDialogTitle, getAssetProtocol, useAllTokenList } from '@dexkit/ui';
import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field, FieldArray, Formik, getIn } from 'formik';
import { Select, TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { CollectionItemAutocomplete } from '../../forms/CollectionItemAutocomplete';
import { SearchTokenAutocomplete } from '../../forms/SearchTokenAutocomplete';

const GatedCoditionsSchema = Yup.array(
  Yup.object().shape({
    type: Yup.string().required(),
    condition: Yup.string(),
    address: Yup.string().required(),
    chainId: Yup.number(),
    decimals: Yup.number(),
    protocol: Yup.string(),
    tokenId: Yup.string(),
    amount: Yup.string().required(),
  }),
);

const GatedPageScheme = Yup.object().shape({
  layout: Yup.object().shape({
    frontImage: Yup.string(),
    accessRequirementsMessage: Yup.string(),
    fronImageHeight: Yup.number(),
    fronImageWidth: Yup.number(),
  }),
  conditions: GatedCoditionsSchema,
});

export interface PageAddConditionDialogProps {
  DialogProps: DialogProps;
  conditions: GatedCondition[];
  onSaveGatedConditions: (conditions: GatedCondition[]) => void;
}

function getValueFrom(values: any, index: number) {
  let value = getIn(values, `conditions[${index}]`);
  if (value) {
    let val = {
      chainId: value.chainId,
      backgroundImageUrl: value.backgroundImageUrl,
      contractAddress: value.address,
    };

    return val;
  }

  return undefined;
}

export default function PageAddConditionDialog({
  DialogProps,
  conditions,
  onSaveGatedConditions,
}: PageAddConditionDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSubmit = async (values: { conditions: GatedCondition[] }) => {
    onSaveGatedConditions(values.conditions);

    handleClose();
  };

  const featuredTokens = useAllTokenList({
    includeNative: true,
    isWizardConfig: true,
  });

  const [selectedCoins, setSelectedCoins] = useState<{ [key: number]: Token }>(
    {},
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        conditions:
          conditions ||
          ([
            {
              type: 'collection',
              amount: '1',
            },
          ] as GatedCondition[]),
      }}
      validationSchema={GatedPageScheme}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        values,
        setFieldValue,
        errors,
      }) => (
        <Dialog {...DialogProps}>
          <AppDialogTitle
            onClose={handleClose}
            title={
              <FormattedMessage
                id="add.gated.condition"
                defaultMessage="Add gated condition"
              />
            }
            titleBox={{ px: 3, py: 1 }}
          />
          <DialogContent sx={{ px: 4 }} dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FieldArray
                  name="conditions"
                  render={(arrayHelpers) => (
                    <Box sx={{ p: 2 }}>
                      {values.conditions.map((condition, index) => (
                        <Box sx={{ p: 2 }} key={index}>
                          <Grid container spacing={2} key={index}>
                            {index !== 0 && (
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            )}
                            {index !== 0 && (
                              <Grid item xs={12} sm={3}>
                                <FormControl fullWidth variant="filled">
                                  <InputLabel shrink>
                                    <FormattedMessage
                                      id="condition"
                                      defaultMessage="Condition"
                                    />
                                  </InputLabel>
                                  <Field
                                    component={Select}
                                    name={`conditions[${index}].condition`}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                    variant="filled"
                                  >
                                    <MenuItem value="or">
                                      <FormattedMessage
                                        id="or"
                                        defaultMessage="Or"
                                      />
                                    </MenuItem>

                                    <MenuItem value="and">
                                      <FormattedMessage
                                        id="and"
                                        defaultMessage="And"
                                      />
                                    </MenuItem>
                                  </Field>
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
                                <IconButton
                                  onClick={arrayHelpers.handleRemove(index)}
                                >
                                  <DeleteOutlined color="error" />
                                </IconButton>
                              </Stack>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                              <FormControl fullWidth>
                                <InputLabel shrink>
                                  <FormattedMessage
                                    id="type"
                                    defaultMessage="Type"
                                  />
                                </InputLabel>
                                <Field
                                  component={Select}
                                  name={`conditions[${index}].type`}
                                  label={
                                    <FormattedMessage
                                      id="type"
                                      defaultMessage="Type"
                                    />
                                  }
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  fullWidth
                                >
                                  <MenuItem value="collection">
                                    <FormattedMessage
                                      id="collection"
                                      defaultMessage="Collection"
                                    />
                                  </MenuItem>

                                  <MenuItem value="coin">
                                    <FormattedMessage
                                      id="coin"
                                      defaultMessage="Coin"
                                    />
                                  </MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                            {condition?.type === 'collection' && (
                              <Grid item xs={12} sm>
                                <CollectionItemAutocomplete
                                  onChange={async (coll: any) => {
                                    setFieldValue(
                                      `conditions[${index}].address`,
                                      coll.contractAddress,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].chainId`,
                                      coll.chainId,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].symbol`,
                                      coll.name,
                                    );
                                    // We identify protocol to then check if we need to add token Id
                                    getAssetProtocol(
                                      getProviderByChainId(coll.chainId),
                                      coll.contractAddress,
                                    ).then((v) => {
                                      setFieldValue(
                                        `conditions[${index}].protocol`,
                                        v,
                                      );
                                    });
                                  }}
                                  formValue={getValueFrom(values, index) ?? {}}
                                />
                              </Grid>
                            )}
                            {condition?.type === 'coin' && (
                              <Grid item xs={12} sm>
                                <SearchTokenAutocomplete
                                  label="Search coin"
                                  tokens={featuredTokens}
                                  data={selectedCoins[index]}
                                  onChange={(tk: any) => {
                                    selectedCoins[index] = tk;
                                    setSelectedCoins({ ...selectedCoins });
                                    setFieldValue(
                                      `conditions[${index}].address`,
                                      tk?.address,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].symbol`,
                                      tk?.symbol,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].chainId`,
                                      tk?.chainId,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].decimals`,
                                      tk?.decimals,
                                    );
                                    setFieldValue(
                                      `conditions[${index}].protocol`,
                                      undefined,
                                    );
                                  }}
                                />
                              </Grid>
                            )}

                            {condition?.protocol === 'ERC1155' && (
                              <Grid item xs={12} sm={3}>
                                <Field
                                  component={TextField}
                                  name={`conditions[${index}].tokenId`}
                                  label={
                                    <FormattedMessage
                                      id="token.id"
                                      defaultMessage="token.id"
                                    />
                                  }
                                  fullWidth
                                />
                              </Grid>
                            )}

                            <Grid item xs={12} sm={3}>
                              <Field
                                component={TextField}
                                name={`conditions[${index}].amount`}
                                label={
                                  <FormattedMessage
                                    id="required.quantity"
                                    defaultMessage="Required quantity"
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
                        display="flex"
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="outlined"
                          startIcon={<AddOutlined />}
                          onClick={() =>
                            arrayHelpers.push({
                              type: 'collection',
                              amount: 1,
                              condition: 'or',
                            })
                          }
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 4, py: 2 }}>
            <Button onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button onClick={submitForm} variant="contained">
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
