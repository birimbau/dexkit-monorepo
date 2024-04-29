import { lighten } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import type { ThirdwebClient } from "thirdweb";
import type { WalletId } from "thirdweb/wallets";
import { useWalletImage, useWalletInfo } from "./hooks/useWalletInfo";
import { getInstalledWalletProviders } from "./utils/injectedProviders";

export function WalletImage(props: { id: WalletId; client: ThirdwebClient }) {
  const mipdImage = getInstalledWalletProviders().find(
    (provider) => provider.info.rdns === props.id
  )?.info.icon;

  /* if (mipdImage) {
    return (
      <Img
        src={mipdImage}
        width={props.size}
        height={props.size}
        loading="eager"
        client={props.client}
        style={{
          borderRadius: radius.md,
        }}
      />
    );
  }*/

  return <WalletImageQuery id={props.id} client={props.client} />;
}

function WalletImageQuery(props: { id: WalletId; client: ThirdwebClient }) {
  const walletImage = useWalletImage(props.id);
  const walletInfo = useWalletInfo(props.id);
  return (
    <Avatar
      sx={(theme) => ({
        background: lighten(theme.palette.background.default, 0.05),
        padding: theme.spacing(1),
        width: "auto",
        height: theme.spacing(5),
      })}
      src={walletImage.data}
      alt={walletInfo.data?.name || " "}
    />
  );
}
