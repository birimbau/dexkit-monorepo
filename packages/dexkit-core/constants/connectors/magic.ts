import { initializeConnector } from "@web3-react/core";

import { MagicApiKey } from "../../constants/magic";

import { MagicConnector } from "../../types/magic";

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
