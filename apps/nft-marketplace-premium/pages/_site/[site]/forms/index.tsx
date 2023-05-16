import ContractButton from '@/modules/forms/components/ContractButton';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';

export default function FormsPage() {
  const router = useRouter();

  const handleCreateCustom = () => {
    router.push('/forms/create');
  };

  const { account } = useWeb3React();

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
                caption: <FormattedMessage id="forms" defaultMessage="Forms" />,
                uri: '/forms',
                active: true,
              },
            ]}
          />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box>
                  <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h4">
                        <FormattedMessage
                          id="web3forms.deplopy"
                          defaultMessage="Web3Forms Deploy"
                        />
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <FormattedMessage
                          id="explore.our.new.took.web3forms.deploy"
                          defaultMessage="Explore our new tool: Web3Forms deploy"
                        />
                      </Typography>
                    </Box>
                    <Button
                      LinkComponent={Link}
                      href={`/forms/account/${account}`}
                      variant="outlined"
                    >
                      <FormattedMessage
                        id="my.forms"
                        defaultMessage="My forms"
                      />
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="available.now"
                    defaultMessage="Available Now"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <ContractButton
                      onClick={handleCreateCustom}
                      title={
                        <FormattedMessage id="custom" defaultMessage="Custom" />
                      }
                      description={
                        <FormattedMessage
                          id="create.custom.form"
                          defaultMessage="Create custom form"
                        />
                      }
                      creator={{ imageUrl: '', name: 'DexKit' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="coming.soon"
                    defaultMessage="Coming soon"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <ContractButton
                      title="Token"
                      description=""
                      creator={{ imageUrl: '', name: 'DexKit' }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ContractButton
                      title="NFT Collection"
                      description="create a nft collection"
                      creator={{ imageUrl: '', name: 'DexKit' }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ContractButton
                      title="Airdrop"
                      description="create an airdrop"
                      creator={{ imageUrl: '', name: 'DexKit' }}
                      disabled
                    />
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

(FormsPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};
