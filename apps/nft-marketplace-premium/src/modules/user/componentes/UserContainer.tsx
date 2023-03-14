import { Search } from '@mui/icons-material';
import {
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { UserOptions } from '../types';
import { UserHeader } from './UserHeader';

export function UserContainer({
  username,
  shortBio,
  backgroundImageURL,
  profileImageURL,
  bio,
}: UserOptions) {
  const { formatMessage } = useIntl();
  const { account } = useWeb3React();
  const [search, setSearch] = useState<string>();
  const [openAssetOrderDialog, setOpenAssetOrderDialog] = useState(false);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UserHeader
              profileImageURL={profileImageURL}
              backgroundImageURL={backgroundImageURL}
              username={username}
              bio={bio}
              shortBio={shortBio}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              alignContent="center"
            ></Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} xl={3}>
            <TextField
              fullWidth
              size="small"
              type="search"
              value={search}
              onChange={handleChangeSearch}
              placeholder={formatMessage({
                id: 'search.in.store',
                defaultMessage: 'Search in store',
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}></Grid>
        </Grid>
      </Container>
    </>
  );
}
