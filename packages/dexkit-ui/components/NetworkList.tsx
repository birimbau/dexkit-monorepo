import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useActiveNetworks } from "../hooks/networks";

export interface NetworkListProps {
  chainId?: number;
  onSelect?: (chainId: number) => void;
  siteId?: number;
  connectorChainId?: number;
}

export default function NetworkList({
  chainId,
  onSelect,
  siteId,
  connectorChainId,
}: NetworkListProps) {
  const activeNetworks = useActiveNetworks({
    limit: 1000,
    page: 1,
    query: "",
    siteId,
  });

  if (!activeNetworks.data) {
    return (
      <Stack sx={{ p: 2 }}>
        <Box>
          <Typography textAlign="center" variant="h5">
            <FormattedMessage id="no.networks" defaultMessage="No networks" />
          </Typography>
          <Typography textAlign="center" variant="body1" color="text.secondary">
            <FormattedMessage
              id="no.networks.are.available"
              defaultMessage="No networks are available"
            />
          </Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <List disablePadding>
      {activeNetworks.isLoading &&
        new Array(5).fill(null).map(() => (
          <ListItem>
            <ListItemAvatar>
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
            </ListItemAvatar>
            <ListItemText primary={<Skeleton />} />
          </ListItem>
        ))}

      {activeNetworks.data?.pages[0]
        ?.filter((n: any) => n.chainId !== connectorChainId)
        .map((network: any, index: number) => (
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
