import { Grid } from '@mui/material';

import { GatedCondition } from '@dexkit/ui/modules/wizard/types';

import PageGatedConditionsListItem from './PageGatedConditionsListItem';

export interface PageGatedConditionsListProps {
  conditions: GatedCondition[];
  onAction: (index: number, action: string) => void;
}

export default function PageGatedConditionsList({
  conditions,
  onAction,
}: PageGatedConditionsListProps) {
  const handleAction = (index: number, action: string) => {
    return () => {
      onAction(index, action);
    };
  };

  return (
    <Grid container spacing={2}>
      {conditions.map((cond, index) => (
        <Grid item xs={12} key={index}>
          <PageGatedConditionsListItem
            condition={cond}
            index={index}
            onRemove={handleAction(index, 'remove')}
            onEdit={handleAction(index, 'edit')}
          />
        </Grid>
      ))}
    </Grid>
  );
}
