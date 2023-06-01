import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CollectionItemAutocomplete } from '../forms/CollectionItemAutocomplete';

import * as Yup from 'yup';

import { AppDialogTitle } from '../../../../components/AppDialogTitle';

import { Grid, LinearProgress } from '@mui/material';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Select, TextField } from 'formik-mui';

import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useAllTokenList } from 'src/hooks/blockchain';
import { getAssetProtocol } from 'src/services/nft';
import { Token } from 'src/types/blockchain';
import { getProviderByChainId } from 'src/utils/blockchain';
import { getGatedConditionsText } from '../../services';
import { GatedCondition } from '../../types';
import { SearchTokenAutocomplete } from '../forms/SearchTokenAutocomplete';
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
  })
);

interface Props {
  onCancel?: () => void;
  onSubmit?: (conditions: GatedCondition[]) => void;
  conditions?: GatedCondition[];
  dialogProps: DialogProps;
}

export default function GatedConditionsFormDialog({
  onCancel,
  onSubmit,
  dialogProps,
  conditions,
}: Props) {
  console.log(conditions);
  const { onClose } = dialogProps;
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };
  const featuredTokens = useAllTokenList({ includeNative: true });
  const [selectedCoins, setSelectedCoins] = useState<{ [key: number]: Token }>(
    {}
  );
  const [selectedCollections, setSelectedCollections] = useState<{
    [key: number]: any;
  }>({});
  useEffect(() => {
    if (conditions) {
      for (let index = 0; index < conditions.length; index++) {
        let condition = conditions[index];
        if (condition.type === 'coin') {
          let findToken = featuredTokens.find(
            (t) =>
              t.address === condition.address && t.chainId === condition.chainId
          );
          if (findToken) {
            selectedCoins[index] = findToken;
          }
        }
        if (condition.type === 'collection') {
          selectedCollections[index] = {
            contractAddress: condition.address,
            chainId: condition.chainId,
          };
        }
      }
      setSelectedCoins({ ...selectedCoins });
      setSelectedCollections({ ...selectedCollections });
    }
  }, [conditions, featuredTokens]);

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="add.gated.conditions"
            defaultMessage="Add gated conditions"
          />
        }
        onClose={handleClose}
      />

      <Formik
        onSubmit={(values) => {
          console.log(values);
          if (values && onSubmit) {
            onSubmit(values.conditions);
          }
          handleClose();
        }}
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
        validationSchema={GatedCoditionsSchema}
      >
        {({ submitForm, isSubmitting, isValid, values, setFieldValue }) => (
          <Form>
            {false && (
              <Alert role="info">
                {getGatedConditionsText({ conditions: values.conditions })}
              </Alert>
            )}

            <Alert severity="info">
              <AlertTitle>
                <FormattedMessage
                  id="info.alert.title.gated.form.modal"
                  defaultMessage="Define access conditions for your private page"
                />
              </AlertTitle>
              <FormattedMessage
                id="info.alert.description.gated.form.modal"
                defaultMessage="As the owner of this private web page, please enter the specific conditions that users must meet to access your page. By defining these conditions, you ensure that only eligible users are granted access."
              />
            </Alert>

            <DialogContent dividers>
              <FieldArray
                name="conditions"
                render={(arrayHelpers) => (
                  <Box sx={{ p: 2 }}>
                    {values.conditions.map((condition, index) => (
                      <Box sx={{ p: 2 }}>
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
                              <Fab
                                variant="extended"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <DeleteIcon />
                              </Fab>
                            </Stack>
                          </Grid>

                          <Grid item xs={12}>
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
                            <Grid item xs={12}>
                              <CollectionItemAutocomplete
                                onChange={(coll: any) => {
                                  selectedCollections[index] = coll;
                                  setSelectedCollections({
                                    ...selectedCollections,
                                    //@ts-ignore
                                    address: coll?.contractAddress,
                                  });
                                  setFieldValue(
                                    `conditions[${index}].address`,
                                    coll.contractAddress
                                  );
                                  setFieldValue(
                                    `conditions[${index}].chainId`,
                                    coll.chainId
                                  );
                                  setFieldValue(
                                    `conditions[${index}].symbol`,
                                    coll.name
                                  );
                                  // We identify protocol to then check if we need to add token Id
                                  getAssetProtocol(
                                    getProviderByChainId(coll.chainId),
                                    coll.contractAddress
                                  ).then((v) => {
                                    selectedCollections[index].protocol = v;
                                    setSelectedCollections({
                                      ...selectedCollections,
                                    });
                                  });
                                }}
                                formValue={selectedCollections[index]}
                              />
                            </Grid>
                          )}
                          {condition?.type === 'coin' && (
                            <Grid item xs={12}>
                              <SearchTokenAutocomplete
                                label="Search coin"
                                tokens={featuredTokens}
                                data={selectedCoins[index]}
                                onChange={(tk: any) => {
                                  selectedCoins[index] = tk;
                                  setSelectedCoins({ ...selectedCoins });
                                  setFieldValue(
                                    `conditions[${index}].address`,
                                    tk.address
                                  );
                                  setFieldValue(
                                    `conditions[${index}].symbol`,
                                    tk.symbol
                                  );
                                  setFieldValue(
                                    `conditions[${index}].chainId`,
                                    tk.chainId
                                  );
                                  setFieldValue(
                                    `conditions[${index}].decimals`,
                                    tk.decimals
                                  );
                                }}
                              />
                            </Grid>
                          )}

                          {condition?.protocol === 'ERC1155' && (
                            <Grid item xs={12}>
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

                          <Grid item xs={12}>
                            <Field
                              component={TextField}
                              name={`conditions[${index}].amount`}
                              label={
                                <FormattedMessage
                                  id="must.have"
                                  defaultMessage="Must have"
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
            </DialogContent>
            <DialogActions>
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
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
