import ComputerIcon from '@mui/icons-material/Computer';
import DeleteIcon from '@mui/icons-material/Delete';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import Edit from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MobileOffIcon from '@mui/icons-material/MobileOff';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const SECTION_MENU_OPTIONS = ({
  hideMobile,
  isVisible,
  hideDesktop,
}: {
  hideMobile?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
}) => {
  return [
    {
      title: {
        id: 'hide.on.mobile',
        defaultMessage: 'Hide on mobile',
      },
      icon: hideMobile ? <MobileOffIcon /> : <SmartphoneIcon />,
      value: 'hide.mobile',
    },
    {
      title: {
        id: 'hide.on.desktop',
        defaultMessage: 'Hide on desktop',
      },
      icon: hideDesktop ? <DesktopAccessDisabledIcon /> : <ComputerIcon />,
      value: 'hide.desktop',
    },
    {
      title: {
        id: 'clone.section',
        defaultMessage: 'Clone section',
      },
      icon: <FileCopyIcon />,
      value: 'clone',
    },
    {
      title: {
        id: isVisible ? 'hide.section' : 'view.section',
        defaultMessage: isVisible ? 'Hide section' : 'View section',
      },
      icon: isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />,
      value: isVisible ? 'hide.section' : 'show.section',
    },
    {
      title: {
        id: 'edit.section',
        defaultMessage: 'Edit section',
      },
      icon: <Edit />,
      value: 'edit',
    },
    {
      title: {
        id: 'remove.section',
        defaultMessage: 'Remove section',
      },
      icon: <DeleteIcon color={'error'} />,
      value: 'remove',
    },
  ];
};
