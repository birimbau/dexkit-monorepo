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
  hideMobile: boolean;
  isVisible: boolean;
  hideDesktop: boolean;
}) => {
  return [
    {
      title: {
        id: 'hide.on.mobile',
        defaultMessage: 'Hide on mobile',
      },
      icon: hideMobile ? <MobileOffIcon /> : <SmartphoneIcon />,
      value: hideMobile ? 'hideMobile' : 'showMobile',
    },
    {
      title: {
        id: 'hide.on.desktop',
        defaultMessage: 'Hide on desktop',
      },
      icon: hideDesktop ? <DesktopAccessDisabledIcon /> : <ComputerIcon />,
      value: hideDesktop ? 'hideDesktop' : 'showDesktop',
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
        id: 'view.section',
        defaultMessage: 'View section',
      },
      icon: isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />,
      value: isVisible ? 'hideSection' : 'showSection',
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
