import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import SpellcheckIcon from "@mui/icons-material/Spellcheck";

import NotesIcon from "@mui/icons-material/Notes";
import ShortTextIcon from "@mui/icons-material/ShortText";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ImageIcon from "@mui/icons-material/Image";
import RefreshIcon from "@mui/icons-material/Refresh";
import { TextImproveAction } from "../../constants/ai";

export interface ImproveTextActionListProps {
  value?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function ImproveTextActionList({
  onChange,
  value,
  disabled,
}: ImproveTextActionListProps) {
  const handleClick = (action: string) => {
    return () => onChange(action);
  };
  return (
    <List disablePadding>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.GENERATE}
        onClick={handleClick(TextImproveAction.GENERATE)}
      >
        <ListItemIcon>
          <RefreshIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage
              id="generate.new.text"
              defaultMessage="Generate new text"
            />
          }
        />
      </ListItemButton>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.IMPROVE_WRITING}
        onClick={handleClick(TextImproveAction.IMPROVE_WRITING)}
      >
        <ListItemIcon>
          <AutoAwesomeIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage
              id="improve.writing"
              defaultMessage="Improve writing"
            />
          }
        />
      </ListItemButton>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.IMPROVE_SPELLING}
        onClick={handleClick(TextImproveAction.IMPROVE_SPELLING)}
      >
        <ListItemIcon>
          <SpellcheckIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage
              id="fix.spelling.and.grammar"
              defaultMessage="Fix spelling and grammar"
            />
          }
        />
      </ListItemButton>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.MAKE_SHORTER}
        onClick={handleClick(TextImproveAction.MAKE_SHORTER)}
      >
        <ListItemIcon>
          <ShortTextIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="make.shorter" defaultMessage="Make shorter" />
          }
        />
      </ListItemButton>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.MAKE_LONGER}
        onClick={handleClick(TextImproveAction.MAKE_LONGER)}
      >
        <ListItemIcon>
          <NotesIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="make.longer" defaultMessage="Make longer" />
          }
        />
      </ListItemButton>
      <ListItemButton
        disabled={disabled}
        selected={value === TextImproveAction.GENERATE_IMAGE}
        onClick={handleClick(TextImproveAction.GENERATE_IMAGE)}
      >
        <ListItemIcon>
          <ImageIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage
              id="generate.image"
              defaultMessage="Generate image"
            />
          }
        />
      </ListItemButton>
    </List>
  );
}
