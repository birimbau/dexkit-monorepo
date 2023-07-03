import ContractButton from '@/modules/forms/components/ContractButton';
import { THIRDWEB_ICON_URL } from '@dexkit/web3forms/constants';
import WalletIcon from '@mui/icons-material/Wallet';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useConnectWalletDialog } from 'src/hooks/app';

const THIRDWEB_CONTRACT_LIST: {
  name: string;
  description: string;
  publisherIcon: string;
  publisherName: string;
  slug: string;
}[] = [
  {
    name: 'Token',
    description:
      'The Token contract is suited for creating a digital currency and is compliant with the ERC20 standard.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'TokenERC20',
  },
  {
    name: 'StakeERC721',
    description:
      'This contract allows users to stake their ERC-721 NFTs and get ERC-20 tokens as staking rewards.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'NFTStake',
  },
  {
    name: 'Marketplace',
    description:
      'A Marketplace is a contract where you can buy and sell NFTs, such as OpenSea or Rarible.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'MarketplaceV3',
  },
  {
    name: 'NFT Drop',
    description:
      'The NFT Drop contract is ideal when you want to release a collection of unique NFTs using the ERC721A Standard.',
    publisherIcon: THIRDWEB_ICON_URL,
    publisherName: 'ThirdWeb',
    slug: 'DropERC721',
  },
];

export default function FormsPage() {
  const router = useRouter();

  const handleCreateCustom = () => {
    router.push('/forms/create');
  };

  const { account, isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => connectWalletDialog.setOpen(true);

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
                          defaultMessage="DexGenerator"
                        />
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        <FormattedMessage
                          id="explore.our.new.tool.dexgenerator"
                          defaultMessage="Explore our new tool: DexGenerator"
                        />
                      </Typography>
                    </Box>
                    {isActive ? (
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
                    ) : (
                      <Button
                        onClick={handleConnectWallet}
                        variant="outlined"
                        startIcon={<WalletIcon />}
                      >
                        <FormattedMessage
                          id="connect.wallet"
                          defaultMessage="Connect wallet"
                        />
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="forms.by.dexkit"
                    defaultMessage="Forms by Dexkit"
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
                      creator={{
                        imageUrl:
                          'https://raw.githubusercontent.com/DexKit/assets/main/images/logo_256x256.png',
                        name: 'DexKit',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <FormattedMessage
                    id="deploy.thirdweb.contracts"
                    defaultMessage="Deploy ThirdWeb Contracts"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {THIRDWEB_CONTRACT_LIST.map((contract, key) => (
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
                            `/forms/deploy/thirdweb/${contract.slug}`
                          );
                        }}
                      />
                    </Grid>
                  ))}
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
