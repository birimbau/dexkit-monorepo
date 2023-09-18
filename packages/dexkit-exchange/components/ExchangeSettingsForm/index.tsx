import {
  Avatar,
  FormControl,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { Field, Formik } from "formik";

import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";

import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { getChainName, ipfsUriToUrl, parseChainId } from "@dexkit/core/utils";
import { TextField } from "formik-mui";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { DexkitExchangeSettings, ExchangeSettingsSchema } from "../../types";
import FormActions from "./ExchangeSettingsFormActions";
import ExchangeTokensInput from "./ExchangeTokensInput";
export interface ExchangeSettingsFormProps {
  onCancel: () => void;
  onSave: (settings: DexkitExchangeSettings) => void;
  settings?: DexkitExchangeSettings;
  tokens: Token[];
}

export default function ExchangeSettingsForm({
  onCancel,
  onSave,
  settings,
  tokens,
}: ExchangeSettingsFormProps) {
  const handleSubmit = async (values: DexkitExchangeSettings) => {
    onSave(values);
  };

  const [chainId, setChainId] = useState(ChainId.Ethereum);

  const handleChange = (event: SelectChangeEvent<ChainId>) => {
    if (typeof event.target.value === "number") {
      setChainId(event.target.value);
    }
  };

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
            }
      }
      onSubmit={handleSubmit}
      validationSchema={ExchangeSettingsSchema}
    >
      {({ submitForm, values }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              label={
                <FormattedMessage id="0x.api.key" defaultMessage="0x Api Key" />
              }
              name="zrxApiKey"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage id="network" defaultMessage="Network" />
              </InputLabel>
              <Select
                label={
                  <FormattedMessage id="network" defaultMessage="Network" />
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
                    <ListItemText primary={getChainName(parseChainId(key))} />
                  </MenuItem>
                ))}
              </Select>
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
              TextFieldProps={{
                fullWidth: true,
                label: (
                  <FormattedMessage
                    id="fee.amount"
                    defaultMessage="Fee amount"
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormActions onSubmit={submitForm} onCancel={onCancel} />
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
