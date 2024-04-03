import Add from '@mui/icons-material/Add';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Delete from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Image from '@mui/icons-material/Image';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  SvgIcon,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AppPage, MenuTree } from 'src/types/config';

const AddMenuPageDialog = dynamic(
  () => import('../../dialogs/AddMenuPageDialog'),
  { ssr: false }
);

const SelectIconDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/SelectIconDialog'),
  { ssr: false }
);

const DynamicIcon = ({ iconName }: { iconName: string }) => {
  return <SvgIcon />;
};

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
  const [showSelectIcons, setShowSelectIcons] = useState(false);

  const handleShowSelectIcon = () => {
    setShowSelectIcons(true);
  };

  const handleCloseSelectIcon = () => {
    setShowSelectIcons(false);
  };

  const handleConfirmSelectIcon = (iconName: string) => {
    const newItem = { ...item };

    if (newItem) {
      newItem.data = { iconName };

      onUpdateItem(newItem);
    }
  };

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
        <ListItemIcon>
          <IconButton onClick={handleShowSelectIcon}>
            {item.data?.iconName ? (
              '<DynamicIcon iconName={item.data.iconName} />'
            ) : (
              <Image />
            )}
          </IconButton>
        </ListItemIcon>
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
      <Box sx={{ pl: depth * 2 }}>
        {openAdd && (
          <AddMenuPageDialog
            key={`${depth}-dialog`}
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
            disableMenu={depth === 2}
          />
        )}
        {showSelectIcons && (
          <SelectIconDialog
            DialogProps={{
              open: showSelectIcons,
              onClose: handleCloseSelectIcon,
            }}
            onConfirm={handleConfirmSelectIcon}
          />
        )}
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
        <Collapse in={expanded} sx={{ pl: depth * 2 }}>
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
