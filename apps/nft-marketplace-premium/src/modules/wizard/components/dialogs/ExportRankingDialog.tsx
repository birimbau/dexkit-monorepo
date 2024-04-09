import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { ExportRanking } from '../ExportRanking';

interface Props {
  dialogProps: DialogProps;
  rankingId?: number;
}

function ExportRankingDialog({ dialogProps, rankingId }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="export.leaderboard.csv "
            defaultMessage="Export leaderboard csv"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <ExportRanking rankingId={rankingId} />
      </DialogContent>
    </Dialog>
  );
}

export default ExportRankingDialog;
