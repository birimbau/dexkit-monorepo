import { UserLogin } from '@/modules/user/componentes/containers/UserLogin';
import Box from '@mui/material/Box';
import { NextPage } from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';

export const UserLoginPage: NextPage = () => {
  return (
    <AuthMainLayout disablePadding>
      <Box py={4}>
        <UserLogin />
      </Box>
    </AuthMainLayout>
  );
};

export default UserLoginPage;
