import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogProps, IconButton, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import { AppConfig } from '../../../../types/config';
import { AppPageSection } from '../../types/section';

const PreviewPagePlatform = dynamic(() => import('../PreviewPagePlatform'));

interface Props {
  dialogProps: DialogProps;
  sections?: AppPageSection[];
  name: string;
  disabled?: boolean;
  withLayout?: boolean;
  appConfig?: AppConfig;
}

export default function PreviewPageDialog({
  dialogProps,
  sections,
  name,
  disabled,
  withLayout,
  appConfig,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} sx={{ p: 0, m: 0 }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <PreviewPagePlatform
        sections={sections}
        disabled={disabled}
        withLayout={withLayout}
        appConfig={appConfig}
        enableOverflow={true}
        title={
          <Typography variant="body1">
            <FormattedMessage
              id="page.preview.title"
              defaultMessage="{name} page preview"
              values={{ name }}
            />
          </Typography>
        }
      />
    </Dialog>
  );
}
