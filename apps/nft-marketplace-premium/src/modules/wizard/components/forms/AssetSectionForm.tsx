import { Formik } from 'formik';

import { Box, Button, Grid, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AssetPageSection } from '../../types/section';

export interface AssetSectionFormProps {
  onCancel: () => void;
  onSave: (section: AssetPageSection) => void;
  onChange: (section: AssetPageSection) => void;
  section?: AssetPageSection;
  showSaveButton?: boolean;
}

export default function AssetSectionForm({
  onCancel,
  onSave,
  onChange,
  section,
  showSaveButton,
}: AssetSectionFormProps) {
  const handleSubmit = async (values: {
    html: string;
    js: string;
    css: string;
  }) => {
    onSave({ type: 'asset-section', config: values });
  };

  const handleValidate = (values: any) => {
    onChange({ type: 'asset-section', config: values });
  };

  return (
    <Formik
      initialValues={{
        html: section?.config.html || '',
        js: section?.config.js || '',
        css: section?.config.css || '',
      }}
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ setFieldValue, values, isValid, submitForm }) => (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}></Grid>
            {showSaveButton && (
              <Grid item xs={12}>
                <Box>
                  <Stack justifyContent="flex-end" direction="row" spacing={1}>
                    <Button
                      disabled={!isValid}
                      onClick={submitForm}
                      variant="contained"
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
        </>
      )}
    </Formik>
  );
}
