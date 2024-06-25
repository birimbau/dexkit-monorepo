import { GatedCondition } from '@dexkit/ui/modules/wizard/types';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PageAddConditionDialog from './dialogs/PageAddConditionDialog';

import PageGatedConditionsList from './PageGatedConditionsList';

export interface PageGatedConditionsTabProps {
  conditions: GatedCondition[];
  onSaveGatedConditions: (conditions: GatedCondition[]) => void;
}

export default function PageGatedConditionsTab({
  conditions,
  onSaveGatedConditions,
}: PageGatedConditionsTabProps) {
  const [showAdd, setShowAdd] = useState(false);

  const handleClose = () => {
    setShowAdd(false);
  };

  const handleOpen = () => {
    setShowAdd(true);
  };

  return (
    <>
      {showAdd && (
        <PageAddConditionDialog
          DialogProps={{
            open: showAdd,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: 'lg',
          }}
          onSaveGatedConditions={onSaveGatedConditions}
          conditions={conditions}
        />
      )}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              startIcon={<AddOutlined />}
              variant="outlined"
              color="primary"
              onClick={handleOpen}
            >
              <FormattedMessage
                id="add.condition"
                defaultMessage="Add condition"
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight="bold">
              <FormattedMessage
                id="condition.list"
                defaultMessage="Condition list"
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PageGatedConditionsList conditions={conditions} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
