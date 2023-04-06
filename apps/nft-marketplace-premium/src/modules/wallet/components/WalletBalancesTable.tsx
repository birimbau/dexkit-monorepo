import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChainId } from '../../../constants/enum';
import { useERC20BalancesQuery } from '../../../hooks/balances';
import { useCoinPricesQuery, useCurrency } from '../../../hooks/currency';
import { useIsBalanceVisible } from '../../../hooks/misc';
import WalletTableRow from './WalletTableRow';

interface Props {
  isBalancesVisible: boolean;
  chainId?: ChainId;
}

function WalletBalancesTable({ isBalancesVisible, chainId }: Props) {
  const tokenBalancesQuery = useERC20BalancesQuery(undefined, chainId, false);
  const coinPricesQuery = useCoinPricesQuery({
    includeNative: true,
    chainId,
  });
  const prices = coinPricesQuery.data;
  const currency = useCurrency();

  const tokenBalancesWithPrices = useMemo(() => {
    return tokenBalancesQuery?.data?.map((tb) => {
      return {
        ...tb,
        price:
          prices && prices[tb.token.address.toLowerCase()]
            ? prices[tb.token.address.toLowerCase()][currency]
            : undefined,
      };
    });
  }, [prices, tokenBalancesQuery.data, currency]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="token" defaultMessage="Token" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="total" defaultMessage="Total" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="balance" defaultMessage="Balance" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokenBalancesWithPrices?.map((token, index: number) => (
            <WalletTableRow
              key={index}
              isLoadingCurrency={coinPricesQuery.isLoading}
              tokenBalance={token}
              price={token.price}
              isBalancesVisible={isBalancesVisible}
              currency={currency}
            />
          ))}
          {tokenBalancesQuery.isLoading &&
            new Array(4).fill(null).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function WalletTableSkeleton({ rows = 4 }: { rows: number }) {
  return (
    <Table>
      <TableBody>
        {new Array(rows).fill(null).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface WalletProps {
  chainId?: ChainId;
}

/*function WalletBalances({ chainId }: WalletProps) {
  const isBalancesVisible = useIsBalanceVisible();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <Paper sx={{ p: 1 }}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  <FormattedMessage
                    id="something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                    description="Something went wrong error message"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {String(error)}
                </Typography>
                <Button color="primary" onClick={resetErrorBoundary}>
                  <FormattedMessage
                    id="try.again"
                    defaultMessage="Try again"
                    description="Try again"
                  />
                </Button>
              </Stack>
            </Paper>
          )}
        >
          <Suspense fallback={<WalletTableSkeleton rows={4} />}>
            <WalletBalancesTable
              isBalancesVisible={isBalancesVisible}
              chainId={chainId}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}*/
function WalletBalances({ chainId }: WalletProps) {
  const isBalancesVisible = useIsBalanceVisible();

  return (
    <WalletBalancesTable
      isBalancesVisible={isBalancesVisible}
      chainId={chainId}
    />
  );
}

export default WalletBalances;
