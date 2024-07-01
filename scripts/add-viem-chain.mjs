import fs from "fs";
import * as chains from "viem/chains";

import { EVM_NETWORKS } from "@dexkit/evm-chains";

async function generateViemNetworks() {
  const data = EVM_NETWORKS;
  const viewNetworkKeys = Object.keys(chains);
  const viemNetworks = [];
  const allViemNetworks = [];

  for (let index = 0; index < viewNetworkKeys.length; index++) {
    const networkKey = viewNetworkKeys[index];
    const viemNetwork = chains[networkKey];

    allViemNetworks.push({ ...viemNetwork, key: networkKey });
  }

  for (let index = 0; index < data.length; index++) {
    const net = data[index];
    const network = allViemNetworks.find((ch) => ch.id === net.chainId);
    if (network) {
      viemNetworks.push(network.key);
    } else {
      console.log(
        `you need to define network ${net.name} with chainId ${net.chainId}`
      );
    }
  }

  await fs.writeFileSync(
    "./packages/dexkit-core/constants/chainsViem.ts",
    `
  import type { Chain } from 'viem';
  import {${viemNetworks.join(",")}} from "viem/chains"

  const chainsViem = [${viemNetworks.join(",")}] as  [Chain, ...Chain[]];

  export {chainsViem}
  
  
  `
  );
}

generateViemNetworks();
