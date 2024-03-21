import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/icons-material/Menu';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppPage, MenuTree } from 'src/types/config';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';
import MenuItem from './MenuItem';

export interface SubmenuProps {
  item: MenuTree;
  pages: { [key: string]: AppPage };
  onUpdateItem: (item: MenuTree) => void;
  depth: number;
}

export default function Submenu({
  item,
  pages,
  depth,
  onUpdateItem,
}: SubmenuProps) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const renderItem = (i: MenuTree, index: number) => {
    if (i.type === 'Menu' && item.children && item.children[index]) {
      return (
        <Submenu
          key={`${depth}-${index}`}
          item={item.children[index]}
          pages={pages}
          onUpdateItem={(updatedItem: MenuTree) => {
            const newItem = { ...item };

            if (newItem.children) {
              newItem.children[index] = updatedItem;
            }

            onUpdateItem(newItem);
          }}
          depth={depth + 1}
        />
      );
    }

    return <MenuItem key={`${depth}-${index}`} item={i} depth={depth + 1} />;
  };

  const handleOpenAdd = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddMenu = (newItem: MenuTree, fatherIndex?: number) => {
    onUpdateItem({
      ...item,
      children: item.children ? [...item.children, newItem] : [newItem],
    });
  };

  if (item.type !== 'Menu') {
    return <MenuItem item={item} depth={depth + 1} />;
  }

  return (
    <Box>
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
          disabledAddMenu={depth === 2}
        />
      )}
      <ListItem>
        <ListItemIcon sx={{ ml: depth * 4 }}>
          <Menu />
        </ListItemIcon>
        <ListItemText primary={item.name} />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton onClick={handleOpenAdd}>
            <Tooltip title={<FormattedMessage id="add" defaultMessage="Add" />}>
              <AddIcon />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip
              title={<FormattedMessage id="remove" defaultMessage="Remove" />}
            >
              <RemoveIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={() => setOpen((open) => !open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>
      </ListItem>
      {item.children && (
        <Collapse in={open}>
          <List disablePadding>
            {item.children?.map((item, index) => renderItem(item, index))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
