import { ChainId } from "@dexkit/core";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { parseChainId } from "@dexkit/core/utils";
import { Card, SelectChangeEvent } from "@mui/material";
import { ReactNode, useMemo, useState } from "react";
import { useActiveChainIds } from "../../../../hooks";
import { CHECKOUT_TOKENS } from "../../constants";
import useUserCheckoutNetworks from "../../hooks/useUserCheckoutNetworks";

export default function PaymentCard() {
  const { activeChainIds } = useActiveChainIds();

  const [chainId, setChainId] = useState<ChainId>();

  const [token, setToken] = useState<Token>();

  const { data: availNetworks } = useUserCheckoutNetworks({ id: "" as string });

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .map((key: string) => NETWORKS[parseChainId(key)])
      .filter((n) => availNetworks?.includes(n.chainId))
      .filter((n) => {
        let token = CHECKOUT_TOKENS.find((t) => t.chainId === n.chainId);

        return Boolean(token);
      });
  }, [availNetworks]);

  const handleChangeNetwork = (
    e: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    const newChainId = e.target.value as number;

    setChainId(newChainId);

    let newToken = CHECKOUT_TOKENS.filter((t) => t.chainId === newChainId)[0];

    setToken(newToken);
  };

  return (
    <Card>
      {/* <CardContent>
        <Stack spacing={2}>
          {chainId !== undefined && (
            <FormControl fullWidth>
              <InputLabel>
                <FormattedMessage id="network" defaultMessage="Network" />
              </InputLabel>
              <Select
                label={
                  <FormattedMessage id="network" defaultMessage="Network" />
                }
                onChange={handleChangeNetwork}
                value={chainId}
                name="network"
                fullWidth
                renderValue={(value: number) => {
                  return (
                    <Stack
                      direction="row"
                      alignItems="center"
                      alignContent="center"
                      spacing={1}
                    >
                      <Avatar
                        src={ipfsUriToUrl(
                          networks.find((n) => n.chainId === chainId)
                            ?.imageUrl || ""
                        )}
                        style={{ width: "1rem", height: "1rem" }}
                      />
                      <Typography variant="body1">
                        {networks.find((n) => n.chainId === chainId)?.name}
                      </Typography>
                    </Stack>
                  );
                }}
              >
                {networks
                  .filter((n) => activeChainIds.includes(n.chainId))
                  .map((n) => (
                    <MenuItem key={n.chainId} value={n.chainId}>
                      <ListItemIcon>
                        <Avatar
                          src={ipfsUriToUrl(n?.imageUrl || "")}
                          style={{ width: "1rem", height: "1rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={n.name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          <CheckoutTokenAutocomplete
            key={chainId}
            tokens={CHECKOUT_TOKENS}
            onChange={handleChangeToken}
            chainId={chainId}
            token={token}
            disabled={disabled}
          />
          {!token && (
            <Alert severity="error">
              <FormattedMessage
                id="select.a.token.to.pay"
                defaultMessage="Select a token to pay"
              />
            </Alert>
          )}

          {userCheckout.data?.requireEmail && (
            <TextField
              value={email}
              onChange={handleChangeEmail}
              fullWidth
              label={<FormattedMessage id="email" defaultMessage="Email" />}
              type="email"
              error={!isValidEmail || email === ""}
              helperText={
                !isValidEmail || !Boolean(email) ? (
                  <FormattedMessage
                    id="email.is.required"
                    defaultMessage="Email is required"
                  />
                ) : undefined
              }
              required
            />
          )}

          {token && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">
                <FormattedMessage id="balance" defaultMessage="Balance" />
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {balanceQuery.isLoading ? (
                  <Skeleton />
                ) : (
                  <FormattedNumber
                    value={decimalBalance.toNumber()}
                    maximumFractionDigits={token?.decimals}
                  />
                )}{" "}
                {token?.symbol}
              </Typography>
            </Stack>
          )}

          {renderPayButton()}
        </Stack> 
        
        </CardContent>
        */}
    </Card>
  );
}
