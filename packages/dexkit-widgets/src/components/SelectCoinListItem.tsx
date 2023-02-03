import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { memo } from "react";
import { Token } from "../types";

export interface SelectCoinListItemProps {
  token: Token;
  onSelect: (token: Token) => void;
}

function SelectCoinListItem({ token, onSelect }: SelectCoinListItemProps) {
  return (
    <ListItemButton onClick={() => onSelect(token)}>
      <ListItemAvatar>
        <Avatar />
      </ListItemAvatar>
      <ListItemText primary={token.symbol.toUpperCase()} />
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
