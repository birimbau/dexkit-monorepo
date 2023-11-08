import { initializeConnector } from "@web3-react/core";

import { MagicApiKey } from "../magic";

import { MagicConnector } from "../../connectors/magic";

export const [magic, magicHooks] = initializeConnector<MagicConnector>(
  (actions) => {
    const instance = new MagicConnector({
      actions,
      options: {
        apiKey: MagicApiKey,
      },
    });

    return instance;
  }
);
