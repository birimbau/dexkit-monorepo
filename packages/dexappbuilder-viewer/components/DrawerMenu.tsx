import Link from "@dexkit/ui/components/AppLink";
import { MenuTree } from "@dexkit/ui/types/config";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItemButton, ListItemSecondaryAction, styled } from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

interface Props {
  menu: MenuTree[];
  onClose: any;
}

const CustomListItemSecondaryAction = styled(ListItemSecondaryAction)({
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  height: "100%",
});

export default function DrawerMenu(props: Props) {
  const { menu, onClose } = props;
  const [showKeys, setShowKeys] = useState<number[]>([]);

  const onShowKey = (keyToShow: number) => {
    const index = showKeys.indexOf(keyToShow);

    if (index !== -1) {
      const newShowKeys = [...showKeys];
      newShowKeys.splice(index, 1);
      setShowKeys(newShowKeys);
    } else {
      setShowKeys([keyToShow, ...showKeys]);
    }
  };

  return (
    <List disablePadding>
      {menu.map((m, key) =>
        m.children ? (
          <List key={key}>
            <ListItemButton divider onClick={() => onShowKey(key)}>
              <FormattedMessage
                id={m.name.toLowerCase()}
                defaultMessage={m.name}
              />
              <CustomListItemSecondaryAction>
                <ExpandMoreIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItemButton>
            {showKeys.includes(key) &&
              m.children.map((mc, k) => (
                <ListItemButton
                  divider
                  onClick={onClose}
                  component={Link}
                  href={mc.href || "/"}
                  key={k}
                  sx={{ pl: 4 }}
                >
                  <ListItemText
                    sx={{ fontWeight: 600 }}
                    primary={
                      <FormattedMessage
                        id={mc.name.toLowerCase()}
                        defaultMessage={mc.name}
                      />
                    }
                  />
                  <CustomListItemSecondaryAction>
                    <ChevronRightIcon color="primary" />
                  </CustomListItemSecondaryAction>
                </ListItemButton>
              ))}
          </List>
        ) : (
          <ListItemButton
            divider
            onClick={onClose}
            component={Link}
            href={m.href || "/"}
            key={key}
          >
            <ListItemText
              sx={{ fontWeight: 600 }}
              primary={
                <FormattedMessage
                  id={m.name.toLowerCase()}
                  defaultMessage={m.name}
                />
              }
            />
            <CustomListItemSecondaryAction>
              <ChevronRightIcon color="primary" />
            </CustomListItemSecondaryAction>
          </ListItemButton>
        )
      )}
    </List>
  );
}
