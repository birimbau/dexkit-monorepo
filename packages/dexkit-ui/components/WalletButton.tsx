import { truncateAddress } from "@dexkit/core/utils/blockchain";
import { AccountBalance } from "@dexkit/ui/components/AccountBalance";
import { useConnectorImage } from "@dexkit/wallet-connectors/hooks/useConnectorImage";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Box,
  ButtonBase,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useIsBalanceVisible } from "../modules/wallet/hooks";

const WalletContent = dynamic(() => import("./WalletContent"));

export interface WalletButtonProps {
  align?: "center" | "left";
  onSend?: () => void;
  onReceive?: () => void;
}

export function WalletButton({ align }: WalletButtonProps) {
  const { account, ENSName, connector } = useWeb3React();

  const isBalancesVisible = useIsBalanceVisible();

  const icon = useConnectorImage({ connector });

  const justifyContent = align === "left" ? "flex-start" : "center";

  const [showContent, setShowContent] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setShowContent(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowContent(false);
  };

  return (
    <>
      <ButtonBase
        id="wallet-button"
        sx={(theme) => ({
          px: 1,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.spacing(1),
          justifyContent,
        })}
        onClick={handleClick}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src={icon}
            sx={(theme) => ({
              width: theme.spacing(2),
              height: theme.spacing(2),
              background: theme.palette.action.hover,
            })}
            variant="rounded"
          />
          <Box>
            <Typography variant="caption" align="left" component="div">
              {isBalancesVisible
                ? ENSName
                  ? ENSName
                  : truncateAddress(account)
                : "**********"}
            </Typography>
            <div>
              {false && (
                <AccountBalance isBalancesVisible={isBalancesVisible} />
              )}
            </div>
          </Box>
          {showContent ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Stack>
      </ButtonBase>
      {showContent && (
        <Popover
          open={showContent}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          onClose={handleClose}
        >
          <WalletContent />
        </Popover>
      )}
    </>
  );
}
