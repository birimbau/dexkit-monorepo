import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Field, Formik } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";

import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { getChainName, ipfsUriToUrl, parseChainId } from "@dexkit/core/utils";
import { TextField } from "formik-mui";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";
import ExchangeTokensInput from "./ExchangeTokensInput";

import Edit from "@mui/icons-material/Edit";
import { useFormikContext } from "formik";
import SelectNetworksDialog from "./SelectNetworksDialog";

function SaveOnChangeListener({
  onSave,
  onValidate,
}: {
  onSave: (settings: DexkitExchangeSettings) => void;
  onValidate?: (isValid: boolean) => void;
}) {
  const { values, isValid } = useFormikContext<DexkitExchangeSettings>();

  useEffect(() => {
    onSave(values);
  }, [values, isValid]);

  useEffect(() => {
    if (onValidate) {
      onValidate(isValid);
    }
  }, [isValid, onValidate]);

  return null;
}

export interface ExchangeSettingsFormProps {
  onCancel: () => void;
  onSave: (settings: DexkitExchangeSettings) => void;
  saveOnChange?: boolean;
  settings?: DexkitExchangeSettings;
  tokens: Token[];
  onValidate?: (isValid: boolean) => void;
}

export default function ExchangeSettingsForm({
  onCancel,
  onSave,
  settings,
  tokens,
  saveOnChange,
  onValidate,
}: ExchangeSettingsFormProps) {
  const handleSubmit = async (values: DexkitExchangeSettings) => {
    onSave(values);
  };

  const [chainId, setChainId] = useState<ChainId>();

  const handleChange = (event: SelectChangeEvent<ChainId>) => {
    if (typeof event.target.value === "number") {
      setChainId(event.target.value);
    }
  };

  const [showSelectNetworks, setShowSelectNetworks] = useState(false);

  const handleShowSelectNetworks = () => {
    setShowSelectNetworks(true);
  };

  const handleCloseSelectNetworks = () => {
    setShowSelectNetworks(false);
  };

  const { formatMessage } = useIntl();

  const handleValidate = useCallback((values: DexkitExchangeSettings) => {
    const errors: any = {};

    let chains = Object.keys(values.defaultTokens).map((key) =>
      parseChainId(key)
    );

    for (let chain of chains) {
      if (!values.defaultPairs[chain]?.baseToken) {
        if (!errors["defaultPairs"]) {
          errors["defaultPairs"] = { [chain]: {} };
        }

        errors["defaultPairs"][chain]["baseToken"] = formatMessage({
          id: "a.default.base.token.is.required",
          defaultMessage: "A default base token is required",
        });
      }

      if (!values.defaultPairs[chain]?.quoteToken) {
        if (!errors["defaultPairs"]) {
          errors["defaultPairs"] = { [chain]: {} };
        }

        errors["defaultPairs"][chain]["quoteToken"] = formatMessage({
          id: "a.default.quote.token.is.required",
          defaultMessage: "A default quote token is required",
        });
      }
    }

    return errors;
  }, []);

  return (
    <Formik
      initialValues={
        settings
          ? settings
          : {
              defaultPairs: {},
              quoteTokens: [],
              defaultTokens: {},
              affiliateAddress: "",
              zrxApiKey: "",
              buyTokenPercentageFee: 0.0,
              availNetworks: [],
            }
      }
      onSubmit={handleSubmit}
      validationSchema={ExchangeSettingsSchema}
      validate={handleValidate}
      validateOnChange
    >
      {({ submitForm, values, errors }) => (
        <>
          <SelectNetworksDialog
            DialogProps={{
              open: showSelectNetworks,
              maxWidth: "sm",
              fullWidth: true,
              onClose: handleCloseSelectNetworks,
            }}
          />
          {saveOnChange && (
            <SaveOnChangeListener onSave={onSave} onValidate={onValidate} />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {JSON.stringify(errors, null, 2)}
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="0x.api.key"
                    defaultMessage="0x Api Key"
                  />
                }
                name="zrxApiKey"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row"
                  >
                    <Typography variant="subtitle2">
                      <FormattedMessage
                        id="choose.the.networks.that.your.exchange.will.be.enabled"
                        defaultMessage="Choose the networks that your exchange will be enabled"
                      />
                    </Typography>
                    {values.availNetworks.length > 0 && (
                      <Tooltip
                        title={
                          <FormattedMessage
                            id="edit.networks"
                            defaultMessage="Edit Networks"
                          />
                        }
                      >
                        <IconButton
                          onClick={handleShowSelectNetworks}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                  <Divider />
                  <Box>
                    <Grid container spacing={2}>
                      {values.availNetworks.length > 0 ? (
                        Object.keys(NETWORKS)
                          .filter((key) =>
                            values.availNetworks.includes(parseChainId(key))
                          )
                          .map((key) => (
                            <Grid item key={key}>
                              <Chip
                                size="small"
                                avatar={
                                  <Avatar
                                    src={ipfsUriToUrl(
                                      NETWORKS[parseChainId(key)].imageUrl || ""
                                    )}
                                  />
                                }
                                label={getChainName(parseChainId(key))}
                              />
                            </Grid>
                          ))
                      ) : (
                        <Grid item xs={12}>
                          <Box>
                            <Stack spacing={2} alignItems="center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <FormattedMessage
                                  id="No.networks.selected"
                                  defaultMessage="No networks selected"
                                />
                              </Typography>
                              <Button
                                onClick={handleShowSelectNetworks}
                                variant="outlined"
                              >
                                <FormattedMessage
                                  id="select.networks"
                                  defaultMessage="Select networks"
                                />
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <FormattedMessage
                          id="network"
                          defaultMessage="Network"
                        />
                      </InputLabel>
                      <Select
                        disabled={values.availNetworks.length === 0}
                        label={
                          <FormattedMessage
                            id="network"
                            defaultMessage="Network"
                          />
                        }
                        fullWidth
                        value={chainId}
                        onChange={handleChange}
                        renderValue={(value) => {
                          return (
                            <Stack
                              direction="row"
                              alignItems="center"
                              alignContent="center"
                              spacing={1}
                            >
                              <Avatar
                                src={ipfsUriToUrl(
                                  NETWORKS[value].imageUrl || ""
                                )}
                                style={{ width: "auto", height: "1rem" }}
                              />
                              <Typography variant="body1">
                                {NETWORKS[value].name}
                              </Typography>
                            </Stack>
                          );
                        }}
                      >
                        {Object.keys(NETWORKS)
                          .filter((key) =>
                            values.availNetworks.includes(parseChainId(key))
                          )
                          .map((key) => (
                            <MenuItem key={key} value={parseChainId(key)}>
                              <ListItemIcon>
                                <Avatar
                                  src={ipfsUriToUrl(
                                    NETWORKS[parseChainId(key)].imageUrl || ""
                                  )}
                                  style={{ width: "1rem", height: "1rem" }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={getChainName(parseChainId(key))}
                              />
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        <FormattedMessage
                          id="define.the.tokens.and.the.default.pair.for.this.network"
                          defaultMessage="Define the tokens and the default pair for this network"
                        />
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokensInput
                      tokens={tokens}
                      chainId={chainId}
                      name="quoteTokens"
                      tokenName="quoteToken"
                      label={
                        <FormattedMessage
                          id="quote.tokens"
                          defaultMessage="Quote tokens"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokensInput
                      tokens={tokens}
                      chainId={chainId}
                      name="baseTokens"
                      tokenName="baseToken"
                      label={
                        <FormattedMessage
                          id="quote.tokens"
                          defaultMessage="Base tokens"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="affiliate.address"
                    defaultMessage="Affiliate address"
                  />
                }
                fullWidth
                name="affiliateAddress"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                label={
                  <FormattedMessage
                    id="fee.recipient.address"
                    defaultMessage="Fee recipient address"
                  />
                }
                fullWidth
                name="feeRecipientAddress"
              />
            </Grid>

            <Grid item xs={12}>
              <FormikDecimalInput
                name="buyTokenPercentageFee"
                decimals={2}
                maxDigits={3}
                TextFieldProps={{
                  fullWidth: true,
                  label: (
                    <FormattedMessage
                      id="fee.amount"
                      defaultMessage="Fee amount"
                    />
                  ),
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            {!saveOnChange && (
              <Grid item xs={12}>
                <FormActions onSubmit={submitForm} onCancel={onCancel} />
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Formik>
  );
}
