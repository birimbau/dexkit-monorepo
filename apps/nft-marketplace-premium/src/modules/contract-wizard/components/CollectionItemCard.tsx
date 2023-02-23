import Delete from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FieldArray, Form, useFormikContext, Field } from 'formik';
import React, { useState } from 'react';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import { CollectionItemFormType } from '../types';
import CollectionItemAttributeForm from './CollectionItemAttributeForm';
import CollectionItemForm from './CollectionItemForm';
import { ImageFormUpload } from './ImageFormUpload';

interface Props {
  tokenId: string;
}

export default function CollectionItemCard({ tokenId }: Props) {
  const { submitForm, isValid, values, setFieldValue, errors } =
    useFormikContext<CollectionItemFormType>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState<() => void>();

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setConfirmCallback(undefined);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Form>
            <Stack direction="row" justifyContent="space-between">
              <Typography>NFT Id: {tokenId}</Typography>
            </Stack>
            <Box>
              <Grid container spacing={2}>
                <Grid item>
                  <ImageFormUpload
                    value={values.file || ''}
                    onSelectFile={(file) => setFieldValue(`file`, file)}
                    error={Boolean(errors?.file)}
                  />
                </Grid>
                <Grid item xs>
                  <Stack spacing={2}>
                    <Field
                      component={TextField}
                      name={`name`}
                      label={
                        <FormattedMessage id="name" defaultMessage="Name" />
                      }
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
                    {values &&
                      values.attributes &&
                      values.attributes?.length > 0 && (
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
                        name={`.attributes`}
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

            <Stack direction="row" justifyContent="space-between">
              <Button
                disabled={!isValid}
                onClick={submitForm}
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="update.nft" defaultMessage="Update NFT" />
              </Button>
            </Stack>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
