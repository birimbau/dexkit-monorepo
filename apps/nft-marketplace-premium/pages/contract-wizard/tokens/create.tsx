import CreateTokenDialog from '@/modules/contract-wizard/components/dialogs/CreateTokenDialog';
import { TokenFormSchema } from '@/modules/contract-wizard/constants/schemas';
import { useCreateToken } from '@/modules/contract-wizard/hooks';
import { TokenForm } from '@/modules/contract-wizard/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import MainLayout from 'src/components/layouts/main';
import { PageHeader } from 'src/components/PageHeader';

const INITIAL_VALUES: TokenForm = {
  name: '',
  symbol: '',
  maxSupply: 0,
};

const WizardCreateTokenPage: NextPage = () => {
  const { provider, chainId, isActive } = useWeb3React();

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [formValue, setFormValue] = useState<TokenForm>();

  const [transactionHash, setTransactionHash] = useState<string>();
  const [contractAddress, setContractAddress] = useState<string>();

  const handleCreateSubmit = (hash: string, contractAddress: string) => {
    setTransactionHash(hash);
    setContractAddress(contractAddress);

    enqueueSnackbar(
      formatMessage({
        id: 'transaction.submitted',
        defaultMessage: 'Transaction Submitted',
      }),
      {
        variant: 'info',
      }
    );

    if (chainId !== undefined) {
      const now = Date.now();
    }
  };

  const createTokenMutation = useCreateToken(provider, handleCreateSubmit);

  const handleCreateConfirm = async () => {
    setShowConfirm(false);
    setOpen(true);

    if (formValue) {
      try {
        await createTokenMutation.mutateAsync({ ...formValue });
      } catch (err) {
        enqueueSnackbar(
          formatMessage({
            id: 'transaction.failed',
            defaultMessage: 'Transaction failed',
          }),
          {
            variant: 'error',
          }
        );
      }
    }
  };

  const handleFormSubmit = async (values: TokenForm) => {
    setFormValue(values);
    setShowConfirm(true);
  };

  const handleCloseCreate = () => {
    setOpen(false);
    setContractAddress(undefined);
    setFormValue(undefined);
    router.replace('/contract-wizard');
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <CreateTokenDialog
        dialogProps={{
          open: open,
          onClose: handleCloseCreate,
          fullWidth: true,
          maxWidth: 'xs',
        }}
        isLoading={createTokenMutation.isLoading}
        isDone={createTokenMutation.isSuccess}
        chainId={chainId}
        contractAddress={contractAddress}
        transactionHash={transactionHash}
      />
      <AppConfirmDialog
        dialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        onConfirm={handleCreateConfirm}
        title={
          <FormattedMessage
            id="creating.token"
            defaultMessage="Creating token"
          />
        }
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.create.this.token"
            defaultMessage="Do you really want to create this token?"
          />
        </Typography>
      </AppConfirmDialog>
      <MainLayout>
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
                      id="contract.generator"
                      defaultMessage="Contract generator"
                    />
                  ),
                  uri: '/contract-wizard',
                },
                {
                  caption: (
                    <FormattedMessage id="tokens" defaultMessage="Tokens" />
                  ),
                  uri: '/contract-wizard/tokens',
                },
                {
                  caption: (
                    <FormattedMessage id="create" defaultMessage="Create" />
                  ),
                  uri: '/contract-wizard/tokens/create',
                },
              ]}
            />

            <Box>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={8}>
                  <Box>
                    <Card>
                      <CardContent>
                        <Formik
                          onSubmit={handleFormSubmit}
                          initialValues={INITIAL_VALUES}
                          validationSchema={TokenFormSchema}
                        >
                          {({ submitForm }) => (
                            <Form>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Field
                                    component={TextField}
                                    name="name"
                                    fullWidth
                                    label={
                                      <FormattedMessage
                                        id="name"
                                        defaultMessage="Name"
                                      />
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Field
                                    component={TextField}
                                    name="symbol"
                                    label={
                                      <FormattedMessage
                                        id="symbol"
                                        defaultMessage="Symbol"
                                      />
                                    }
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Field
                                    component={TextField}
                                    name="maxSupply"
                                    type="number"
                                    label={
                                      <FormattedMessage
                                        id="max.supply"
                                        defaultMessage="Max Supply"
                                      />
                                    }
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    onClick={() => submitForm()}
                                    variant="contained"
                                    color="primary"
                                  >
                                    <FormattedMessage
                                      id="create"
                                      defaultMessage="Create"
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            </Form>
                          )}
                        </Formik>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Container>
      </MainLayout>
    </>
  );
};

export default WizardCreateTokenPage;
