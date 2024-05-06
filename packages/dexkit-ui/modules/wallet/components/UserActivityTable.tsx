import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import useUserActivity from "../hooks/useUserActivity";

export interface UserActivityTableProps {}

export default function UserActivityTable({}: UserActivityTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { account } = useWeb3React();

  const userActivityQuery = useUserActivity({ account });

  const renderPages = () => {
    // if (pageList.length === 0) {
    //   return (
    //     <TableRow>
    //       <TableCell colSpan={5}>
    //         <Stack sx={{ py: 2 }} alignItems="center" justifyContent="center">
    //           <Typography variant="body1" color="textSecondary">
    //             <FormattedMessage
    //               id="nothing.to.see.here"
    //               defaultMessage="Nothing to see here"
    //             />
    //           </Typography>
    //         </Stack>
    //       </TableCell>
    //     </TableRow>
    //   );
    // }

    if (
      userActivityQuery.data?.pages &&
      userActivityQuery.data?.pages.length > 0
    ) {
      return userActivityQuery.data?.pages[page]?.data.map((event, key) => (
        <TableRow key={`event-${page}-${key}`}>
          <TableCell>{event.from}</TableCell>
        </TableRow>
      ));
    }
  };

  const handlePageChange = (event: any, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="date" defaultMessage="Date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="status" defaultMessage="Status" />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderPages()}</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page}
              count={0}
              onPageChange={handlePageChange}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
