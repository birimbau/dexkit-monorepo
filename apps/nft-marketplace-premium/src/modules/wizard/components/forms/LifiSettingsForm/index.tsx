import { Token } from '@dexkit/core/types';
import { Button, Grid } from '@mui/material';
import { Formik, useFormikContext } from 'formik';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import LifiMultiTokenInput from './LifiMultiTokenInput';
import LifiTokenInput from './LifiTokenInput';

function SaveOnChangeListener({
  onSave,
  onValidate,
}: {
  onSave: (settings: any) => void;
  onValidate?: (isValid: boolean) => void;
}) {
  const { values, isValid } = useFormikContext<any>();

  useEffect(() => {
    onSave(values);
  }, [values, isValid]);

  useEffect(() => {
    if (onValidate) {
      onValidate(isValid);
    }
  }, [isValid, onValidate]);

  return null;
}

export interface LifiSettingsFormProps {
  tokens: Token[];
  saveOnChange?: boolean;
  onSave: () => void;
  onValidate: (value: boolean) => void;
}

export default function LifiSettingsForm({
  tokens,
  saveOnChange,
  onValidate,
  onSave,
}: LifiSettingsFormProps) {
  const handleSubmit = () => {};

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      {({ submitForm, isSubmitting, isValid }) => (
        <>
          {saveOnChange && (
            <SaveOnChangeListener onSave={onSave} onValidate={onValidate} />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LifiMultiTokenInput
                name="featuredTokens"
                tokens={tokens}
                label={
                  <FormattedMessage
                    id="featured.tokens"
                    defaultMessage="Featured tokens"
                  />
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LifiTokenInput
                label={
                  <FormattedMessage
                    id="default.from.token"
                    defaultMessage="Default from Token"
                  />
                }
                name="fromToken"
                tokens={tokens}
              />
            </Grid>
            <Grid item xs={12}>
              <LifiTokenInput
                label={
                  <FormattedMessage
                    id="default.to.token"
                    defaultMessage="Default to Token"
                  />
                }
                name="toToken"
                tokens={tokens}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={isSubmitting || isValid}
                onClick={submitForm}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Formik>
  );
}
