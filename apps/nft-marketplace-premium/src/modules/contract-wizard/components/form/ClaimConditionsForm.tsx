import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import Delete from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClaimCondition } from '@thirdweb-dev/sdk';
import { FieldArray, Form, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClaimConditionForm } from './ClaimConditionForm';

export function ClaimConditionsForm() {
  const { submitForm, isValid, values } = useFormikContext<{
    phases: ClaimCondition[];
  }>();
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
        DialogProps={{
          open: showConfirm,
          onClose: handleCloseConfirm,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        title={
          <FormattedMessage
            id="remove.condition"
            defaultMessage="Remove condition"
          />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.really.want.to.remove.this.condition"
            defaultMessage="Do you really want to remove this Condition?"
          />
        </Typography>
      </AppConfirmDialog>

      <Card>
        <CardContent>
          <Form>
            <FieldArray
              name="phases"
              render={(arrayHelper) => (
                <Stack spacing={2}>
                  {values.phases?.map((_, index: number, arr: any[]) => (
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

                      <ClaimConditionForm itemIndex={index} network="" />
                      {index < arr.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}

                  <Button
                    variant="outlined"
                    onClick={() => arrayHelper.push({ quantity: 1 })}
                  >
                    <FormattedMessage
                      id="add.claim.condition"
                      defaultMessage="Add claim condition"
                    />
                  </Button>

                  <Stack direction="row" justifyContent="space-between">
                    <Button
                      disabled={!isValid || values.phases.length === 0}
                      onClick={submitForm}
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage
                        id="create.claim.conditions"
                        defaultMessage="Create claim conditions"
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
