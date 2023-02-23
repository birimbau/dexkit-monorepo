import { Box, Button, Grid, Stack } from '@mui/material';
import { Field, FieldArray, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CollectionItemsForm } from '../types';
import CollectionItemAttributeForm from './CollectionItemAttributeForm';
import { GenerateAIImageButton } from './GenerateAIImageButton';
import { ImageFormUpload } from './ImageFormUpload';

interface Props {
  itemIndex: number;
}

export default function CollectionItemForm({ itemIndex }: Props) {
  const { setFieldValue, values, errors } =
    useFormikContext<CollectionItemsForm>();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <ImageFormUpload
            value={values.items[itemIndex]?.file || ''}
            onSelectFile={(file) =>
              setFieldValue(`items[${itemIndex}].file`, file)
            }
            error={Boolean(
              errors.items && (errors.items[itemIndex] as any)?.file
            )}
          />
          <Box pt={2}>
            <GenerateAIImageButton
              description={values.items[itemIndex].description}
              onImageUrl={(imageUrl) =>
                setFieldValue(`items[${itemIndex}].file`, imageUrl)
              }
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Stack spacing={2}>
            <Field
              component={TextField}
              type={'number'}
              name={`items[${itemIndex}].quantity`}
              label={
                <FormattedMessage id="quantity" defaultMessage="Quantity" />
              }
              defaultValue={1}
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].name`}
              label={<FormattedMessage id="name" defaultMessage="Name" />}
              fullWidth
            />
            <Field
              component={TextField}
              name={`items[${itemIndex}].description`}
              label={
                <FormattedMessage
                  id="description"
                  defaultMessage="Description"
                />
              }
              fullWidth
              multiline
              rows={3}
            />

            {(values.items[itemIndex] as any)?.attributes?.length > 0 && (
              <Box>
                <Stack spacing={2}>
                  {values.items[itemIndex].attributes?.map(
                    (_, index: number) => (
                      <CollectionItemAttributeForm
                        key={index}
                        index={index}
                        itemSelector={`items[${itemIndex}].`}
                      />
                    )
                  )}
                </Stack>
              </Box>
            )}

            <Box>
              <FieldArray
                name={`items[${itemIndex}].attributes`}
                render={(arrayHelper) => (
                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({})}
                  >
                    <FormattedMessage
                      id="add.attribute"
                      defaultMessage="Add attribute"
                    />
                  </Button>
                )}
              />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
