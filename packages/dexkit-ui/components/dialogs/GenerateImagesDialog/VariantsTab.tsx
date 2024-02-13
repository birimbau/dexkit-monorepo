import { Button, CircularProgress, Stack } from "@mui/material";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGenVariants } from "../../../hooks/ai";
import VariantsGrid from "./VariantsGrid";

export interface VariantsTabProps {
  onCancel: () => void;
  imageUrl: string;
}

export default function VariantsTab({ onCancel, imageUrl }: VariantsTabProps) {
  const { mutateAsync: genVariants, isLoading, data } = useGenVariants();

  const [amount, setAmount] = useState(0);

  const handleSubmit = async (values: { amount: number }) => {
    setAmount(values.amount);
    await genVariants({
      numImages: parseInt(values.amount as string),
      url: imageUrl,
    });
  };

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

  return (
    <Formik onSubmit={handleSubmit} initialValues={{ amount: 0 }}>
      {({ submitForm }) => (
        <Stack spacing={2}>
          {data && (
            <VariantsGrid
              gridSize={gridSize}
              amount={amount}
              isLoading={isLoading}
              images={data}
              onOpenMenu={() => {}}
              onSelect={() => {}}
              selectable
              selected={{}}
            />
          )}

          <Field
            component={TextField}
            name="amount"
            type="number"
            label={
              <FormattedMessage
                id="num.of.variant"
                defaultMessage="Num of variants"
              />
            }
          />
          <Button
            startIcon={
              isLoading ? (
                <CircularProgress color="primary" size="1rem" />
              ) : undefined
            }
            disabled={isLoading}
            onClick={submitForm}
            variant="contained"
          >
            {isLoading ? (
              <FormattedMessage
                id="generating.variants"
                defaultMessage="Generating Variants"
              />
            ) : (
              <FormattedMessage
                id="generate.variants"
                defaultMessage="Generate Variants"
              />
            )}
          </Button>
          <Button variant="outlined" disabled={isLoading} onClick={onCancel}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
