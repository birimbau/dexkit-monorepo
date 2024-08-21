import useUserOrder from '@/modules/commerce/hooks/orders/useUserOrder';
import useUserOrderItems from '@/modules/commerce/hooks/orders/useUserOrderItems';
import { Order } from '@/modules/commerce/types';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { getBlockExplorerUrl, truncateAddress } from '@dexkit/core/utils';
import { useTokenDataQuery } from '@dexkit/ui';
import MainLayout from '@dexkit/ui/components/layouts/main';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import { myAppsApi } from 'src/services/whitelabel';

interface OrderComponentProps {
  order: Order;
}

function OrderComponent({ order }: OrderComponentProps) {
  const { data: items } = useUserOrderItems({ id: order.id });

  const { data: tokenData } = useTokenDataQuery({
    chainId: order.chainId,
    address: order.contractAddress,
  });

  return (
    <Container>
      <Stack spacing={2}>
        <PageHeader
          breadcrumbs={[
            {
              caption: (
                <FormattedMessage id="my.orders" defaultMessage="My Orders" />
              ),
              uri: '/c/orders',
            },
            {
              caption: order.id.substring(10),
              uri: `/c/orders/${order.id}`,
              active: true,
            },
          ]}
        />
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="id" defaultMessage="ID" />
                </Typography>
                <Typography variant="body2">
                  {order.id.substring(10)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="creator" defaultMessage="Creator" />
                </Typography>
                <Typography variant="body2">
                  <Link
                    target="_blank"
                    href={`${getBlockExplorerUrl(order.chainId)}/address/${
                      order.senderAddress
                    }`}
                  >
                    {truncateAddress(order.senderAddress)}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="token" defaultMessage="Token" />
                </Typography>
                <Typography variant="body2">
                  <Link
                    target="_blank"
                    href={`${getBlockExplorerUrl(order.chainId)}/address/${
                      order.contractAddress
                    }`}
                  >
                    {tokenData?.name}
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="total" defaultMessage="Total" />
                </Typography>
                <Typography variant="body2">
                  {order.amount} {tokenData?.symbol.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="product" defaultMessage="Product" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage
                      id="un.price"
                      defaultMessage="Un. Price"
                    />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="quantity" defaultMessage="Quantity" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="total" defaultMessage="Total" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.product.digital ? (
                        <Link
                          target="_blank"
                          href={`/c/content/${order.id}/${item.productId}`}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </TableCell>
                    <TableCell>
                      {item.price} {tokenData?.symbol.toUpperCase()}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {new Decimal(item.quantity).mul(item.price).toNumber()}{' '}
                      {tokenData?.symbol.toUpperCase()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>
    </Container>
  );
}

export default function OrderPage() {
  const router = useRouter();

  const { id } = router.query;

  const { data } = useUserOrder({ id: id as string });

  return data && <OrderComponent order={data} />;
}

OrderPage.getLayout = (page: any) => {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <MainLayout>{page}</MainLayout>
    </DexkitApiProvider.Provider>
  );
};
