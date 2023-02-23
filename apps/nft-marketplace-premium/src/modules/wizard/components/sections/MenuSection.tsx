import { Dispatch, SetStateAction, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AppPage, MenuTree } from '../../../../types/config';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormattedMessage } from 'react-intl';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import AddMenuPageDialog from '../dialogs/AddMenuPageDialog';
interface Props {
  menu: MenuTree[];
  pages: { [key: string]: AppPage };
  onSetMenu: Dispatch<SetStateAction<MenuTree[]>>;
}

export default function MenuSection(props: Props) {
  const { menu, onSetMenu, pages } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [fatherIndex, setFatherIndex] = useState<number | undefined>();

  const onRemove = (id: number) => {
    const newMenu = [...menu];
    newMenu.splice(id, 1);
    onSetMenu(newMenu || []);
  };

  const onMoveUp = (id: number) => {
    const newMenu = [...menu];
    let before = newMenu[id - 1];
    newMenu[id - 1] = newMenu[id];
    newMenu[id] = before;
    onSetMenu(newMenu);
  };

  const onMoveDown = (id: number) => {
    const newMenu = [...menu];
    let before = newMenu[id + 1];
    newMenu[id + 1] = newMenu[id];
    newMenu[id] = before;
    onSetMenu(newMenu);
  };

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
      onSetMenu(newMenu);
    }
  };

  const handleAddMenuPage = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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
        fatherIndex={fatherIndex}
      />
      <Button
        variant="outlined"
        onClick={handleAddMenuPage}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="add.menu" defaultMessage="Add menu" />
      </Button>
      <List>
        {menu.length > 0 &&
          menu.map((item, key) => (
            <>
              <ListItem
                disablePadding
                key={key}
                secondaryAction={
                  <>
                    <IconButton
                      aria-label="up"
                      onClick={() => onMoveUp(key)}
                      disabled={key === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      aria-label="down"
                      onClick={() => onMoveDown(key)}
                      disabled={key === menu.length - 1}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    {item.type === 'Menu' && (
                      <IconButton
                        aria-label="add"
                        onClick={() => {
                          setFatherIndex(key);
                          setIsOpen(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="delete"
                      onClick={() => onRemove(key)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemButton>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
              <List>
                {item.children &&
                  item.children.map((c, k) => (
                    <ListItem disablePadding key={k}>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary={c.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </>
          ))}
      </List>
    </Stack>
  );
}
