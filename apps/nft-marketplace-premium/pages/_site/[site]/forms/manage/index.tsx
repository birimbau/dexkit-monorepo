import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import { useListFormsQuery } from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Search from '@mui/icons-material/Search';

import AccountFormsTable from '@/modules/forms/components/AccountFormsTable';
import Link from '@dexkit/ui/components/AppLink';
import { ConnectWalletButton } from '@dexkit/ui/components/ConnectWalletButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Add from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsAccountPage() {
  const { account: address } = useWeb3React();

  const [searchForm, setSearchForm] = useState<string>();

  const listFormsQuery = useListFormsQuery({
    creatorAddress: address as string,
    query: searchForm,
  });

  const handleChangeSearchForm = (value: string) => {
    setSearchForm(value);
  };

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <PageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage
                    id="dexgenerator"
                    defaultMessage="DexGenerator"
                  />
                ),
                uri: '/forms',
              },
              {
                caption: (
                  <FormattedMessage
                    id="manage.contract.forms"
                    defaultMessage="Manage Contract Forms"
                  />
                ),
                uri: `/forms/manage`,
                active: true,
              },
            ]}
          />
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">
                <FormattedMessage
                  id="my.contract.forms"
                  defaultMessage="My Contract Forms"
                />
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  direction={'row'}
                >
                  <Button
                    LinkComponent={Link}
                    href="/forms/create"
                    size="small"
                    variant="contained"
                    startIcon={<Add />}
                  >
                    <FormattedMessage
                      id="create.contract.form"
                      defaultMessage="New Contract Form"
                    />
                  </Button>

                  <LazyTextField
                    TextFieldProps={{
                      size: 'small',

                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={handleChangeSearchForm}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Container>
                  {!address ? (
                    <div>
                      <ConnectWalletButton />
                    </div>
                  ) : listFormsQuery.isLoading ? (
                    <TableBody>
                      {new Array(5).fill(null).map((_, key) => (
                        <TableRow key={key}>
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
                  ) : (
                    <div>
                      {listFormsQuery.data &&
                        listFormsQuery.data?.length > 0 && (
                          <AccountFormsTable
                            forms={listFormsQuery.data ?? []}
                          />
                        )}
                    </div>
                  )}
                </Container>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsAccountPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};
