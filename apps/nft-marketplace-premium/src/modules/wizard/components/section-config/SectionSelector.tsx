import SearchIcon from '@mui/icons-material/Search';
import { ButtonBase, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
export function SectionSelector() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid container item xs={12} justifyContent={'center'}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-search">
                <FormattedMessage id={'search'} defaultMessage={'Search'} />
              </InputLabel>
              <OutlinedInput
                id="outlined-search"
                label={
                  <FormattedMessage id={'search'} defaultMessage={'Search'} />
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="search" edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="All" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
              <Tab label="Item Four" />
              <Tab label="Item Five" />
              <Tab label="Item Six" />
              <Tab label="Item Seven" />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            {/*  <Box
              sx={{
                border: '1px solid',
                width: '121px',
                height: '112px',
                borderRadius: '8px',
              }}
              component="button"
              justifyContent={'center'}
              alignContent={'center'}
              alignItems={'center'}
              display={'flex'}
              flexDirection={'column'}
            >
              <SearchIcon />

              <Typography variant="subtitle2">
                {' '}
                <FormattedMessage id={'search'} defaultMessage={'Search'} />
              </Typography>
            </Box>*/}
            {/* <Button
              sx={{
                border: '1px solid',
                width: '121px',
                height: '112px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                spacing={1}
              >
                <SearchIcon />

                <Typography variant="body2">
                  {' '}
                  <FormattedMessage id={'search'} defaultMessage={'Search'} />
                </Typography>
              </Stack>
            </Button>*/}
            <ButtonBase
              sx={{
                border: '1px solid',
                width: '121px',
                height: '112px',
                borderRadius: '8px',
                borderColor: 'text.secondary',
              }}
            >
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                spacing={1}
              >
                <SearchIcon fontSize="large" />

                <Typography variant="body2">
                  {' '}
                  <FormattedMessage id={'search'} defaultMessage={'Search'} />
                </Typography>
              </Stack>
            </ButtonBase>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
