import { useImageGenerate } from "../../../hooks/ai";

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import * as Yup from "yup";

import { Formik } from "formik";
import VariantsGrid from "./VariantsGrid";

const FormSchema = Yup.object({
  amount: Yup.number().min(1).max(10).required(),
  prompt: Yup.string().min(1).max(1000).required(),
});

export interface GenerateTabProps {
  onMenuOption: (opt: string, { url }: { url: string }) => void;
  disabled?: boolean;
}

export default function GenerateTab({
  disabled,
  onMenuOption,
}: GenerateTabProps) {
  const {
    mutateAsync: generate,
    data,
    isLoading: isImagesLoading,
  } = useImageGenerate();

  const handleGenerate = async (amount: number, prompt: string) => {
    let result = await generate({
      numImages: amount,
      prompt,
      size: "512x512",
    });
  };

  const { formatMessage } = useIntl();

  const gridSize = useMemo(() => {
    if (data) {
      if (data.length === 1) {
        return 6;
      } else if (data.length === 2) {
        return 6;
      }
    }

    return 4;
  }, [data]);

  const handleSubmit = async ({
    amount,
    prompt,
  }: {
    amount: number;
    prompt: string;
  }) => {
    handleGenerate(amount, prompt);
  };

  return (
    <Formik
      initialValues={{ amount: 1, prompt: "" }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >
      {({
        setFieldValue,
        errors,
        values,
        submitForm,
        isSubmitting,
        isValid,
      }) => (
        <Stack spacing={2}>
          <VariantsGrid
            amount={values.amount}
            gridSize={gridSize}
            images={data || []}
            isLoading={isImagesLoading}
            disabled={isImagesLoading}
            onMenuOption={onMenuOption}
          />

          <TextField
            placeholder={formatMessage({
              id: "ex.an.image.of.a.cat",
              defaultMessage: "ex. An image of a cat",
            })}
            onChange={(e) => setFieldValue("prompt", e.target.value)}
            value={values.prompt}
            fullWidth
            error={Boolean(errors.prompt)}
            helperText={Boolean(errors.prompt) ? errors.prompt : undefined}
            rows={6}
            multiline
            disabled={isImagesLoading || disabled || isSubmitting}
          />
          <TextField
            label={formatMessage({
              id: "num.of.images",
              defaultMessage: "Num. of Images",
            })}
            disabled={isImagesLoading || disabled || isSubmitting}
            onChange={(e) => setFieldValue("amount", parseInt(e.target.value))}
            value={values.amount === 0 ? "" : values.amount}
            fullWidth
            error={Boolean(errors.amount)}
            helperText={Boolean(errors.amount) ? errors.amount : undefined}
            type="number"
          />
          <Button
            disabled={!isValid || isImagesLoading || disabled || isSubmitting}
            onClick={submitForm}
            variant="outlined"
            startIcon={
              isImagesLoading ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
          >
            {isImagesLoading ? (
              <FormattedMessage id="generating" defaultMessage="Generating" />
            ) : (
              <FormattedMessage id="generate" defaultMessage="Generate" />
            )}
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
