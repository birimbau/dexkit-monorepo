import Dialog from '@mui/material/Dialog';

export interface SimpleDialogProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function LightBoxDialog(props: SimpleDialogProps) {
  const { onClose, imageUrl, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xl">
      <img
        style={{ display: 'block', maxHeight: '100%', maxWidth: '100%' }}
        src={imageUrl}
      />
    </Dialog>
  );
}
