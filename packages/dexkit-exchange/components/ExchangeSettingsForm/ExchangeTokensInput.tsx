import { Token } from "@dexkit/core/types";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { getIn, useFormikContext } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { isTokenEqual } from "../../utils";
import ExchangeTokenListInput from "./ExchangeTokenListInput";

import { ChainId } from "@dexkit/core";
import { isAddressEqual } from "@dexkit/core/utils";
import _ from "lodash";
import SelectTokensDialog from "./SelectTokensDialog";

export interface ExchangeTokensInputProps {
  name: string;
  tokenName: string;
  label: React.ReactNode;
  tokens: Token[];
  chainId?: ChainId;
}

export default function ExchangeTokensInput({
  name,
  label,
  tokenName,
  tokens,
  chainId,
}: ExchangeTokensInputProps) {
  const { setFieldValue, values, errors } = useFormikContext<any>();

  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedTokens, setSelectedTokens] = useState<{
    [key: string]: Token;
  }>({});

  const handleSelectToken = useCallback(
    (token: Token) => {
      if (!isEdit) {
        if (
          isTokenEqual(
            getIn(values, `defaultPairs[${chainId}][${tokenName}]`),
            token
          )
        ) {
          return setFieldValue(
            `defaultPairs[${chainId}][${tokenName}]`,
            undefined
          );
        } else {
          return setFieldValue(`defaultPairs[${chainId}][${tokenName}]`, token);
        }
      }

      setSelectedTokens((value) => {
        let newValue = { ...value };
        let key = `${token.chainId}-${token.contractAddress}`;

        if (value[key]) {
          delete newValue[key];
        } else {
          newValue[key] = token;
        }

        return newValue;
      });
    },
    [isEdit, values, tokenName, chainId]
  );

  const handleToggleEdit = () => {
    setIsEdit((value) => {
      if (!value) {
        setSelectedTokens({});
      }

      return !value;
    });
  };

  const hasSelecteds = useMemo(() => {
    let vals = Object.values(selectedTokens);
    return vals.length > 0 && vals.find((c) => typeof c === "object");
  }, [selectedTokens]);

  const handleRemove = () => {
    let tokens = Object.values(selectedTokens);

    let formTokens: Token[] = getIn(values, name);

    _.remove(formTokens, (val) => {
      return (
        tokens.findIndex(
          (t) =>
            isAddressEqual(val.contractAddress, t.contractAddress) &&
            val.chainId == t.chainId
        ) > -1
      );
    });

    setFieldValue(`defaultTokens[${chainId}][${name}]`, formTokens);

    handleToggleEdit();
  };

  const handleAdd = () => {
    setIsOpen(true);
  };

  const handleCloseAdd = () => {
    setIsOpen(false);
  };

  const handleConfirmSelectTokens = (tokens: Token[]) => {
    setFieldValue(`defaultTokens[${chainId}][${name}]`, tokens);
    handleCloseAdd();
  };

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => t.chainId === chainId);
  }, [tokens, chainId]);

  const fieldErrors = useMemo(() => {
    return getIn(errors, `defaultPairs[${chainId}][${tokenName}]`);
  }, [name, chainId, tokenName, errors]);

  console.log("errors", errors);

  return (
    <>
      {isOpen && (
        <SelectTokensDialog
          DialogProps={{
            open: isOpen,
            onClose: handleCloseAdd,
            maxWidth: "sm",
            fullWidth: true,
          }}
          onConfirm={handleConfirmSelectTokens}
          tokens={filteredTokens}
          defaultSelectedTokens={
            getIn(values, `defaultTokens[${chainId}][${name}]`) || []
          }
        />
      )}

      <Paper
        sx={{
          borderColor: fieldErrors
            ? (theme) => theme.palette.error.main
            : undefined,
        }}
      >
        <Stack
          sx={{ p: 2 }}
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle2">{label}</Typography>
            {fieldErrors && (
              <Typography variant="body2" color="error">
                {fieldErrors}
              </Typography>
            )}
          </Box>
          {isEdit ? (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <Button
                size="small"
                disabled={!hasSelecteds}
                onClick={handleRemove}
                startIcon={<Delete />}
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
              <Button
                onClick={handleToggleEdit}
                size="small"
                startIcon={<Close />}
              >
                <FormattedMessage id="cancel" defaultMessage="cancel" />
              </Button>
            </Stack>
          ) : (
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <IconButton
                disabled={chainId === undefined}
                size="small"
                onClick={handleToggleEdit}
              >
                <Edit />
              </IconButton>
              <Tooltip
                title={
                  <FormattedMessage id="add.token" defaultMessage="Add token" />
                }
              >
                <span>
                  <IconButton
                    disabled={chainId === undefined}
                    onClick={handleAdd}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          )}
        </Stack>
        <Divider />
        <ExchangeTokenListInput
          tokens={getIn(values, `defaultTokens[${chainId}][${name}]`) || []}
          onSelect={handleSelectToken}
          isEdit={isEdit}
          selectedToken={getIn(
            values,
            `defaultPairs[${chainId}][${tokenName}]`
          )}
          selectedTokens={selectedTokens}
        />
      </Paper>
    </>
  );
}
