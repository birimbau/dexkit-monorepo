import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
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
import { FormattedMessage } from 'react-intl';

import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import ContractButton from '@/modules/forms/components/ContractButton';
import {
  useDeployableContractsQuery,
  useListDeployedContracts,
} from '@/modules/forms/hooks';
import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { truncateAddress } from '@dexkit/core/utils';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Info from '@mui/icons-material/Info';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Search from '@mui/icons-material/Search';

import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getChainName } from 'src/utils/blockchain';

export default function FormsContractsPage() {
  const router = useRouter();

  const deployableContractsQuery = useDeployableContractsQuery();

  const [searchForm, setSearchForm] = useState<string>();
  const [searchDeployedContract, setSearchDeployedContract] =
    useState<string>();

  const handleChangeSearchTemplateForm = (value: string) => {
    setSearchDeployedContract(value);
  };

  const [page, setPage] = useState(1);

  const { account } = useWeb3React();

  const listDeployedContractQuery = useListDeployedContracts({
    page,
    owner: account as string,
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
                    <FormattedMessage id="create" defaultMessage="Contracts" />
                  ),
                  uri: `/forms/contracts`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  <FormattedMessage
                    id="deploy.your.own.contract"
                    defaultMessage="Deploy your own contract"
                  />
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="you.can.deploy.contracts.fromo.our.list.and.from.the.community.in.the.future"
                    defaultMessage="You can deploy contracts from our list and from the community in the future"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="thirdweb.contracts"
                    defaultMessage="ThirdWeb Contracts"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {deployableContractsQuery.data?.map((contract, key) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <ContractButton
                        title={contract.name}
                        description={contract.description}
                        creator={{
                          imageUrl: contract.publisherIcon,
                          name: contract.publisherName,
                        }}
                        onClick={() => {
                          router.push(
                            `/forms/deploy/thirdweb/${contract.slug}`,
                          );
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="my.contracts"
                    defaultMessage="My contracts"
                  />
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="contracts.you.deployed"
                    defaultMessage="Contracts you deployed"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
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
                              <FormattedMessage
                                id="name"
                                defaultMessage="Name"
                              />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage
                                id="type"
                                defaultMessage="Type"
                              />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage
                                id="network"
                                defaultMessage="Network"
                              />
                            </TableCell>
                            <TableCell>
                              <FormattedMessage
                                id="address"
                                defaultMessage="Address"
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
                            {listDeployedContractQuery.data?.pages[page - 1]
                              ?.items?.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5}>
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
                                <TableCell>{contract?.type || ''}</TableCell>
                                <TableCell>
                                  {getChainName(contract.chainId)}
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`/contract/${NETWORK_SLUG(
                                      contract.chainId,
                                    )}/${contract.contractAddress}`}
                                  >
                                    {truncateAddress(contract.contractAddress)}
                                  </Link>
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
                            <TableCell colSpan={5}>
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
                                  <KeyboardArrowLeft />
                                </IconButton>
                                <IconButton
                                  disabled={
                                    !listDeployedContractQuery.hasNextPage
                                  }
                                  onClick={handleNextPage}
                                >
                                  <KeyboardArrowRight />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

(FormsContractsPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};
