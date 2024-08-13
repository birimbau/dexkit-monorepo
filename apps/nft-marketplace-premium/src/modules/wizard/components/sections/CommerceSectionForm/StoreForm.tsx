import { CommerceContent } from '@dexkit/ui/modules/wizard/types/section';
import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';

export default function StoreForm() {
  const {} = useFormikContext<CommerceContent>();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}></Grid>
    </Grid>
  );
}
