import { AppDialogTitle } from '@dexkit/ui';
import { CountFilter, useTopUserEvents } from '@dexkit/ui/hooks/userEvents';
import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import TopEventsList from './TopEventsList';

export interface TopEventsDialogProps {
  filters: CountFilter;
  DialogProps: DialogProps;
}

export default function TopEventsDialog({
  filters,
  DialogProps,
}: TopEventsDialogProps) {
  const topUserEventsQuery = useTopUserEvents({
    filters,
  });

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="user.events" defaultMessage="User events" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <TopEventsList
          events={topUserEventsQuery.data ? topUserEventsQuery.data : []}
        />
      </DialogContent>
    </Dialog>
  );
}
