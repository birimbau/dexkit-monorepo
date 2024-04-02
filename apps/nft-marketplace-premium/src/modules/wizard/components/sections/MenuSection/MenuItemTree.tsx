import { ArrowDownward } from '@mui/icons-material';
import Add from '@mui/icons-material/Add';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Delete from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { AppPage, MenuTree } from 'src/types/config';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';

export interface MenuItemTreeProps {
  item: MenuTree;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  onUpdateItem: (newItem: MenuTree) => void;
  pages: {
    [key: string]: AppPage;
  };
  depth: number;
  disableUp: boolean;
  disableDown: boolean;
  disableMenu?: boolean;
}

export default function MenuItemTree({
  item,
  depth,
  onUp,
  onDown,
  onRemove,
  onUpdateItem,
  disableUp,
  disableDown,
  pages,
}: MenuItemTreeProps) {
  const [expanded, setExpanded] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const handleUp = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        const currItem = newItem.children[index];
        const beforeItem = newItem.children[index - 1];

        newItem.children[index] = beforeItem;
        newItem.children[index - 1] = currItem;
      }

      onUpdateItem(newItem);
    };
  };

  const handleDown = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        const currItem = newItem.children[index];
        const beforeItem = newItem.children[index + 1];

        newItem.children[index] = beforeItem;
        newItem.children[index + 1] = currItem;
      }

      onUpdateItem(newItem);
    };
  };

  const handleRemove = (index: number) => {
    return () => {
      const newItem = { ...item };

      if (newItem.children) {
        newItem.children.splice(index, 1);
      }

      onUpdateItem(newItem);
    };
  };

  const handleUpdateItem = (index: number) => {
    return (newItem: MenuTree) => {
      const updatedItem = { ...item };

      if (updatedItem.children) {
        updatedItem.children[index] = { ...newItem };
      }

      onUpdateItem(updatedItem);
    };
  };

  const handleAdd = (newItem: MenuTree, fatherIndex?: number | undefined) => {
    const updatedItem = { ...item };

    if (updatedItem.children) {
      updatedItem.children.push(newItem);
    } else {
      updatedItem.children = [newItem];
    }

    onUpdateItem(updatedItem);
  };

  console.log('depth', depth);

  if (item.type === 'Page') {
    return (
      <ListItem>
        <ListItemText primary={item.name} />
        <Stack
          spacing={0.5}
          alignItems="center"
          alignContent="center"
          direction="row"
        >
          <IconButton disabled={disableUp} onClick={onUp}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={disableDown} onClick={onDown}>
            <ArrowDownward />
          </IconButton>
          <IconButton onClick={onRemove}>
            <Delete />
          </IconButton>
        </Stack>
      </ListItem>
    );
  }

  if (item.type === 'External') {
    return (
      <ListItem>
        <ListItemText primary={item.name} />
        <Stack
          spacing={0.5}
          alignItems="center"
          alignContent="center"
          direction="row"
        >
          <IconButton disabled={disableUp} onClick={onUp}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={disableDown} onClick={onDown}>
            <ArrowDownward />
          </IconButton>
          <IconButton onClick={onRemove}>
            <Delete />
          </IconButton>
        </Stack>
      </ListItem>
    );
  }

  if (item.type === 'Menu') {
    return (
      <Box sx={{ pl: depth * 4 }}>
        <AddMenuPageDialog
          dialogProps={{
            open: openAdd,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: () => setOpenAdd(false),
          }}
          pages={pages}
          onCancel={() => {}}
          onSubmit={handleAdd}
          fatherIndex={0}
          disableMenu={depth === 1}
        />
        <ListItem>
          <ListItemText primary={item.name} />
          <Stack
            spacing={0.5}
            alignItems="center"
            alignContent="center"
            direction="row"
          >
            <IconButton disabled={disableUp} onClick={onUp}>
              <ArrowUpward />
            </IconButton>
            <IconButton disabled={disableDown} onClick={onDown}>
              <ArrowDownward />
            </IconButton>
            <IconButton onClick={onRemove}>
              <Delete />
            </IconButton>
            <IconButton onClick={() => setOpenAdd(true)}>
              <Add />
            </IconButton>
            <IconButton onClick={() => setExpanded((value) => !value)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
        </ListItem>
        <Collapse in={expanded}>
          <List>
            {item.children?.map((child, key, arr) => (
              <MenuItemTree
                pages={pages}
                item={child}
                key={`${depth}-${key}`}
                onDown={handleDown(key)}
                onUp={handleUp(key)}
                onRemove={handleRemove(key)}
                onUpdateItem={handleUpdateItem(key)}
                depth={depth + 1}
                disableUp={key === 0}
                disableDown={key === arr.length - 1}
              />
            ))}
          </List>
        </Collapse>
      </Box>
    );
  }

  return <></>;
}
