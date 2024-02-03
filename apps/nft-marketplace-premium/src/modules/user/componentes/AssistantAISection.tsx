import { Card, CardContent, Grid } from '@mui/material';
import { usePlanCheckoutMutation } from '../hooks/payments';
import PlanCard from './PlanCard';

export default function AssitantAISection() {
  const { mutateAsync: checkoutPlan } = usePlanCheckoutMutation();

  const handleCheckoutStarter = (plan: string) => {
    return async () => {
      const result = await checkoutPlan({ plan });

      if (result && result?.url) {
        window.open(result.url, '_blank');
      }
    };
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <PlanCard
                name="Starter"
                price={10.0}
                description="Better to start"
                onClick={handleCheckoutStarter('starter')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PlanCard
                name="Plus"
                price={20.0}
                description="Better to start"
                onClick={handleCheckoutStarter('plus')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PlanCard
                name="Premium"
                price={50.0}
                description="Better to start"
                onClick={handleCheckoutStarter('premium')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
