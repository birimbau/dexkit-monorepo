import Delete from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FieldArray, Form, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import AppConfirmDialog from 'src/components/AppConfirmDialog';
import { CollectionItemsForm } from '../types';
import CollectionItemForm from './CollectionItemForm';

export default function CollectionItemsCard() {
  const { submitForm, isValid, values } =
    useFormikContext<CollectionItemsForm>();
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
      <AppConfirmDialog
        dialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={<FormattedMessage id="remove.nft" defaultMessage="Remove NFT" />}
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.remove.this.nft"
            defaultMessage="Do you really want to remove this NFT?"
          />
        </Typography>
      </AppConfirmDialog>

      <Card>
        <CardContent>
          <Form>
            <FieldArray
              name="items"
              render={(arrayHelper) => (
                <Stack spacing={2}>
                  {values.items?.map((_, index: number, arr: any[]) => (
                    <React.Fragment key={index}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>NFT: {index + 1}</Typography>
                        <Button
                          startIcon={<Delete />}
                          onClick={() => {
                            setShowConfirm(true);
                            setConfirmCallback(() => () => {
                              arrayHelper.remove(index);
                              setShowConfirm(false);
                            });
                          }}
                        >
                          <FormattedMessage
                            id="remove"
                            defaultMessage="Remove"
                          />
                        </Button>
                      </Stack>
                      <CollectionItemForm itemIndex={index} />
                      {index < arr.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({ quantity: 1 })}
                  >
                    <FormattedMessage id="add.nft" defaultMessage="Add nft" />
                  </Button>
                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      disabled={!isValid || values.items.length === 0}
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage
                        id="create.nfts"
                        defaultMessage="Create NFTs"
                      />
                    </Button>
                  </Stack>
                </Stack>
              )}
            />
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
