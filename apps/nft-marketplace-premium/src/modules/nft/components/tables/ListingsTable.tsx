import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  IconButton,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from '../../../../utils/blockchain';
import { ethers } from 'ethers';

import { FormattedMessage } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { useBestSellOrderAssetRari, useOrderBook } from '../../../../hooks/nft';
import { SwapApiOrder } from '../../../../types/nft';
import { useAsset } from '../../../../hooks/nft';
import ListingsTableRow from './ListingsTableRow';
import { usePositionPaginator } from '../../../../hooks/misc';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TraderOrderStatus } from '../../../../constants/enum';
import moment from 'moment';
import { Share, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { useCurrency } from '../../../../hooks/currency';
import { useRouter } from 'next/router';
import ListingsTableRaribleRow from './ListingsTableRaribleRow';

interface Props {
  address?: string;
  id?: string;
  onCancel?: (order: SwapApiOrder) => void;
  onBuy?: (order: SwapApiOrder) => void;

  onShare?: (nonce: string) => void;
}

export function ListingsTable({
  id,
  address,
  onCancel,
  onBuy,
  onShare,
}: Props) {
  const { data: asset } = useAsset(address, id, { suspense: true });

  const { data: raribleAsset } = useBestSellOrderAssetRari(
    getNetworkSlugFromChainId(asset?.chainId),
    asset?.contractAddress,
    asset?.id
  );
  const { account } = useWeb3React();

  const currency = useCurrency();

  const router = useRouter();

  const paginator = usePositionPaginator();

  const [openMenu, setOpenMenu] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<SwapApiOrder>();

  const orders = useOrderBook({
    chainId: asset?.chainId,
    sellOrBuyNft: 'sell',
    nftToken: address,
    nftTokenId: id,
    offset: paginator.position.offset,
    limit: paginator.position.limit,
    maker: asset?.protocol === 'ERC721' ? asset?.owner : undefined,
    status: TraderOrderStatus.Open,
  });

  const handleShare = () => {
    if (selectedOrder && onShare) {
      onShare(selectedOrder.nonce);
      handleCloseMenu();
    }
  };

  const handleViewOrder = () => {
    router.push(
      `/order/${getNetworkSlugFromChainId(asset?.chainId)}/${
        selectedOrder?.nonce
      }`
    );
  };

  const handleMenu = (el: HTMLElement | null, order?: SwapApiOrder) => {
    setOpenMenu(true);
    setSelectedOrder(order);
    setAnchorEl(el);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
    setSelectedOrder(undefined);
    setAnchorEl(null);
  };

  const renderOrders = () => {
    const tempOrders = orders.data?.orders?.filter(
      ({ order }: { order: SwapApiOrder }) => {
        return (
          moment.unix(parseInt(order.expiry)).isAfter(moment()) &&
          (isAddressEqual(order.taker, ethers.constants.AddressZero) ||
            isAddressEqual(order.taker, account) ||
            isAddressEqual(order.maker, account))
        );
      }
    );

    if (tempOrders?.length === 0 && !raribleAsset) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="no.listings.yet"
                  defaultMessage="No listings yet"
                />
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    return (
      <>
        <ListingsTableRaribleRow asset={asset} account={account} />
        {tempOrders?.map(({ order, chainId }: any, index: number) => {
          return (
            <ListingsTableRow
              onMenu={handleMenu}
              key={index}
              chainId={chainId}
              asset={asset}
              order={order}
              onBuy={onBuy}
              onCancel={onCancel}
              account={account}
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Menu
        MenuListProps={{ disablePadding: true }}
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage
                id="share"
                defaultMessage="Share"
                description="Menu share option in offers table"
              />
            }
          />
        </MenuItem>
        <MenuItem onClick={handleViewOrder}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage
                id="view.order"
                defaultMessage="View Order"
                description="View Order"
              />
            }
          />
        </MenuItem>
      </Menu>
      <Stack spacing={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">
                  <FormattedMessage
                    defaultMessage="Price"
                    id="price"
                    description="Table price"
                  />
                </TableCell>
                <TableCell component="th">
                  <FormattedMessage
                    id="fiat.price"
                    defaultMessage="{currency} Price"
                    description="Fiat price"
                    values={{ currency: currency.toUpperCase() }}
                  />
                </TableCell>
                <TableCell component="th">
                  <FormattedMessage
                    id="exporation"
                    defaultMessage="Expiration"
                  />
                </TableCell>
                <TableCell component="th" colSpan={3}>
                  <FormattedMessage id="from" defaultMessage="From" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderOrders()}</TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="flex-end">
          <IconButton
            disabled={paginator.position.offset === 0}
            onClick={paginator.handlePrevious}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            disabled={
              orders.data !== undefined &&
              orders.data?.orders.length < paginator.pageSize
            }
            onClick={paginator.handleNext}
          >
            <NavigateNextIcon />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
}

export default ListingsTable;
