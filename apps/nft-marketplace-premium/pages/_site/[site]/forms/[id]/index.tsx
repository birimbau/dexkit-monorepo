import ShareDialog from '@/modules/nft/components/dialogs/ShareDialog';
import {
  getBlockExplorerUrl,
  isAddressEqual,
  truncateAddress,
} from '@dexkit/core/utils';
import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShareIcon from '@mui/icons-material/Share';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  NoSsr,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { getWindowUrl } from 'src/utils/browser';
import { useFormQuery } from '../../../../../src/modules/forms/hooks';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EditIcon from '@mui/icons-material/Edit';
import { useWeb3React } from '@web3-react/core';
import NextLink from 'next/link';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormPage() {
  const router = useRouter();

  const { id } = router.query;

  const formQuery = useFormQuery({
    id: id ? parseInt(id as string) : undefined,
  });

  const [showShare, setShowShare] = useState(false);

  const handleCloseShare = () => {
    setShowShare(false);
  };

  const handleShowShare = () => {
    setShowShare(true);
  };

  const { account } = useWeb3React();

  const handleEdit = () => {
    router.push(`/forms/${formQuery.data?.id}/edit`);
  };

  return (
    <>
      <ShareDialog
        dialogProps={{
          open: showShare,
          onClose: handleCloseShare,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        url={`${getWindowUrl()}/forms/${formQuery.data?.id}`}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <NoSsr>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
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
                        id="form.name"
                        defaultMessage="Form: {name}"
                        values={{
                          name: formQuery.data?.name,
                        }}
                      />
                    ),
                    uri: '/forms/deploy/nft',
                    active: true,
                  },
                ]}
              />
            </NoSsr>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5">
                      {formQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        formQuery.data?.name
                      )}
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                      {formQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        formQuery.data?.description
                      )}
                    </Typography>
                  </Box>
                  <Stack
                    spacing={0.5}
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                  >
                    <Avatar sx={{ width: '1rem', height: '1rem' }} />
                    <Link
                      component={NextLink}
                      href={`/forms/account/${formQuery.data?.creatorAddress}`}
                      variant="body2"
                    >
                      {formQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        truncateAddress(formQuery.data?.creatorAddress)
                      )}
                    </Link>
                  </Stack>
                  <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                  >
                    <Button
                      size="small"
                      onClick={handleShowShare}
                      variant="contained"
                      startIcon={<ShareIcon />}
                    >
                      <FormattedMessage id="share" defaultMessage="Share" />
                    </Button>
                    {isAddressEqual(
                      formQuery.data?.creatorAddress,
                      account
                    ) && (
                      <Button
                        onClick={handleEdit}
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Button>
                    )}
                    {formQuery.data?.templateId && (
                      <Button
                        size="small"
                        href={`/forms/templates/${formQuery.data?.templateId}`}
                        variant="outlined"
                        startIcon={<AccountTreeIcon />}
                      >
                        <FormattedMessage
                          id="view.template"
                          defaultMessage="View template"
                        />
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ReceiptLongIcon />}
                      target="_blank"
                      href={`${getBlockExplorerUrl(
                        formQuery.data?.params.chainId
                      )}/address/${formQuery.data?.params.contractAddress}`}
                    >
                      <FormattedMessage
                        id="block.explorer"
                        defaultMessage="Block explorer"
                      />
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {formQuery.data?.params ? (
              <ContractFormView params={formQuery.data?.params} />
            ) : (
              <Box sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                >
                  <CircularProgress color="primary" />
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

(FormPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
