import {
  Backdrop,
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

import { Decimal } from "decimal.js";

import { useMemo, useState } from "react";
import * as Yup from "yup";
import { TextImproveAction } from "../../constants/ai";
import { useActiveFeatUsage, useSubscription } from "../../hooks/payments";
import AddCreditDialog from "../dialogs/AddCreditDialog";
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
  multiline?: boolean;
}

export default function CompletationForm({
  onGenerate,
  output,
  initialPrompt,
  onConfirm,
  multiline,
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

  const { data: sub, refetch: refetchSub } = useSubscription();

  const { data: featUsage, refetch: refetchFeatUsage } = useActiveFeatUsage();

  const total = useMemo(() => {
    if (sub && featUsage) {
      return new Decimal(featUsage?.available)
        .minus(new Decimal(featUsage?.used))
        .add(
          new Decimal(sub?.creditsAvailable).minus(
            new Decimal(sub?.creditsUsed)
          )
        )
        .toNumber();
    }

    return 0;
  }, [featUsage, sub]);

  const [showAddCredits, setShowAddCredits] = useState(false);
  const handleAddCredits = async () => {
    setShowAddCredits(true);
  };

  const handleClose = () => {
    setShowAddCredits(false);
    refetchSub();
    refetchFeatUsage();
  };

  return (
    <>
      <AddCreditDialog
        DialogProps={{
          open: showAddCredits,
          onClose: handleClose,
          maxWidth: "sm",
          fullWidth: true,
        }}
      />
      <Box sx={{ position: "relative", p: 2 }}>
        <Formik
          initialValues={{ prompt: initialPrompt ? initialPrompt : "" }}
          onSubmit={handleSubmit}
          validationSchema={FormScheme}
        >
          {({ submitForm, isSubmitting, values, isValid, setFieldValue }) => (
            <Stack spacing={2}>
              <Field
                component={TextField}
                variant="outlined"
                name="prompt"
                fullWidth
                disabled={total === 0 || isSubmitting}
                label={<FormattedMessage id="prompt" defaultMessage="Prompt" />}
                multiline={multiline}
              />
              {(output || isSubmitting) && (
                <Stack spacing={2}>
                  <Typography variant="body1" color="text.secondary">
                    {isSubmitting ? (
                      <Skeleton />
                    ) : (
                      <>
                        <FormattedMessage
                          id="answer"
                          defaultMessage="Answer:"
                        />{" "}
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
                  disabled={total === 0}
                />
              </Box>
              <Divider />
              <Box>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    onClick={submitForm}
                    disabled={
                      isSubmitting || !values.action || !isValid || total === 0
                    }
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
        <Backdrop
          sx={(theme) => ({
            zIndex: theme.zIndex.drawer + 1,
            position: "absolute",
            backdropFilter: "blur(10px)",
          })}
          open={total === 0}
        >
          <Stack alignItems="center" justifyContent="center" spacing={2}>
            <AutoAwesomeIcon fontSize="large" />
            <Box>
              <Typography align="center" variant="body1" fontWeight="bold">
                <FormattedMessage id="no.credits" defaultMessage="No Credits" />
              </Typography>
              <Typography align="center" variant="body2" color="text.secondary">
                <FormattedMessage
                  id="you.need.to.add.credits.to.use.ai.features"
                  defaultMessage="You need to add credits to use AI features"
                />
              </Typography>
            </Box>
            <Button onClick={handleAddCredits} variant="contained" size="small">
              <FormattedMessage id="add.credits" defaultMessage="Add credits" />
            </Button>
          </Stack>
        </Backdrop>
      </Box>
    </>
  );
}
