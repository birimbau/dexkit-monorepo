import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/icons-material/Menu';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { AppPage, MenuTree } from 'src/types/config';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';

export interface SubmenuProps {
  label: string;
  children?: MenuTree[];
  pages: { [key: string]: AppPage };
  index: number;
}

export default function Submenu({
  children,
  label,
  pages,
  index,
}: SubmenuProps) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const renderItem = (item: MenuTree, index: number, arr: MenuTree[]) => {
    return (
      <ListItem key={`${label}-${index}`}>
        <ListItemText primary={item.name} />
        <Typography color="text.secondary"></Typography>
      </ListItem>
    );
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddMenu = (item: MenuTree, fatherIndex?: number) => {};

  return (
    <>
      {openDialog && (
        <AddMenuPageDialog
          dialogProps={{
            open: true,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClose,
          }}
          pages={pages}
          onCancel={handleClose}
          onSubmit={handleAddMenu}
          fatherIndex={index}
        />
      )}
      <ListItemButton onClick={() => setOpen((open) => !open)}>
        <ListItemIcon>
          <Menu />
        </ListItemIcon>
        <ListItemText primary={label} />
        {open ? <ExpandMore /> : <ExpandLess />}
      </ListItemButton>
      <Collapse in={open}>
        <List disablePadding>
          {children?.map((item, index, arr) => renderItem(item, index, arr))}
        </List>
      </Collapse>
    </>
  );
}
