import { AppDialogTitle } from '@dexkit/ui';
import { UserEvent } from '@dexkit/ui/hooks/userEvents';
import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import SwapDetail from './SwapDetail';
import TransferDetail from './TransferDetail';

export interface EventDetailDialogProps {
  DialogProps: DialogProps;
  event?: UserEvent;
}

export default function EventDetailDialog({
  DialogProps,
  event,
}: EventDetailDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="event.details" defaultMessage="Event Details" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        {event?.type === 'swap' && <SwapDetail event={event} />}
        {event?.type === 'transfer' && <TransferDetail event={event} />}
      </DialogContent>
    </Dialog>
  );
}
