import { Network, TokenWhitelabelApp } from '@dexkit/core/types';
import { getChainName } from '@dexkit/core/utils';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { MouseEvent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TOKEN_KEY } from '../../utils';
import TokensTableMenu from './TokensTableMenu';

export interface TokensTableProps {
  tokens: TokenWhitelabelApp[];
  search: string;
  networks: Network[];
  appUrl?: string;
  onMakeTradable: (key: string) => void;
  selection: string[];
  onChangeSelection: (selection: string[]) => void;
}

interface TokenWhitelabelAppWithIndex {
  index: number;
  token: TokenWhitelabelApp;
}

export default function TokensTable({
  tokens,
  search,
  networks,
  appUrl,
  onMakeTradable,
  onChangeSelection,
  selection,
}: TokensTableProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectedToken, setSelectedToken] = useState<TokenWhitelabelApp>();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedToken(undefined);
  };

  const handleOpenMenu = (token: TokenWhitelabelApp) => {
    return (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setSelectedToken(token);
      setAnchorEl(e.currentTarget);
    };
  };

  const networkIds = useMemo(() => {
    return networks.map((n) => n.chainId);
  }, [networks]);

  const filteredTokens: TokenWhitelabelAppWithIndex[] = useMemo(() => {
    let newTokens = [
      ...tokens.map((t, index) => ({
        index,
        token: t,
      })),
    ];

    if (!tokens) {
      return [];
    }

    if (networks.length > 0) {
      newTokens = newTokens.filter((t) => {
        return networkIds.includes(t.token.chainId);
      });
    }

    return newTokens.filter((t) => {
      return (
        t.token.name.toLowerCase().search(search) > -1 ||
        t.token.symbol.toLowerCase().search(search) > -1
      );
    });
  }, [JSON.stringify(tokens), search, networkIds]);

  const [offset, limit] = useMemo(() => {
    return [
      paginationModel.page * paginationModel.pageSize,
      paginationModel.page * paginationModel.pageSize +
        paginationModel.pageSize,
    ];
  }, [paginationModel, tokens]);

  const pageList = useMemo(() => {
    return filteredTokens?.slice(offset, limit) || [];
  }, [JSON.stringify(filteredTokens), offset, limit]);

  const handleMakeTradable = (token: TokenWhitelabelApp) => {
    return (e: MouseEvent) => {
      e.stopPropagation();

      return onMakeTradable(TOKEN_KEY(token));
    };
  };

  const columns: GridColDef<TokenWhitelabelAppWithIndex>[] = useMemo(() => {
    return [
      {
        field: 'Token',
        flex: 1,
        renderHeader: () => (
          <Typography>
            <FormattedMessage id="token" defaultMessage="Token" />
          </Typography>
        ),
        renderCell: ({ row, value }) => {
          return (
            <Stack
              sx={{ py: 1 }}
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                sx={(theme) => ({
                  width: theme.spacing(4),
                  height: theme.spacing(4),
                })}
                src={row.token.logoURI}
              />
              <Box>
                <Typography variant="body2">{row.token.name}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={getChainName(row.token.chainId)} size="small" />
                  {row.token.tradable && (
                    <Chip
                      label={
                        <FormattedMessage
                          id="tradable"
                          defaultMessage="Tradable"
                        />
                      }
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          );
        },
        disableColumnMenu: true,
      },
      // {
      //   flex: 1,
      //   field: 'Highlight',
      //   disableColumnMenu: true,
      //   disableReorder: true,
      //   sortable: false,
      //   renderHeader: () => (
      //     <Typography>
      //       <FormattedMessage id="highlight" defaultMessage="Highlight" />
      //     </Typography>
      //   ),
      //   renderCell: () => {
      //     return (
      //       <Tooltip
      //         title={
      //           <FormattedMessage
      //             id="select.the.tokens.that.will.be.highlighted.in.the.swap.section"
      //             defaultMessage="Select the tokens that will be highlighted in the Swap section"
      //           />
      //         }
      //       >
      //         <Switch />
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        flex: 1,
        field: 'assign',
        disableColumnMenu: true,
        disableReorder: true,
        sortable: false,
        renderHeader: () => (
          <Typography>
            <FormattedMessage id="assign" defaultMessage="Assign" />
          </Typography>
        ),
        renderCell: ({ row }) => {
          return (
            <Tooltip
              title={
                <FormattedMessage
                  id="assign.tokens.for.nft.transactions.in.your.app"
                  defaultMessage="Assign tokens for NFT transactions in your app."
                />
              }
            >
              <Switch
                checked={Boolean(row.token.tradable)}
                onClick={handleMakeTradable(row.token)}
              />
            </Tooltip>
          );
        },
      },
      {
        flex: 1,
        field: 'actions',
        disableColumnMenu: true,
        disableReorder: true,
        sortable: false,
        renderHeader: () => (
          <Typography>
            <FormattedMessage id="actions" defaultMessage="Actions" />
          </Typography>
        ),
        renderCell: ({ row }) => {
          return (
            <IconButton onClick={handleOpenMenu(row.token)}>
              <MoreVert />
            </IconButton>
          );
        },
      },
    ] as GridColDef<TokenWhitelabelAppWithIndex>[];
  }, []);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  return (
    <>
      <TokensTableMenu
        appUrl={appUrl}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        token={selectedToken}
      />
      <DataGrid
        columns={columns}
        rows={pageList}
        rowSelection
        rowCount={filteredTokens.length}
        checkboxSelection
        getRowId={(row) => TOKEN_KEY(row.token as any)}
        rowHeight={60}
        pageSizeOptions={[5, 10, 25, 50]}
        onPaginationModelChange={setPaginationModel}
        paginationModel={paginationModel}
        paginationMode="server"
        rowSelectionModel={selection}
        onRowSelectionModelChange={(rowSelection) =>
          onChangeSelection(rowSelection as string[])
        }
      />
    </>
  );
}
