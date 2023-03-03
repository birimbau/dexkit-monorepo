import { Dialog, DialogProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from '../../../../components/AppDialogTitle';
import { AppConfig, AppPageSection } from '../../../../types/config';
import dynamic from 'next/dynamic';
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
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="page.preview.title"
            defaultMessage="{name} page preview"
            values={{ name }}
          />
        }
        onClose={handleClose}
      />
      <PreviewPagePlatform
        sections={sections}
        disabled={disabled}
        withLayout={withLayout}
        appConfig={appConfig}
      />
    </Dialog>
  );
}
