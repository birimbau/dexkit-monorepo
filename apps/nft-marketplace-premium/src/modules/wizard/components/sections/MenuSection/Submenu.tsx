import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Menu from '@mui/icons-material/Menu';

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

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export interface SubmenuProps {
  item: MenuTree;
  index: number;
  pages: { [key: string]: AppPage };
  onUpdateItem: (item: MenuTree, index: number) => void;
  onRemoveItem: (index: number) => void;
  onUp: (index: number) => void;
  onDown: (index: number) => void;
  depth: number;
  buttons: {
    disableUp?: boolean;
    disableDown: boolean;
  };
}

export default function Submenu({
  item,
  index,
  pages,
  depth,
  onUp,
  onDown,
  buttons,
  onUpdateItem,
  onRemoveItem,
}: SubmenuProps) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const renderItem = (
    i: MenuTree,
    rIndex: number,
    arr: MenuTree[],
    depth: number,
  ) => {
    if (i.type === 'Menu' && i.children) {
      return (
        <Submenu
          buttons={{
            disableDown: rIndex === arr.length - 1,
            disableUp: rIndex === 0,
          }}
          index={rIndex}
          key={`${index}-${depth}-${rIndex}`}
          item={i}
          pages={pages}
          onUp={(upIndex: number) => {
            if (item.children) {
              const newItem = { ...i };

              if (newItem.children) {
                let upper = newItem.children[upIndex + 1];
                let curr = newItem.children[upIndex];

                newItem.children[upIndex + 1] = curr;
                newItem.children[upIndex] = upper;

                onUpdateItem(newItem, index);
              }
            }
          }}
          onDown={(downIndex: number) => {
            if (item.children) {
              const newItem = { ...i };

              if (newItem.children) {
                let upper = newItem.children[downIndex + 1];
                let curr = newItem.children[downIndex];

                newItem.children[downIndex + 1] = curr;
                newItem.children[downIndex] = upper;

                onUpdateItem(newItem, index);
              }
            }
          }}
          onUpdateItem={(updatedItem: MenuTree) => {
            const newItem = { ...i };

            if (newItem.children) {
              newItem.children[rIndex] = updatedItem;
            }

            onUpdateItem(newItem, index);
          }}
          onRemoveItem={(removeIndex: number) => {
            const newItem = { ...i };

            newItem.children?.splice(removeIndex, 1);

            onUpdateItem(newItem, index);
          }}
          depth={depth + 1}
        />
      );
    }

    return (
      <MenuItem
        key={`${index}-${depth}-${rIndex}`}
        item={i}
        depth={depth + 1}
        onUp={() => onUp(rIndex)}
        onDown={() => onDown(rIndex)}
        buttons={{
          disableUp: rIndex === 0,
          disableDown: rIndex === arr.length - 1,
        }}
        onRemove={() => {
          onRemoveItem(rIndex);
        }}
      />
    );
  };

  const handleOpenAdd = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddMenu = (newItem: MenuTree, fatherIndex?: number) => {
    onUpdateItem(
      {
        ...item,
        children: item.children ? [...item.children, newItem] : [newItem],
      },
      index,
    );
  };

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
          disabledAddMenu={depth === 1}
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
          <IconButton onClick={() => setOpen((open) => !open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <IconButton onClick={() => onUp(0)} disabled={buttons.disableUp}>
            <Tooltip title={<FormattedMessage id="up" defaultMessage="Up" />}>
              <ArrowUpwardIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={() => onDown(0)} disabled={buttons.disableDown}>
            <Tooltip
              title={<FormattedMessage id="down" defaultMessage="Down" />}
            >
              <ArrowDownwardIcon />
            </Tooltip>
          </IconButton>
        </Stack>
      </ListItem>
      {item.children && (
        <Collapse in={open}>
          <List disablePadding>
            {item.children?.map((item, i, arr) =>
              renderItem(item, i, arr, depth + 1),
            )}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
