import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '../../../../components/AppDialogTitle';
import RankingSection from '../sections/RankingSection';

interface Props {
  dialogProps: DialogProps;
  rankingId?: number;
}

function RankingDialog({ dialogProps, rankingId }: Props) {
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
            id="leaderboard.preview"
            defaultMessage="Leaderboard preview"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <RankingSection
          section={{ type: 'ranking', settings: { rankingId: rankingId } }}
        ></RankingSection>
      </DialogContent>
    </Dialog>
  );
}

export default RankingDialog;
