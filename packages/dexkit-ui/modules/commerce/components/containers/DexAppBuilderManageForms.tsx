
import { truncateAddress } from '@dexkit/core/utils';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Info from '@mui/icons-material/Info';
import Search from '@mui/icons-material/Search';

import Link from '@dexkit/ui/components/AppLink';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useListFormsQuery } from '@dexkit/web3forms/hooks/forms';
import useParams from './hooks/useParams';

export default function DexAppBuilderManageForms() {

  const { account } = useWeb3React();

  const [searchForm, setSearchForm] = useState<string>();

  const listFormsQuery = useListFormsQuery({
    creatorAddress: account as string,
    query: searchForm,
  });

  const handleChangeSearchForm = (value: string) => {
    setSearchForm(value);
  };


  const { setContainer } = useParams();

  return (
    <div>
      <Stack spacing={2}>
        <Box>
          <Card>
            <CardContent>
              <Stack spacing={2} justifyContent="center" alignItems="center">
                <Avatar sx={{ width: '6rem', height: '6rem' }} />
                <Typography sx={{ fontWeight: 600 }} variant="body1">
                  <FormattedMessage
                    id="creator.address"
                    defaultMessage="Creator: {address}"
                    values={{
                      address: truncateAddress(account as string),
                    }}
                  />
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
              <FormattedMessage id="forms" defaultMessage="Forms" />
            </Typography>
          </Stack>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    LinkComponent={Link}
                    href="/forms/create"
                    size="large"
                    variant="outlined"
                  >
                    <FormattedMessage
                      id="create.form"
                      defaultMessage="Create Form"
                    />
                  </Button>
                </Grid>
                <Grid item flex={1}>
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
                  /></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
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
                          <Link href="#" onClick={() => setContainer('', { id: form.id.toString() })}>{form.name}</Link>
                        </TableCell>
                        <TableCell>{form.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </div>
  );
}