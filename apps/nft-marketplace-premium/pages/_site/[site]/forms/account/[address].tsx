import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import {
  useListDeployedContracts,
  useListFormsQuery,
} from '@/modules/forms/hooks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { truncateAddress } from '@dexkit/core/utils';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { Info } from '@mui/icons-material';
import Search from '@mui/icons-material/Search';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getChainName } from 'src/utils/blockchain';

export default function FormsAccountPage() {
  const router = useRouter();

  const { address } = router.query;

  const [searchForm, setSearchForm] = useState<string>();
  const [searchDeployedContract, setSearchDeployedContract] =
    useState<string>();

  const listFormsQuery = useListFormsQuery({
    creatorAddress: address as string,
    query: searchForm,
  });

  const handleChangeSearchForm = (value: string) => {
    setSearchForm(value);
  };

  const handleChangeSearchTemplateForm = (value: string) => {
    setSearchDeployedContract(value);
  };

  const [page, setPage] = useState(1);

  const listDeployedContractQuery = useListDeployedContracts({
    page,
    owner: address as string,
    name: searchDeployedContract,
  });

  const handlePrevPage = () => {
    if (page - 1 >= 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (listDeployedContractQuery.hasNextPage) {
      listDeployedContractQuery.fetchNextPage();
    }

    setPage((p) => p + 1);
  };

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <NoSsr>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage id="forms" defaultMessage="Forms" />
                  ),
                  uri: '/forms',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="creator.address"
                      defaultMessage="Creator: {address}"
                      values={{
                        address: truncateAddress(address as string),
                      }}
                    />
                  ),
                  uri: `/forms/account/${address as string}`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Card>
              <CardContent>
                <Stack spacing={2} justifyContent="center" alignItems="center">
                  <Avatar sx={{ width: '6rem', height: '6rem' }} />
                  <Typography sx={{ fontWeight: 600 }} variant="body1">
                    {truncateAddress(address as string)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">
                <FormattedMessage
                  id="deployed.contracts"
                  defaultMessage="Deployed contracts"
                />
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LazyTextField
                  TextFieldProps={{
                    size: 'small',
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={handleChangeSearchTemplateForm}
                />
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage id="id" defaultMessage="ID" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage id="name" defaultMessage="Name" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="network"
                            defaultMessage="Network"
                          />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="actions"
                            defaultMessage="Actions"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {listDeployedContractQuery.isLoading ? (
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
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        {listDeployedContractQuery.data?.pages[page - 1]?.items
                          ?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Box>
                                <Stack spacing={2} alignItems="center">
                                  <Info fontSize="large" />
                                  <Box>
                                    <Typography align="center" variant="h5">
                                      <FormattedMessage
                                        id="no.contracts.yet"
                                        defaultMessage="No contracts yet"
                                      />
                                    </Typography>
                                    <Typography
                                      align="center"
                                      color="text.secondary"
                                      variant="body1"
                                    >
                                      <FormattedMessage
                                        id="deploy.new.contracts.to.see.it.here"
                                        defaultMessage="Deploy new contracts to see it here"
                                      />
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                        {listDeployedContractQuery.data?.pages[
                          page - 1
                        ]?.items?.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell>{contract.id}</TableCell>
                            <TableCell>{contract.name}</TableCell>
                            <TableCell>
                              {getChainName(contract.chainId)}
                            </TableCell>
                            <TableCell>
                              <Button
                                LinkComponent={Link}
                                href={`/forms/create?contractAddress=${contract.contractAddress}&chainId=${contract.chainId}`}
                                target="_blank"
                                size="small"
                                variant="outlined"
                              >
                                <FormattedMessage
                                  id="create.form"
                                  defaultMessage="Create form"
                                />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            alignContent="center"
                            spacing={2}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              disabled={
                                !listDeployedContractQuery.hasPreviousPage
                              }
                              onClick={handlePrevPage}
                            >
                              <KeyboardArrowLeftIcon />
                            </IconButton>
                            <IconButton
                              disabled={!listDeployedContractQuery.hasNextPage}
                              onClick={handleNextPage}
                            >
                              <KeyboardArrowRightIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">
                <FormattedMessage id="forms" defaultMessage="Forms" />
              </Typography>
              <Button
                LinkComponent={Link}
                href="/forms/create"
                size="small"
                variant="outlined"
              >
                <FormattedMessage
                  id="create.form"
                  defaultMessage="Create form"
                />
              </Button>
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LazyTextField
                  TextFieldProps={{
                    size: 'small',
                    fullWidth: true,
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
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <FormattedMessage id="id" defaultMessage="ID" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage id="name" defaultMessage="Name" />
                        </TableCell>
                        <TableCell>
                          <FormattedMessage
                            id="description"
                            defaultMessage="Description"
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {listFormsQuery.isLoading ? (
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
                      <TableBody>
                        {listFormsQuery.data?.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3}>
                              <Box>
                                <Stack spacing={2} alignItems="center">
                                  <Info fontSize="large" />
                                  <Box>
                                    <Typography align="center" variant="h5">
                                      <FormattedMessage
                                        id="no.forms.yet"
                                        defaultMessage="No forms yet"
                                      />
                                    </Typography>
                                    <Typography
                                      align="center"
                                      color="text.secondary"
                                      variant="body1"
                                    >
                                      <FormattedMessage
                                        defaultMessage="Create forms to interact with contracts"
                                        id="create.forms.to interact.with.contracts"
                                      />
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                        {listFormsQuery.data?.map((form) => (
                          <TableRow key={form.id}>
                            <TableCell>{form.id}</TableCell>
                            <TableCell>
                              <Link href={`/forms/${form.id}`}>
                                {form.name}
                              </Link>
                            </TableCell>
                            <TableCell>{form.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
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
