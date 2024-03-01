import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Field, Formik } from "formik";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { FormattedMessage } from "react-intl";

import { TextField } from "formik-mui";

import * as Yup from "yup";
import { TextImproveAction } from "../../constants/ai";
import ImproveTextActionList from "./ImproveTextActionList";

const FormScheme = Yup.object({
  prompt: Yup.string().required(),
  action: Yup.mixed<TextImproveAction>()
    .oneOf(Object.values(TextImproveAction))
    .required(),
});

export interface CompletationFormProps {
  onGenerate: (prompt: string, action?: TextImproveAction) => Promise<void>;
  output?: string;
  initialPrompt?: string;
  onConfirm: () => void;
}

export default function CompletationForm({
  onGenerate,
  output,
  initialPrompt,
  onConfirm,
}: CompletationFormProps) {
  const handleSubmit = async ({
    prompt,
    action,
  }: {
    prompt: string;
    action?: TextImproveAction;
  }) => {
    await onGenerate(prompt, action);
  };

  return (
    <Formik
      initialValues={{ prompt: initialPrompt ? initialPrompt : "" }}
      onSubmit={handleSubmit}
      validationSchema={FormScheme}
    >
      {({ submitForm, isSubmitting, values, isValid, setFieldValue }) => (
        <Stack spacing={1}>
          <Field
            component={TextField}
            variant="outlined"
            name="prompt"
            fullWidth
            label={<FormattedMessage id="prompt" defaultMessage="Prompt" />}
          />
          {(output || isSubmitting) && (
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                {isSubmitting ? (
                  <Skeleton />
                ) : (
                  <>
                    <FormattedMessage id="answer" defaultMessage="Answer:" />{" "}
                    {output}
                  </>
                )}
              </Typography>
              {output && (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={onConfirm}
                      size="small"
                    >
                      <FormattedMessage id="use" defaultMessage="use" />
                    </Button>
                    <Button
                      onClick={() => setFieldValue("prompt", output)}
                      size="small"
                      variant="outlined"
                    >
                      <FormattedMessage
                        id="use.as.prompt"
                        defaultMessage="use as prompt"
                      />
                    </Button>
                  </Stack>
                  <Divider />
                </Stack>
              )}
            </Stack>
          )}
          <Box>
            <ImproveTextActionList
              value={values.action}
              onChange={(value: string) => {
                if (value === values.action) {
                  return setFieldValue("action", undefined);
                }
                setFieldValue("action", value);
              }}
            />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="flex-end">
              <Button
                onClick={submitForm}
                disabled={isSubmitting || !values.action || !isValid}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size="1rem" color="inherit" />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                variant="contained"
              >
                <FormattedMessage id="confirm" defaultMessage="Confirm" />
              </Button>
            </Stack>
          </Box>
        </Stack>
      )}
    </Formik>
  );
}
