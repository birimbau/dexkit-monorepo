import { Button, Container } from '@mui/material';

import { useExecuteTransactionsDialog } from '@dexkit/ui';
import { useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { useErc20ApproveMutationV2 } from 'src/hooks/balances';
import { getAppConfig } from 'src/services/app';

const useApprove = () => {
  return useMutation(async () => {
    return new Promise<string>((resolve, reject) =>
      setTimeout(() => {
        resolve(
          '0x2991f4b19414c2c3405888516c82042efdcc5d85bae11e79df7f51f42462563c',
        );
      }, 3000),
    );
  });
};

export default function TestPage() {
  const { chainId, provider } = useWeb3React();

  const approveMutation = useErc20ApproveMutationV2(provider);

  const txDialog = useExecuteTransactionsDialog();

  const handleApprove = () => {
    txDialog.execute([
      {
        action: async () => {
          const hash = await approveMutation.mutateAsync({
            amount: BigNumber.from('1000000'),
            spender: '0xc06622625A4FeFF0bee250D078e5e27f0B24398B',
            tokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          });

          return { hash };
        },
        title: { defaultMessage: 'Approve', id: 'Approve' },
        icon: 'receipt',
      },
      {
        action: async () => {
          return await approveMutation.mutateAsync({
            amount: BigNumber.from('1000000'),
            spender: '0xc06622625A4FeFF0bee250D078e5e27f0B24398B',
            tokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          });
        },
        title: { defaultMessage: 'Approve', id: 'Approve' },
        icon: 'receipt',
      },
    ]);
  };

  return (
    <Container>
      <Button onClick={handleApprove}>
        <FormattedMessage id="approve" defaultMessage="approve" />
      </Button>
    </Container>
  );
}

(TestPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      ...configResponse,
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
