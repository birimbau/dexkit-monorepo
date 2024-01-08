import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
} from "@mui/material";
import { useActiveNetworks } from "../hooks/networks";

export interface NetworkListProps {
  chainId?: number;
  onSelect?: (chainId: number) => void;
  siteId?: number;
}

export default function NetworkList({
  chainId,
  onSelect,
  siteId,
}: NetworkListProps) {
  const activeNetworks = useActiveNetworks({
    limit: 1000,
    page: 1,
    query: "",
    siteId,
  });

  return (
    <List disablePadding>
      {activeNetworks.data?.pages[0]?.map((network: any, index: number) => (
        <ListItemButton
          onClick={() => (onSelect ? onSelect(network.chainId) : undefined)}
          key={index}
        >
          <ListItemAvatar>
            <Avatar alt={network.name} />
          </ListItemAvatar>
          <ListItemText primary={network.name} />
          {onSelect && (
            <ListItemSecondaryAction>
              <Radio name="chainId" checked={network.chainId === chainId} />
            </ListItemSecondaryAction>
          )}
        </ListItemButton>
      ))}
    </List>
  );
}
