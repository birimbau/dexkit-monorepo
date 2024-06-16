import { Token } from "@dexkit/core/types";
import { Avatar, ButtonBase, Stack } from "@mui/material";
import { useMemo } from "react";
import { useRecentTokens } from "../../../hooks";

export interface SelectTokenShortcutMatchaProps {
  onSelectToken: (token: Token) => void;
}

export default function SelectTokenShortcutMatcha({
  onSelectToken,
}: SelectTokenShortcutMatchaProps) {
  const recentTokens = useRecentTokens();

  const tokens = useMemo(() => {
    if (recentTokens.tokens.length >= 3) {
      return recentTokens.tokens.slice(0, 3);
    }

    return [];
  }, []);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {tokens.map((t, key) => (
        <ButtonBase
          key={key}
          onClick={() => onSelectToken(t)}
          sx={(theme) => ({
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : theme.palette.grey[300],
            height: theme.spacing(4),
            width: theme.spacing(4),
            borderRadius: "50%",
            p: 1,
          })}
        >
          <Avatar
            src={t.logoURI}
            sx={(theme) => ({
              height: theme.spacing(3),
              width: theme.spacing(3),
            })}
          />
        </ButtonBase>
      ))}
    </Stack>
  );
}
