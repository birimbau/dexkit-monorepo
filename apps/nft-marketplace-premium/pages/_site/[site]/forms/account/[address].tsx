import {
  useListFormTemplatesQuery,
  useListFormsQuery,
} from '@/modules/forms/hooks';
import { truncateAddress } from '@dexkit/core/utils';
import { Info } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  NoSsr,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsAccountPage() {
  const router = useRouter();

  const { address } = router.query;

  const listFormTemplatesQuery = useListFormTemplatesQuery({
    creatorAddress: address as string,
  });

  const listFormsQuery = useListFormsQuery({
    creatorAddress: address as string,
  });

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
                  uri: '/forms/deploy/nft',
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
                <FormattedMessage id="templates" defaultMessage="Templates" />
              </Typography>
              <Button
                LinkComponent={Link}
                href="/forms/templates/create"
                size="small"
                variant="outlined"
              >
                <FormattedMessage
                  id="create.template"
                  defaultMessage="Create template"
                />
              </Button>
            </Stack>
          </Box>
          <Box>
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
                {listFormTemplatesQuery.isLoading ? (
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
                    {listFormTemplatesQuery.data?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Box>
                            <Stack spacing={2} alignItems="center">
                              <Info fontSize="large" />
                              <Box>
                                <Typography align="center" variant="h5">
                                  <FormattedMessage
                                    id="no.templates.yet"
                                    defaultMessage="No templates yet"
                                  />
                                </Typography>
                                <Typography
                                  align="center"
                                  color="text.secondary"
                                  variant="body1"
                                >
                                  <FormattedMessage
                                    id="Create templates for your forms"
                                    defaultMessage="Create templates for your forms"
                                  />
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                    {listFormTemplatesQuery.data?.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.id}</TableCell>
                        <TableCell>
                          <Link href={`/forms/templates/${template.id}`}>
                            <FormattedMessage
                              id="template"
                              defaultMessage="Template"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>{template.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
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

                        <TableCell>
                          <FormattedMessage
                            id="template"
                            defaultMessage="Template"
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
                            <TableCell colSpan={4}>
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
                            <TableCell>
                              {form.templateId ? (
                                <Link
                                  href={`/forms/templates/${form.templateId}`}
                                >
                                  <FormattedMessage
                                    id="template"
                                    defaultMessage="Template"
                                  />
                                </Link>
                              ) : (
                                <FormattedMessage
                                  id="no.template"
                                  defaultMessage="No template"
                                />
                              )}
                            </TableCell>
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
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
