import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  Stack,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import SearchIcon from "@mui/icons-material/Search";

import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { useCallback, useMemo, useState } from "react";
import SelectPairList from "../SelectPairList";

import LazyTextField from "@dexkit/ui/components/LazyTextField";

export interface SelectPairDialogProps {
  DialogProps: DialogProps;
  baseTokens: Token[];
  quoteTokens: Token[];
  baseToken?: Token;
  quoteToken?: Token;
  onSelectPair: (baseToken: Token, quoteToken: Token) => void;
}

export default function SelectPairDialog({
  DialogProps,
  baseToken: baseTokenParam,
  quoteToken: quoteTokenParam,
  baseTokens,
  quoteTokens,
  onSelectPair,
}: SelectPairDialogProps) {
  const { onClose } = DialogProps;

  const { formatMessage } = useIntl();

  const [baseToken, setBaseToken] = useState<Token | undefined>(baseTokenParam);
  const [quoteToken, setQuoteToken] = useState<Token | undefined>(
    quoteTokenParam
  );

  const handleSelectToken = useCallback((token: Token) => {
    setQuoteToken(token);
  }, []);

  const handleConfirm = () => {
    if (baseToken && quoteToken) {
      onSelectPair(baseToken, quoteToken);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const isSameToken = useCallback(
    (token: Token, other: Token) => {
      return (
        token.chainId === baseToken?.chainId &&
        isAddressEqual(token.contractAddress, baseToken.contractAddress)
      );
    },
    [baseToken]
  );

  const handleToggleBaseToken = useCallback(
    (token: Token) => {
      return () => {
        setBaseToken(token);
      };
    },
    [baseToken]
  );

  const [query, setQuery] = useState("");

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const filteredTokens = useMemo(() => {
    return quoteTokens.filter((t) => {
      const searchByName = t.name.search(query) > -1;
      const searchByAddress = isAddressEqual(t.contractAddress, query);
      const searchBySymbol =
        t.symbol.toLowerCase().search(query.toLowerCase()) > -1;

      return searchByName || searchByAddress || searchBySymbol;
    });
  }, [query, quoteTokens]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.a.pair" defaultMessage="Select a pair" />
        }
        onClose={handleClose}
      />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <LazyTextField
            value={query}
            onChange={handleChange}
            TextFieldProps={{
              placeholder: formatMessage({
                id: "search.for.a.token.by.name.symbol.and.address",
                defaultMessage:
                  "Search for a token by name, symbol and address",
              }),
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            {baseTokens.map((token, index) => (
              <Chip
                key={index}
                label={token.symbol.toUpperCase()}
                clickable
                color={
                  baseToken && isSameToken(token, baseToken)
                    ? "primary"
                    : undefined
                }
                onClick={handleToggleBaseToken(token)}
              />
            ))}
          </Stack>
        </Stack>
      </Box>
      <DialogContent sx={{ p: 0 }} dividers>
        <SelectPairList
          onSelect={handleSelectToken}
          quoteTokens={filteredTokens}
          baseToken={baseToken}
          quoteToken={quoteToken}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
