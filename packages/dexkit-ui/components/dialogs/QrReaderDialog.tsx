import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { QrReader } from 'react-qr-reader';

interface Props {
  dialogProps: DialogProps;
}

const ViewFinder = () => (
  <>
    <svg
      width="50px"
      viewBox="0 0 100 100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1,
        boxSizing: 'border-box',
        border: '50px solid rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <path
        fill="none"
        d="M13,0 L0,0 L0,13"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M0,87 L0,100 L13,100"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M87,100 L100,100 L100,87"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M100,13 L100,0 87,0"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
    </svg>
  </>
);

function QrReaderDialog({ dialogProps }: Props) {
  const [data, setData] = useState('');
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
            id="scan.code"
            defaultMessage="Scan code"
            description="Select currency"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <div style={{ width: '400px', margin: 'auto' }}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setData(result.getText());
              }

              if (!!error) {
                console.info(error);
              }
            }}
            ViewFinder={ViewFinder}
            videoId={'video'}
            scanDelay={500}
            constraints={{ facingMode: 'user' }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary">
          <FormattedMessage
            id="confirm"
            defaultMessage="Confirm"
            description="Confirm"
          />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QrReaderDialog;
