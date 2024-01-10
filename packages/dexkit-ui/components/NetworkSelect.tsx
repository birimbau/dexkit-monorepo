import { parseChainId } from "@dexkit/core/utils";
import {
  Avatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useActiveNetworks } from "../hooks/networks";

export interface NetworkListProps {
  chainId?: number;
  onSelect?: (chainId?: number) => void;
  siteId?: number;
}

export default function NetworkSelect({
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

  const selectedNetwork = useMemo(() => {
    return activeNetworks.data?.pages[0]?.find(
      (n: any) => n.chainId === chainId
    );
  }, [chainId, activeNetworks.data]);

  console.log(selectedNetwork, activeNetworks.data);

  return (
    <Select
      value={chainId}
      onChange={(e) =>
        onSelect ? onSelect(parseChainId(e.target.value)) : undefined
      }
      renderValue={(value) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            <Avatar
              src={selectedNetwork?.imageUrl || ""}
              sx={(theme) => ({
                width: theme.spacing(2.5),
                height: theme.spacing(2.5),
              })}
            />
            <Typography variant="body1">{selectedNetwork?.name}</Typography>
          </Stack>
        );
      }}
    >
      {activeNetworks.data?.pages[0]?.map((network: any) => (
        <MenuItem value={network.chainId}>
          <ListItemIcon>
            <Avatar
              src={network.imageUrl}
              sx={(theme) => ({
                width: theme.spacing(2.5),
                height: theme.spacing(2.5),
              })}
              alt={network.name}
            />
          </ListItemIcon>
          <ListItemText primary={network.name} />
        </MenuItem>
      ))}
    </Select>
  );
}
