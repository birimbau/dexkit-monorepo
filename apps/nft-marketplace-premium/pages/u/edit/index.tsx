import { UserEditContainer } from '@/modules/user/componentes/containers/UserEditContainer';
import { GET_USER_BY_USERNAME_QUERY } from '@/modules/user/hooks';
import { getUserByUsername } from '@/modules/user/services';
import Box from '@mui/material/Box';
import { QueryClient } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';

const UserEdit: NextPage<{ username: string }> = ({ username }) => {
  return (
    <AuthMainLayout disablePadding>
      <Box py={4}>
        <UserEditContainer username={username} />
      </Box>
    </AuthMainLayout>
  );
};

type Params = {
  username?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const { data } = await getUserByUsername(params?.username);

  await queryClient.prefetchQuery(
    [GET_USER_BY_USERNAME_QUERY, params?.username],
    async () => data
  );

  return {
    props: {
      //  dehydratedState: dehydrate(queryClient),
      // username: params?.username,
    },
    revalidate: 3000,
  };
};

export default UserEdit;
