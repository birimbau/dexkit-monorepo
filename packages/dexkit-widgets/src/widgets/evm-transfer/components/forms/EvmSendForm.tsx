import SendIcon from "@mui/icons-material/Send";
import Token from "@mui/icons-material/Token";
import {
  Autocomplete,
  AutocompleteChangeReason,
  Avatar,
  Button,
  CircularProgress,
  createFilterOptions,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { Connector } from "@web3-react/types";
import { isAddress } from "ethers/lib/utils";
import { ChangeEvent, SyntheticEvent, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { switchNetwork } from "../../../../utils";
import { Coin } from "../../types";

const filter = createFilterOptions<string>();

export interface EvmSendFormProps {
  coins?: Coin[];
  isSubmitting?: boolean;
  values: { address?: string; amount?: number; coin?: Coin | null };
  accounts?: { address: string }[];
  onChange: (params: {
    address?: string;
    amount?: number;
    coin?: Coin | null;
  }) => void;
  onSubmit: () => void;
  connector?: Connector;
  chainId?: number;
  balance?: string;
}

export function EvmSendForm({
  coins,
  values,
  onChange,
  accounts,
  onSubmit,
  isSubmitting,
  chainId,
  connector,
  balance,
}: EvmSendFormProps) {
  const handleChangeCoin = (
    event: SyntheticEvent<Element, Event>,
    value: Coin | null,
    reason: AutocompleteChangeReason
  ) => {
    onChange({ ...values, coin: value });
  };

  const handleChangeAddress = (
    event: SyntheticEvent<Element, Event>,
    newValue: string | null,
    reason: AutocompleteChangeReason
  ) => {
    if (typeof newValue === "string") {
      onChange({ ...values, address: newValue });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "number" && typeof e.target.value === "string") {
      onChange({ ...values, [e.target.name]: parseInt(e.target.value) });
    } else {
      onChange({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleSwitchNetwork = () => {
    if (connector && values.coin?.network.chainId) {
      switchNetwork(connector, values.coin?.network.chainId);
    }
  };

  const isAddressValid = useMemo(() => {
    return values.address ? isAddress(values.address) : false;
  }, [values]);

  const isValid = useMemo(() => {
    return isAddressValid && values.amount && values?.coin;
  }, [values, isAddressValid]);

  const isChainDiff = useMemo(() => {
    return chainId && values.coin && chainId !== values.coin?.network.chainId;
  }, [chainId, values.coin]);

  const notEnoughBalance = useMemo(() => {
    if (!balance) {
      return true;
    }
    if (balance && values?.amount && values?.amount > Number(balance)) {
      return true;
    }
    return false;
  }, [balance, values?.amount]);

  return (
    <Stack spacing={2}>
      <Autocomplete
        disablePortal
        disabled={isSubmitting}
        id="select-token"
        options={coins || []}
        value={values?.coin}
        onChange={handleChangeCoin}
        getOptionLabel={(opt) => opt.name}
        renderOption={(props, opt) => (
          <ListItem {...props}>
            <ListItemAvatar>
              <Avatar src={opt.imageUrl}>
                <Token />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={opt.name}
              secondary={
                <FormattedMessage
                  id="coin.on.network"
                  defaultMessage="{name} on {network}"
                  values={{ name: opt.name, network: opt.network.name }}
                />
              }
            />
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={isSubmitting}
            label={<FormattedMessage id="coin" defaultMessage="Coin" />}
          />
        )}
      />

      <Autocomplete
        disablePortal
        disabled={isSubmitting}
        options={accounts?.map((a) => a.address) || []}
        id="select-address"
        onChange={handleChangeAddress}
        value={values?.address}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option);
          if (inputValue !== "" && !isExisting) {
            filtered.push();
          }

          return filtered;
        }}
        freeSolo
        autoSelect
        renderInput={(params) => (
          <TextField
            {...params}
            label={<FormattedMessage id="address" defaultMessage="Address" />}
            name="address"
            error={!isAddressValid}
            helperText={
              !isAddressValid ? (
                <FormattedMessage
                  id="invalid address"
                  defaultMessage="Invalid address"
                />
              ) : undefined
            }
          />
        )}
      />

      <TextField
        fullWidth
        disabled={isSubmitting}
        type="number"
        name="amount"
        value={values?.amount}
        onChange={handleChange}
        label={<FormattedMessage id="amount" defaultMessage="Amount" />}
      />

      {isChainDiff ? (
        <Button
          onClick={handleSwitchNetwork}
          variant="contained"
          color="primary"
          size="large"
        >
          <FormattedMessage
            id="switch.network"
            defaultMessage="Switch network"
          />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting || notEnoughBalance}
          startIcon={
            isSubmitting ? (
              <CircularProgress color="inherit" size="1rem" />
            ) : (
              <SendIcon />
            )
          }
          variant="contained"
          color="primary"
          size="large"
        >
          {notEnoughBalance ? (
            <FormattedMessage
              id="not.enough.balance"
              defaultMessage="Not enough balance"
            />
          ) : (
            <FormattedMessage id="send" defaultMessage="Send" />
          )}
        </Button>
      )}
    </Stack>
  );
}
