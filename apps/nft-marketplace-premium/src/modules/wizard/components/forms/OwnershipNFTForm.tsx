import CollectionItemAttributeForm from '@/modules/contract-wizard/components/CollectionItemAttributeForm';
import { GenerateAIImageButton } from '@/modules/contract-wizard/components/GenerateAIImageButton';
import { ImageFormUpload } from '@/modules/contract-wizard/components/ImageFormUpload';
import { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import { Box, Button, Grid, Stack } from '@mui/material';
import { Field, FieldArray, Form, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';

import { FormattedMessage } from 'react-intl';

interface Props {}

export default function OwnershipNFTForm({}: Props) {
  const { setFieldValue, values, errors } =
    useFormikContext<CollectionOwnershipNFTFormType>();

  return (
    <Form>
      <Grid container spacing={2}>
        <Grid item>
          <ImageFormUpload
            value={values?.image || ''}
            onSelectFile={(file) => setFieldValue(`image`, file)}
            error={Boolean(errors && (errors as any)?.image)}
          />
          <Box pt={2}>
            <GenerateAIImageButton
              description={values.description}
              onImageUrl={(imageUrl) => setFieldValue(`image`, imageUrl)}
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Stack spacing={2}>
            <Field
              component={TextField}
              name={`name`}
              label={<FormattedMessage id="name" defaultMessage="Name" />}
              fullWidth
            />
            <Field
              component={TextField}
              name={`description`}
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

            {(values as any)?.attributes?.length > 0 && (
              <Box>
                <Stack spacing={2}>
                  {values.attributes?.map((_, index: number) => (
                    <CollectionItemAttributeForm
                      key={index}
                      index={index}
                      itemSelector={''}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <FieldArray
                name={`attributes`}
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
    </Form>
  );
}
