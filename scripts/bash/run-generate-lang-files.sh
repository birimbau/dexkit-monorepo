#!/bin/bash
yarn --cwd ./apps/nft-marketplace-premium  generate-lang-files
yarn --cwd ./packages/dexkit-exchange  generate-lang-files
yarn --cwd ./packages/dexkit-unlock  generate-lang-files
yarn --cwd ./packages/dexkit-ui  generate-lang-files
yarn --cwd ./packages/dexkit-widgets  generate-lang-files
yarn --cwd ./packages/web3forms  generate-lang-files
yarn merge-lang-main-files
yarn --cwd ./apps/nft-marketplace-premium process-all-translations