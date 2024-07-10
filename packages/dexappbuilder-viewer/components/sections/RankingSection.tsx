import { Box, Grid, Link, Stack, Typography } from "@mui/material";

import { useAppRankingQuery } from "@dexkit/ui/modules/wizard/hooks/ranking";
import { RankingPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import React, { useMemo } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormattedMessage } from "react-intl";

import { getBlockExplorerUrl, truncateAddress } from "@dexkit/core/utils";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

export interface RankingSectionProps {
  section: RankingPageSection;
}

const NoRows: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <MilitaryTechIcon fontSize="large" />
        <div>
          <Typography variant="h5" textAlign="center">
            <FormattedMessage
              id="no.leaderboard"
              defaultMessage="No Leaderboard"
            />
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            <FormattedMessage
              id="create.rules.to.see.accounts.here"
              defaultMessage="Create rules to see accounts here"
            />
          </Typography>
        </div>
      </Stack>
    </Box>
  );
};

export default function RankingSection({ section }: RankingSectionProps) {
  const { account, chainId } = useWeb3React();

  const queryRanking = useAppRankingQuery({
    rankingId: section.settings.rankingId,
  });

  const rows = queryRanking.data?.data ? queryRanking.data?.data : [];

  const columns = useMemo(() => {
    return [
      {
        field: "account",
        disableReorder: true,
        sortable: false,
        hideSortIcons: true,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,

        flex: 1,
        renderHeader: () => {
          return <FormattedMessage id="account" defaultMessage="Account" />;
        },
        renderCell: ({ row }) => {
          return (
            <Link
              href={`${getBlockExplorerUrl(chainId)}/address/${row.account}`}
              target="_blank"
            >
              {truncateAddress(row.account)}
            </Link>
          );
        },
      },
      {
        field: "points",
        flex: 1,
        filterable: false,
        disableReorder: true,
        sortable: false,
        hideSortIcons: true,
        hideable: false,
        disableColumnMenu: true,
        renderHeader: () => {
          return <FormattedMessage id="points" defaultMessage="Points" />;
        },
      },
    ] as GridColDef<{
      account: string;
      points: number;
    }>[];
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {queryRanking?.data?.ranking?.title || ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {queryRanking?.data?.ranking?.description || ""}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          getRowId={(row) => row.account}
          rowCount={rows.length}
          rows={rows}
          columns={columns}
          sx={{ minHeight: 300 }}
          slots={{ noRowsOverlay: NoRows, noResultsOverlay: NoRows }}
        />
      </Grid>
    </Grid>
  );
}
