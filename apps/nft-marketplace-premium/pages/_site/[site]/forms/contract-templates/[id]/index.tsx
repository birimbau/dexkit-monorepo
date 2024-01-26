import DeployContractDialog from '@/modules/forms/components/DeployContractDialog';
import {
  useFormTemplateQuery,
  useListTemplateInstances,
} from '@/modules/forms/hooks';
import ShareIcon from '@mui/icons-material/Share';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
import { PageHeader } from 'src/components/PageHeader';
import AuthMainLayout from 'src/components/layouts/authMain';

import { isAddressEqual, truncateAddress } from '@dexkit/core/utils';
import ShareDialog from '@dexkit/ui/components/dialogs/ShareDialog';
import { useState } from 'react';
import { getWindowUrl } from 'src/utils/browser';

import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import { netToQuery } from '@dexkit/ui/utils/networks';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Link from 'src/components/Link';
import { getAppConfig } from 'src/services/app';

export default function TemplatePage() {
  const { getBlockExplorerUrl, NETWORK_NAME } = useNetworkMetadata();

  const router = useRouter();

  const [showShare, setShowShare] = useState(false);

  const handleCloseShare = () => {
    setShowShare(false);
  };

  const handleShowShare = () => {
    setShowShare(true);
  };

  const { account } = useWeb3React();
  const { id } = router.query;

  const formTemplateQuery = useFormTemplateQuery({
    id: id ? parseInt(id as string) : undefined,
  });

  const [showDeploy, setShowDeploy] = useState(false);

  const handleShowDeploy = () => {
    setShowDeploy(true);
  };

  const handleCloseDeploy = () => {
    setShowDeploy(false);
  };

  const handleEdit = () => {};

  const templateInstancesQuery = useListTemplateInstances({
    templateId: id ? parseInt(id as string) : undefined,
  });

  return (
    <>
      <DeployContractDialog
        DialogProps={{
          open: showDeploy,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleCloseDeploy,
        }}
        templateId={formTemplateQuery.data?.id}
        bytecode={formTemplateQuery.data?.bytecode || ''}
        abi={formTemplateQuery.data?.abi || []}
        name={formTemplateQuery.data?.name}
        description={formTemplateQuery.data?.description}
      />
      <ShareDialog
        dialogProps={{
          open: showShare,
          onClose: handleCloseShare,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        url={`${getWindowUrl()}/forms/contract-templates/${formTemplateQuery
          .data?.id}`}
      />
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
                      id="contract.templates"
                      defaultMessage="Contract Templates"
                    />
                  ),
                  uri: `/forms/contract-templates`,
                },
                {
                  caption: formTemplateQuery.data?.name,
                  uri: `/forms/contract-templates/${formTemplateQuery.data?.id}`,
                  active: true,
                },
              ]}
            />
          </NoSsr>
          <Box>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h5">
                      {formTemplateQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        formTemplateQuery.data?.name
                      )}
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                      {formTemplateQuery.isLoading ? (
                        <Skeleton />
                      ) : (
                        formTemplateQuery.data?.description
                      )}
                    </Typography>
                  </Box>
                  {formTemplateQuery.isLoading ? (
                    <Skeleton />
                  ) : (
                    <Box>
                      <FormattedMessage
                        id="created.by.address"
                        defaultMessage="Created by: {address}"
                        values={{
                          address: (
                            <Link
                              href={`/forms/account/${formTemplateQuery.data?.creatorAddress}`}
                              variant="body2"
                            >
                              {truncateAddress(
                                formTemplateQuery.data?.creatorAddress,
                              )}
                            </Link>
                          ),
                        }}
                      />
                    </Box>
                  )}
                  <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                  >
                    <Button
                      size="small"
                      startIcon={<UpgradeIcon />}
                      onClick={handleShowDeploy}
                      variant="contained"
                    >
                      <FormattedMessage id="deploy" defaultMessage="Deploy" />
                    </Button>

                    <Button
                      size="small"
                      onClick={handleShowShare}
                      variant="outlined"
                      startIcon={<ShareIcon />}
                    >
                      <FormattedMessage id="share" defaultMessage="Share" />
                    </Button>

                    {isAddressEqual(
                      formTemplateQuery.data?.creatorAddress,
                      account,
                    ) && (
                      <Button
                        size="small"
                        LinkComponent={Link}
                        href={`/forms/contract-templates/${formTemplateQuery.data?.id}/edit`}
                        variant="outlined"
                        startIcon={<EditIcon />}
                      >
                        <FormattedMessage id="edit" defaultMessage="Edit" />
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Typography variant="h5">
            <FormattedMessage
              id="contract.instances"
              defaultMessage="Contract instances"
            />
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="name" defaultMessage="Name" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="network" defaultMessage="Network" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="address" defaultMessage="Address" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="creator" defaultMessage="Creator" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="actions" defaultMessage="Actions" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templateInstancesQuery.data?.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.name}</TableCell>
                    <TableCell>{NETWORK_NAME(instance.chainId)}</TableCell>
                    <TableCell>
                      <Link
                        target="_blank"
                        href={`${getBlockExplorerUrl(
                          instance.chainId,
                        )}/address/${instance.address}`}
                      >
                        {truncateAddress(instance.address)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        target="_blank"
                        href={`${getBlockExplorerUrl(
                          instance.chainId,
                        )}/address/${instance.creatorAddress}`}
                      >
                        {truncateAddress(instance.creatorAddress)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        LinkComponent={Link}
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        href={`/forms/create?contractAddress=${instance.address}&templateId=${formTemplateQuery.data?.id}&chainId=${instance.chainId}`}
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
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </>
  );
}

(TemplatePage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout>{page}</AuthMainLayout>;
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

type Params = {
  site?: string;
  id?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  const queryClient = new QueryClient();

  await netToQuery({
    queryClient,
    instance: dexkitNFTapi,
    siteId: configResponse.siteId,
  });

  return {
    props: { ...configResponse, dehydratedState: dehydrate(queryClient) },
  };
};
