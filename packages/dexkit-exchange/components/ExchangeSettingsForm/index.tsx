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
import { Field, Formik, getIn } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";

import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import {
  getChainName,
  ipfsUriToUrl,
  isAddressEqual,
  parseChainId,
} from "@dexkit/core/utils";
import { Select as FormikSelect, TextField } from "formik-mui";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";

import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/core/services/zrx/constants";
import Edit from "@mui/icons-material/Edit";
import { useFormikContext } from "formik";
import { QUOTE_TOKENS_SUGGESTION } from "../../constants/tokens";
import ExchangeQuoteTokensInput from "./ExchangeQuoteTokensInput";
import ExchangeTokenInput from "./ExchangeTokenInput";
import SelectNetworksDialog from "./SelectNetworksDialog";

import _ from "lodash";

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

  const [chainId, setChainId] = useState<ChainId>(ChainId.Ethereum);

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

  const handleValidate = async (values: DexkitExchangeSettings) => {
    let errors: any = {};

    if (values.buyTokenPercentageFee && values.buyTokenPercentageFee > 10) {
      errors["buyTokenPercentageFee"] = formatMessage({
        id: "the.max.fee.is.ten.percent",
        defaultMessage: "The max fee is 10%",
      });
    }

    for (let chainId of values.availNetworks) {
      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].baseToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The base token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        _.setWith(
          errors,
          `defaultPairs.${String(chainId)}.baseToken`,
          error,
          Object
        );
      }

      if (
        values.defaultPairs[chainId] &&
        !values.defaultPairs[chainId].quoteToken
      ) {
        let error = formatMessage(
          {
            id: "the.base.token.is.required.on.chain",
            defaultMessage: "The quote token is required on {chainName}",
          },
          { chainName: getChainName(chainId) }
        );

        _.setWith(
          errors,
          `defaultPairs.${String(chainId)}.quoteToken`,
          error,
          Object
        );
      }
    }

    return errors;
  };

  const getIntialTokens = useCallback(() => {
    const res = QUOTE_TOKENS_SUGGESTION.map((t) => {
      return { chainId: t.chainId, token: t };
    }).reduce(
      (prev, curr) => {
        let obj = { ...prev };

        if (!obj[curr.chainId]) {
          obj[curr.chainId] = { baseTokens: [], quoteTokens: [] };
        }

        let index = tokens.findIndex(
          (t) =>
            curr.token.chainId === t.chainId &&
            isAddressEqual(curr.token.contractAddress, t.contractAddress)
        );

        if (index > -1) {
          obj[curr.chainId].quoteTokens.push(curr.token);
        }

        return obj;
      },
      {} as { [key: number]: { quoteTokens: Token[]; baseTokens: [] } }
    );

    return res;
  }, [tokens]);

  return (
    <Formik
      initialValues={
        settings
          ? settings
          : {
              defaultNetwork: ChainId.Ethereum,
              defaultPairs: {},
              quoteTokens: [],
              defaultTokens: getIntialTokens(),
              affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
              zrxApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || "",
              buyTokenPercentageFee: 0.0,
              availNetworks: Object.keys(NETWORKS).map((key) =>
                parseChainId(key)
              ),
            }
      }
      onSubmit={handleSubmit}
      validationSchema={ExchangeSettingsSchema}
      validateOnChange
      validate={handleValidate}
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
            {/* <Grid item xs={12}>
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
            </Grid> */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Field
                    component={FormikSelect}
                    label={
                      <FormattedMessage
                        id="default.network"
                        defaultMessage="Default network"
                      />
                    }
                    name="defaultNetwork"
                    fullWidth
                    renderValue={(value: ChainId) => {
                      return (
                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={1}
                        >
                          <Avatar
                            src={ipfsUriToUrl(NETWORKS[value].imageUrl || "")}
                            style={{ width: "auto", height: "1rem" }}
                          />
                          <Typography variant="body1">
                            {NETWORKS[value].name}
                          </Typography>
                        </Stack>
                      );
                    }}
                  >
                    {Object.keys(NETWORKS).map((key) => (
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
                  </Field>
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
                    <ExchangeQuoteTokensInput
                      key={`${chainId}-quote`}
                      tokens={tokens}
                      chainId={chainId}
                      label={
                        <FormattedMessage
                          id="quote.tokens"
                          defaultMessage="Quote tokens"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokenInput
                      key={`${chainId}-base`}
                      name={`defaultPairs[${chainId}].baseToken`}
                      tokens={
                        getIn(values, `defaultTokens.${chainId}.baseTokens`) ||
                        []
                      }
                      label={
                        <FormattedMessage
                          id="base.token"
                          defaultMessage="Base token"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ExchangeTokenInput
                      name={`defaultPairs[${chainId}].quoteToken`}
                      tokens={
                        getIn(values, `defaultTokens.${chainId}.quoteTokens`) ||
                        []
                      }
                      label={
                        <FormattedMessage
                          id="quote.token"
                          defaultMessage="Quote token"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
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

            <Grid item xs={12} sm={3}>
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
