import {
  Alert,
  Backdrop,
  CircularProgress,
  Grid,
  useTheme,
} from '@mui/material';

import { NextPage } from 'next';
import AuthMainLayout from '../../src/components/layouts/authMain';

import { useRouter } from 'next/router';
import { useWhitelabelConfigQuery } from '../../src/hooks/whitelabel';
import { EditWizardContainer } from '../../src/modules/wizard/components/containers/EditWizardContainer';

export const WizardPage: NextPage = () => {
  const router = useRouter();
  const { site } = router.query;
  const {
    data: config,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useWhitelabelConfigQuery({
    domain: site as string,
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
      <EditWizardContainer site={config} />
    </>
  );
};

(WizardPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

export default WizardPage;
