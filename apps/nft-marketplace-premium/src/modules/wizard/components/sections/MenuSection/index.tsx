import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Dispatch, SetStateAction, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AppPage, MenuTree } from '../../../../../types/config';

import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddMenuPageDialog from '../../dialogs/AddMenuPageDialog';
import MenuItemTree from './MenuItemTree';

interface Props {
  menu: MenuTree[];
  pages: { [key: string]: AppPage };
  onSetMenu: Dispatch<SetStateAction<MenuTree[]>>;
}

interface ChildrenProps {
  children: MenuTree[];
  fatherIndex: number;
  setIsOpen: (open: boolean) => void;
  onMoveUp: (key: number, fatherKey: number) => void;
  onMoveDown: (key: number, fatherKey: number) => void;
  onRemove: (key: number, fatherKey: number) => void;
  setFatherIndex: (index: number) => void;
}

function MenuSectionChildrenList({
  children,
  fatherIndex,
  setFatherIndex,
  onMoveDown,
  onMoveUp,
  onRemove,
  setIsOpen,
}: ChildrenProps) {
  return (
    <List>
      {children &&
        children.map((c, k, arr) => (
          <ListItem
            disablePadding
            key={k}
            secondaryAction={
              <>
                <IconButton
                  aria-label="up"
                  onClick={() => onMoveUp(k, fatherIndex)}
                  disabled={k === 0}
                >
                  <KeyboardArrowUpIcon />
                </IconButton>
                <IconButton
                  aria-label="down"
                  onClick={() => onMoveDown(k, fatherIndex)}
                  disabled={k === arr.length - 1}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
                {c.type === 'Menu' && (
                  <IconButton
                    aria-label="add"
                    onClick={() => {
                      setFatherIndex(k);
                      setIsOpen(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
                <IconButton
                  aria-label="delete"
                  onClick={() => onRemove(k, fatherIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary={c.name} />
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  );
}

export default function MenuSection(props: Props) {
  const { menu, onSetMenu, pages } = props;
  const [isOpen, setIsOpen] = useState(false);

  const onAddMenu = (item: MenuTree, fIndex?: number) => {
    const newMenu = [...menu];
    if (fIndex !== undefined) {
      if (
        newMenu[fIndex] &&
        newMenu[fIndex]?.children &&
        newMenu[fIndex]?.children?.length
      ) {
        (newMenu[fIndex].children || []).push(item);
      } else {
        newMenu[fIndex].children = [item];
      }
    } else {
      newMenu.push(item);
    }
    onSetMenu(newMenu);
  };

  const handleAddMenuPage = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const root = {
    name: 'root',
    type: 'Menu',
    children: menu,
  };

  const handleUp = (index: number) => {
    return () => {
      const newItem = { ...root, children: [...menu] };

      if (newItem.children) {
        const currItem = newItem.children[index];
        const beforeItem = newItem.children[index - 1];

        newItem.children[index] = beforeItem;
        newItem.children[index - 1] = currItem;

        console.log(newItem.children);
        onSetMenu(newItem.children);
      }
    };
  };

  const handleDown = (index: number) => {
    return () => {
      const items = [...menu];

      const currItem = items[index];
      const beforeItem = items[index + 1];

      items[index] = beforeItem;
      items[index + 1] = currItem;

      onSetMenu(items);
    };
  };

  const handleRemove = (index: number) => {
    return () => {
      const items = [...menu];

      items.splice(index, 1);

      onSetMenu(items);
    };
  };

  const handleUpdateItem = (index: number) => {
    return (newItem: MenuTree) => {
      const newMenu = [...menu];

      newMenu[index] = newItem;

      onSetMenu(newMenu);
    };
  };

  return (
    <Stack spacing={2}>
      <AddMenuPageDialog
        dialogProps={{
          open: isOpen,
          maxWidth: 'sm',
          fullWidth: true,
          onClose: handleClose,
        }}
        pages={pages}
        onCancel={handleClose}
        onSubmit={onAddMenu}
      />
      <Button
        variant="outlined"
        onClick={handleAddMenuPage}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="add.menu" defaultMessage="Add menu" />
      </Button>
      {menu?.map((item, index, arr) => (
        <MenuItemTree
          key={index}
          pages={pages}
          depth={0}
          item={item}
          onDown={handleDown(index)}
          onUp={handleUp(index)}
          onRemove={handleRemove(index)}
          onUpdateItem={handleUpdateItem(index)}
          disableUp={index === 0}
          disableDown={index === arr.length - 1}
        />
      ))}
    </Stack>
  );
}
