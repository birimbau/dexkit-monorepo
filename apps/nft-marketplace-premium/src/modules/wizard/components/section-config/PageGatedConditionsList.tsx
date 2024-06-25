import { Grid } from '@mui/material';

import { GatedCondition } from '@dexkit/ui/modules/wizard/types';

import PageGatedConditionsListItem from './PageGatedConditionsListItem';

export interface PageGatedConditionsListProps {
  conditions: GatedCondition[];
}

export default function PageGatedConditionsList({
  conditions,
}: PageGatedConditionsListProps) {
  return (
    <Grid container spacing={2}>
      {conditions.map((cond, index) => (
        <Grid item xs={12} key={index}>
          <PageGatedConditionsListItem condition={cond} index={index} />
        </Grid>
      ))}
    </Grid>
  );
}
