import { UserContainer } from '@/modules/user/componentes/UserContainer';
import Box from '@mui/material/Box';

export function User() {
  return (
    <Box py={4}>
      <UserContainer
        username="test"
        bio={'a very long long long bio'}
        shortBio={'Best in place'}
      />
    </Box>
  );
}

export default User;
