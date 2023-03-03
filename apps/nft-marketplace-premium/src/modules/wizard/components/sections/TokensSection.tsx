import { ImportExport, Search } from '@mui/icons-material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { ChangeEvent, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppConfirmDialog from '../../../../components/AppConfirmDialog';
import { Token } from '../../../../types/blockchain';
import { WIZARD_MAX_TOKENS } from '../../constants';
const AddTokenDialog = dynamic(() => import('../dialogs/AddTokenDialog'));
const ImportTokenListDialog = dynamic(
  () => import('../dialogs/ImportTokenListDialog')
);
import TokensSectionList from './TokensSectionList';

interface Props {
  tokens: Token[];
  selectedKeys: { [key: string]: boolean };
  onSelect: (key: string) => void;
  onMakeTradable?: (key: string) => void;
  onSave: (token: Token[]) => void;
  onSelectAll: () => void;
  onRemove: () => void;
}

export default function TokensSection({
  selectedKeys,
  tokens,
  onSelect,
  onSelectAll,
  onSave,
  onRemove,
  onMakeTradable,
}: Props) {
  const { formatMessage } = useIntl();
  const [showAddToken, setShowAddToken] = useState(false);
  const [showRemoveTokens, setShowRemoveTokens] = useState(false);
  const [showImportTokenList, setShowImportTokenList] = useState(false);
  const [search, setSearch] = useState('');

  const [isSelectEnabled, setIsSelectEnabled] = useState(false);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleShowAddToken = () => {
    setShowAddToken(true);
  };

  const handleShowImportTokenList = () => {
    setShowImportTokenList(true);
  };

  const handleCloseAddToken = () => {
    setShowAddToken(false);
  };

  const handleSelectItems = () => {
    if (isSelectEnabled) {
      setIsSelectEnabled(false);
    } else {
      setIsSelectEnabled(true);
    }
  };

  const handleCloseImportTokenList = () => {
    setShowImportTokenList(false);
  };

  const handleSaveToken = (token: Token) => {
    onSave([token]);
  };

  const handleSaveTokens = (tokens: Token[]) => {
    onSave(tokens);
  };

  const handleShowRemoveTokens = () => {
    setShowRemoveTokens(true);
  };

  const handleCloseConfirmRemove = () => {
    setShowRemoveTokens(false);
  };

  const handleConfirmRemove = () => {
    onRemove();
    setSearch('');
    handleCloseConfirmRemove();
  };

  const hasSelectedTokens = useMemo(() => {
    return (
      Object.keys(selectedKeys).filter((k: string) => {
        return Boolean(selectedKeys[k]);
      }).length > 0
    );
  }, [selectedKeys]);

  const selectedTokenCount = useMemo(() => {
    return Object.keys(selectedKeys).length;
  }, [selectedKeys]);

  return (
    <>
      <ImportTokenListDialog
        tokens={tokens}
        dialogProps={{
          maxWidth: 'xs',
          fullWidth: true,
          open: showImportTokenList,
          onClose: handleCloseImportTokenList,
        }}
        onSave={handleSaveTokens}
      />
      <AddTokenDialog
        tokens={tokens}
        onSave={handleSaveToken}
        dialogProps={{
          maxWidth: 'xs',
          fullWidth: true,
          open: showAddToken,
          onClose: handleCloseAddToken,
        }}
      />
      <AppConfirmDialog
        dialogProps={{
          maxWidth: 'xs',
          fullWidth: true,
          open: showRemoveTokens,
          onClose: handleCloseConfirmRemove,
        }}
        onConfirm={handleConfirmRemove}
      >
        {Object.keys(selectedKeys).length > 1 ? (
          <FormattedMessage
            id="do.you.want.to.remove.all.number.tokens"
            defaultMessage="Do you want to remove all {count} tokens?"
            values={{ count: <b>{selectedTokenCount}</b> }}
          />
        ) : (
          <FormattedMessage
            id="do.you.want.to.remove.this.token"
            defaultMessage="Do you want to remove this token?"
          />
        )}
      </AppConfirmDialog>
      <Stack spacing={2}>
        {tokens.length > WIZARD_MAX_TOKENS && (
          <Alert severity="error">
            <FormattedMessage
              id="you.selected.more.than.amoount"
              defaultMessage="You selected {amount} tokens. The limit is {tokenLimit}"
              values={{
                amount: <b>{tokens.length}</b>,
                tokenLimit: <b>{WIZARD_MAX_TOKENS}</b>,
              }}
            />
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            fullWidth
            value={search}
            type="search"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={handleChangeSearch}
            placeholder={formatMessage({
              id: 'search.for.token',
              defaultMessage: 'Search for tokens...',
            })}
          />
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                onClick={handleShowAddToken}
                size="small"
                startIcon={<Add />}
                variant="outlined"
              >
                <FormattedMessage id="import" defaultMessage="Import" />
              </Button>
              <Button
                onClick={handleShowImportTokenList}
                size="small"
                startIcon={<ImportExport />}
                variant="outlined"
              >
                <FormattedMessage
                  id="add.from.token.list"
                  defaultMessage="Add from token list"
                />
              </Button>
            </Stack>
          </Stack>
          {hasSelectedTokens && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                startIcon={<Delete />}
                variant="outlined"
                color="error"
                onClick={handleShowRemoveTokens}
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
            </Stack>
          )}
        </Stack>

        <Divider />

        {tokens.length > 0 ? (
          <Box
            sx={{
              maxHeight: (theme) => theme.spacing(50),
              overflowY: 'scroll',
            }}
          >
            <Stack
              sx={{ px: 2, py: 1 }}
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                startIcon={
                  !isSelectEnabled ? <DoneAllIcon /> : <RemoveDoneIcon />
                }
                onClick={handleSelectItems}
                size="small"
              >
                {!isSelectEnabled ? (
                  <FormattedMessage
                    id="select.items"
                    defaultMessage="Select items"
                  />
                ) : (
                  <FormattedMessage
                    id="cancel.selection"
                    defaultMessage="Cancel Selection"
                  />
                )}
              </Button>
              {isSelectEnabled && <Checkbox onClick={onSelectAll} />}
            </Stack>

            <Divider />
            <TokensSectionList
              selectable={isSelectEnabled}
              tokens={tokens}
              search={search}
              selectedKeys={selectedKeys}
              onSelect={onSelect}
              onMakeTradable={onMakeTradable}
            />
          </Box>
        ) : (
          <Stack
            alignItems="center"
            alignContent="center"
            justifyContent="center"
            spacing={2}
            sx={{ py: 2 }}
          >
            <ErrorOutlineIcon fontSize="large" />
            <Box>
              <Typography variant="h5" align="center">
                <FormattedMessage id="no.tokens" defaultMessage="No Tokens" />
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                <FormattedMessage
                  id="you.need.to.add.or.import.tokens.so.users.can.make.trades"
                  defaultMessage="You need to add or import tokens so users can make trades"
                />
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </>
  );
}
