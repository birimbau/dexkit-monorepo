import LazyTextField from '@dexkit/ui/components/LazyTextField';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'src/components/Link';
import { useAppRankingListQuery } from '../../hooks';
import RankingFormCard from '../RankingFormCard';

interface Props {
  onSave: ({ rankingId }: { rankingId?: number }) => void;
  onChange: ({ rankingId }: { rankingId?: number }) => void;
  onCancel: () => void;
  rankingId?: number;
  hideFormInfo?: boolean;
  saveOnChange?: boolean;
  showSaveButton?: boolean;
}

export function RankingSectionForm({
  onSave,
  onChange,
  onCancel,
  rankingId,
  hideFormInfo,
  saveOnChange,
  showSaveButton,
}: Props) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {},
  });

  const listRankingQuery = useAppRankingListQuery({
    ...paginationModel,
    ...queryOptions,
    siteId: siteId,
  });

  const [selectedRankingId, setSelectedRankingId] = useState<number>();

  const [hideInfo, setHideInfo] = useState<boolean>(false);

  const handleChange = (value: string) => {
    setQueryOptions({ ...queryOptions, q: value });
  };

  const handleClick = useCallback(
    (id: number) => {
      setSelectedRankingId(id);

      if (saveOnChange && id) {
        onChange({ rankingId: id });
      }
    },
    [saveOnChange, hideInfo],
  );

  const handleSave = useCallback(() => {
    if (selectedRankingId) {
      onSave({ rankingId: selectedRankingId });
    }
  }, [onSave, selectedRankingId]);

  const handleChangeHideInfo = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (saveOnChange && selectedRankingId) {
        onChange({ rankingId: selectedRankingId });
      }
      setHideInfo(e.target.checked);
    },
    [saveOnChange, selectedRankingId],
  );

  useEffect(() => {
    if (!selectedRankingId) {
      setSelectedRankingId(rankingId);
    }
  }, [rankingId]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              fullWidth: true,
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {listRankingQuery.data?.data.map((ranking) => (
              <Grid key={ranking.id} item xs={12}>
                <RankingFormCard
                  id={ranking.id}
                  description={ranking?.description}
                  title={ranking?.title}
                  selected={selectedRankingId === ranking.id}
                  onClick={handleClick}
                />
              </Grid>
            ))}
            {listRankingQuery.isLoading &&
              new Array(5).fill(null).map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">
                        <Skeleton />
                      </Typography>
                      <Typography variant="body1">
                        <Skeleton />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            {listRankingQuery.data &&
              listRankingQuery.data?.data.length === 0 && (
                <Grid item xs={12}>
                  <Box py={2}>
                    <Stack spacing={2} alignItems="center">
                      <TipsAndUpdatesIcon fontSize="large" />
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="you.dont.have.any.leaderboards"
                            defaultMessage="You don't have any leaderboards yet"
                          />
                        </Typography>
                        <Typography align="center" variant="body1">
                          <FormattedMessage
                            id="please.create.a.leaderboard.to.start.using.it.here"
                            defaultMessage="Please, create a leaderboard to start using it here"
                          />
                        </Typography>
                      </Box>
                      {false && (
                        <Button
                          LinkComponent={Link}
                          href="/forms/create"
                          variant="contained"
                          color="primary"
                          target="_blank"
                          startIcon={<AddIcon />}
                        >
                          <FormattedMessage
                            id="create.form"
                            defaultMessage="Create form"
                          />
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              )}
          </Grid>
        </Grid>

        {showSaveButton && (
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <Button
                  onClick={handleSave}
                  disabled={selectedRankingId === undefined}
                  variant="contained"
                  color="primary"
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
