import { Dialog, DialogProps } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from '../../../../components/AppDialogTitle';
import { AppPageSection } from '../../../../types/config';
import dynamic from 'next/dynamic';
const PreviewPagePlatform = dynamic(() => import('../PreviewPagePlatform'));
interface Props {
  dialogProps: DialogProps;
  sections: AppPageSection[];
  name: string;
  disabled?: boolean;
}

export default function PreviewPageDialog({
  dialogProps,
  sections,
  name,
  disabled,
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
      <PreviewPagePlatform sections={sections} disabled={disabled} />
    </Dialog>
  );
}
