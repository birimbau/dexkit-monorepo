import {
  Alert,
  Backdrop,
  CircularProgress,
  Grid,
  useTheme,
} from '@mui/material';

import { NextPage } from 'next';
import { EditWizardContainer } from '../../../src/modules/wizard/components/containers/EditWizardContainer';
import { useRouter } from 'next/router';
import AuthMainLayout from '../../../src/components/layouts/authMain';
import { useWhitelabelConfigQuery } from '../../../src/hooks/whitelabel';

export const WizardEditPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const {
    data: site,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useWhitelabelConfigQuery({
    slug: slug as string,
  });

  const theme = useTheme();

  return (
    <>
      <Backdrop
        sx={{
          color: theme.palette.primary.main,
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={isConfigLoading}
      >
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
      {isConfigError && (
        <Grid item xs={12}>
          <Alert severity="error">{String(configError)}</Alert>
        </Grid>
      )}
      <EditWizardContainer site={site} />
    </>
  );
};

(WizardEditPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default WizardEditPage;
