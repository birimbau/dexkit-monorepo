import { UserContainer } from '@/modules/user/componentes/UserContainer';
import Box from '@mui/material/Box';
import { NextPage } from 'next';

const User: NextPage = () => {
  return (
    <Box py={4}>
      <UserContainer
        username="test"
        bio={'a very long long long bio'}
        shortBio={'Best in place'}
      />
    </Box>
  );
};

export default User;
