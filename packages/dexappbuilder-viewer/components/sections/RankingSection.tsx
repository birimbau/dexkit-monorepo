import { Box, Grid, TablePagination, Typography } from "@mui/material";

import { CopyAddress } from "@dexkit/ui/components/CopyAddress";
import { RankingPageSection } from "@dexkit/ui/modules/wizard/types/section";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAppRankingQuery } from "../../../../apps/nft-marketplace-premium/src/modules/wizard/hooks";
export interface RankingSectionProps {
  section: RankingPageSection;
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "account",
    numeric: false,
    disablePadding: false,
    label: "Account",
  },
  {
    id: "points",
    numeric: true,
    disablePadding: false,
    label: "Points",
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;

  order: Order;
  orderBy?: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            //align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              sx={{ fontSize: "22px" }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <FormattedMessage
                id={headCell.id}
                defaultMessage={headCell.label}
              />

              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type Order = "asc" | "desc";

export default function RankingSection({ section }: RankingSectionProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { account } = useWeb3React();

  const queryRanking = useAppRankingQuery({
    rankingId: section.settings.rankingId,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const rows = queryRanking.data?.data ? queryRanking.data?.data : [];

  const sortTable = (
    a: { account: string; points: number },
    b: { account: string; points: number }
  ) => {
    if (orderBy === "points") {
      if (order === "asc") {
        return a.points - b.points;
      }
      if (order === "desc") {
        return b.points - a.points;
      }
    }

    if (orderBy === "account") {
      if (order === "asc") {
        if (a.account.toUpperCase() < b.account.toUpperCase()) {
          return -1;
        } else {
          return 1;
        }
      }
      if (order === "desc") {
        if (a.account.toUpperCase() > b.account.toUpperCase()) {
          return -1;
        } else {
          return 1;
        }
      }
    }

    return 0;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          sx={{
            display: "block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: { xs: "center", sm: "left" },
          }}
          variant="h5"
          component="h1"
        >
          {queryRanking?.data?.ranking?.title || ""}
        </Typography>
        <Typography
          sx={{
            display: "block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: { xs: "center", sm: "left" },
          }}
          variant="body2"
          component="p"
        >
          {queryRanking?.data?.ranking?.description || ""}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", mb: 2, mt: 2 }}>
          <TableContainer>
            <Table aria-label="ranking table" size={dense ? "small" : "medium"}>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.sort(sortTable).map((row, id) => (
                  <TableRow
                    selected={
                      account && row?.account
                        ? account?.toLowerCase() === row?.account?.toLowerCase()
                        : false
                    }
                    key={id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.account} <CopyAddress account={row.account} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "16px" }}>
                        {row.points}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {rows.length === 0 && (
            <Box
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={"column"}
              sx={{ pt: 2, pb: 2 }}
            >
              <LeaderboardIcon fontSize="large"></LeaderboardIcon>
              <Typography variant="h5">
                <FormattedMessage
                  id={"empty.leaderboard"}
                  defaultMessage={"Empty leaderboard"}
                ></FormattedMessage>
              </Typography>
            </Box>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
