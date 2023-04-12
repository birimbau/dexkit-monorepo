import ShareIcon from '@mui/icons-material/Share';
import { IconButton } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ShareDialog = dynamic(
  () => import('@/modules/nft/components/dialogs/ShareDialog')
);

interface Props {
  url?: string;
}

export function ShareButton({ url }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ShareDialog
        dialogProps={{
          open,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: () => setOpen(false),
        }}
        url={
          url || typeof window !== 'undefined'
            ? window.location.href
            : undefined
        }
      />
      <IconButton onClick={() => setOpen(true)}>
        <ShareIcon />
      </IconButton>
    </>
  );
}
