import { ChainId } from "@dexkit/core";
import { ZrxOrder } from "@dexkit/core/services/zrx/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useExchangeContext } from "../../hooks";
import { useZrxCancelOrderMutation, useZrxOrderbook } from "../../hooks/zrx";
import OrdersTableRow from "./OrdersTableRow";

export interface OrdersTable {
  chainId?: ChainId;
  account?: string;
  provider?: ethers.providers.Web3Provider;
}

export default function OrdersTable({
  chainId,
  account,
  provider,
}: OrdersTable) {
  const { baseToken, quoteToken } = useExchangeContext();
  const orderbookQuery = useZrxOrderbook({ chainId, account });

  const cancelOrderMutation = useZrxCancelOrderMutation();

  const handleCancelOrder = useCallback(
    async (order: ZrxOrder) => {
      await cancelOrderMutation.mutateAsync({ order, chainId, provider });
    },
    [chainId, provider]
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="side" defaultMessage="Side" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="size" defaultMessage="Size" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="filled" defaultMessage="Filled" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="price" defaultMessage="Price" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="expires.in" defaultMessage="Expires in" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="expires.in" defaultMessage="Status" />
            </TableCell>

            <TableCell>
              <FormattedMessage id="actions" defaultMessage="Actions" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderbookQuery.data?.records.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography align="center" variant="body1">
                  <FormattedMessage
                    id="there.is.no.orders.to.show"
                    defaultMessage="There is no orders to show"
                  />
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {orderbookQuery.data?.records.map((record, index) => (
            <OrdersTableRow
              key={index}
              onCancel={handleCancelOrder}
              record={record}
              account={account}
              baseToken={baseToken}
              quoteToken={quoteToken}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
