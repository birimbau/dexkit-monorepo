import { Alert, Button, Grid, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useAppRankingQuery } from '../hooks';

interface Props {
  rankingId?: number;
}

export function ExportRanking({ rankingId }: Props) {
  const { data } = useAppRankingQuery({
    rankingId: rankingId,
  });

  const exportJSONData = () => {
    if (typeof window !== 'undefined' && data) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data.data),
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `leaderboard-${data.ranking?.title}.json`;

      link.click();
    }
  };

  const exporCSVData = () => {
    if (typeof window !== 'undefined' && data) {
      const csvData = [
        ['address', 'quantity'],
        ...data.data.map((item) => [item.account, item.points]),
      ]
        .map((e) => e.join(','))
        .join('\n');

      const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(
        csvData,
      )}`;
      const link = document.createElement('a');
      link.href = csvString;
      link.download = `leaderboard-${data.ranking?.title}.csv`;

      link.click();
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info">
          <FormattedMessage
            id={'csv.file.to.import.on.aidrop.contract'}
            defaultMessage={'CSV file to be imported on airdrop contracts'}
          ></FormattedMessage>
        </Alert>
      </Grid>
      <Grid item xs={12}>
        <Stack direction={'row'} spacing={2}>
          <Button onClick={exporCSVData} variant="contained">
            <FormattedMessage
              id={'export.leaderboard.as.csv'}
              defaultMessage={'Export leaderboard as CSV'}
            ></FormattedMessage>
          </Button>
          {false && (
            <Button onClick={exportJSONData} variant="contained">
              <FormattedMessage
                id={'export.leaderboard.as.json'}
                defaultMessage={'Export leaderboard as JSON'}
              ></FormattedMessage>
            </Button>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
