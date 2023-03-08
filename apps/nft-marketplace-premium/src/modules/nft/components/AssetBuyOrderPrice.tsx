import { Avatar, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { ethers } from 'ethers';
import { FormattedNumber } from 'react-intl';

import { memo, useMemo, useRef } from 'react';
import { useTokenList } from 'src/hooks/blockchain';
import { useCoinPricesQuery, useCurrency } from 'src/hooks/currency';
import { Asset, OrderBookItem } from 'src/types/nft';
import { isAddressEqual } from 'src/utils/blockchain';
import { ipfsUriToUrl } from 'src/utils/ipfs';

interface Props {
  orderBookItem?: OrderBookItem;
  asset?: Asset;
}

export function AssetBuyOrderPrice({ orderBookItem, asset }: Props) {
  const tokens = useTokenList({
    chainId: parseInt(String(asset?.chainId || '0')),
    includeNative: true,
  });

  const token = tokens.find((t) =>
    isAddressEqual(t.address, orderBookItem?.erc20Token)
  );

  const elRef = useRef<HTMLElement | null>(null);

  const currency = useCurrency();

  const coinPricesQuery = useCoinPricesQuery({
    includeNative: true,
    chainId: asset?.chainId,
  });

  const totalInCurrency = useMemo(() => {
    if (token && currency && orderBookItem) {
      if (coinPricesQuery?.data) {
        let ratio = 0;

        const tokenData = coinPricesQuery.data[token.address.toLowerCase()];

        if (tokenData && currency in tokenData) {
          ratio = tokenData[currency];
        }

        if (ratio) {
          return (
            ratio *
            parseFloat(
              ethers.utils.formatUnits(
                orderBookItem?.erc20TokenAmount,
                token.decimals
              )
            )
          );
        } else {
          return 0;
        }
      }
    }
  }, [token, coinPricesQuery, currency, orderBookItem]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        alignContent="center"
        spacing={1}
      >
        <Tooltip title={token?.symbol || ''}>
          <Avatar
            sx={{ width: 'auto', height: '1rem' }}
            src={ipfsUriToUrl(token?.logoURI || '')}
          />
        </Tooltip>
        <Typography variant="body2">
          <b>
            {orderBookItem?.order?.erc20TokenAmount &&
              ethers.utils.formatUnits(
                orderBookItem?.order?.erc20TokenAmount,
                token?.decimals || 18
              )}{' '}
            {token?.symbol.toUpperCase()}
          </b>
        </Typography>
        <Typography variant="caption">
          {totalInCurrency ? (
            <>
              ( <FormattedNumber value={totalInCurrency} currency={currency} />{' '}
              {currency.toUpperCase()})
            </>
          ) : (
            <Skeleton />
          )}
        </Typography>
      </Stack>
    </>
  );
}

export default memo(AssetBuyOrderPrice);
