

import { NETWORKS } from '@dexkit/core/constants/networks'
//import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Actions, Connector } from '@web3-react/types'

import { useSyncExternalStore } from 'react'
import { EIP6963 } from '../constants/connectors/eip6963'
import { getDeprecatedInjection, getIsCoinbaseWallet, getIsInjected, getIsMetaMaskWallet } from '../constants/connectors/utils'
import { WalletConnectV2 } from '../constants/connectors/walletConnect'
import { COINBASE_WALLET_ICON, DISCORD_ICON, EMAIL_ICON, GOOGLE_ICON, TWITTER_ICON, WALLET_CONNECT_ICON } from '../constants/icons'
import { MagicApiKey } from '../constants/magic'
import { Connection, ConnectionType, ProviderInfo } from '../types'
import { isMobile } from '../utils/userAgent'
import { MagicConnector } from './magic'


const rpcs: { [key: number]: string } = {};

for (const key in NETWORKS) {
  if (NETWORKS[key].providerRpcUrl) {
    rpcs[key] = NETWORKS[key].providerRpcUrl as string;
  }
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

export type InjectedConnection = Connection & {
  /** Returns a copy of the connection with metadata & activation for a specific extension/provider */
  wrap: (providerInfo: ProviderInfo) => Connection | undefined
  /** Sets which extension/provider the connector should activate */
  selectRdns(rdns: string): void
}

const [eip6963, eip6963hooks] = initializeConnector<EIP6963>((actions) => new EIP6963({ actions, onError }))
// Since eip6963 wallet are `announced` dynamically after compile-time, but web3provider required connectors to be statically defined,
// we define a static eip6963Connection object that provides access to all eip6963 wallets. The `wrap` function is used to obtain a copy
// of the connection with metadata & activation for a specific extension/provider.
export const eip6963Connection: InjectedConnection = {
  getProviderInfo: () => eip6963.provider.currentProviderDetail?.info ?? { name: `Browser Wallet` },
  selectRdns: (rdns: string) => eip6963.selectProvider(rdns),
  connector: eip6963,
  hooks: eip6963hooks,
  type: ConnectionType.EIP_6963_INJECTED,
  shouldDisplay: () => false, // Since we display each individual eip6963 wallet, we shouldn't display this generic parent connection
  wrap(providerInfo: ProviderInfo) {
    const { rdns } = providerInfo
    if (!rdns) return undefined
    return {
      ...this,
      getProviderInfo: () => providerInfo,
      overrideActivate() {

        eip6963.selectProvider(rdns) // Select the specific eip6963 provider before activating
        return false
      },
      shouldDisplay: () => true, // Individual eip6963 wallets should always be displayed
    }
  },
}
const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsInjectedMobileBrowser = () => getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()
const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() && !isMobile && (!getIsInjected() || getIsCoinbaseWallet())

const getIsGenericInjector = () => getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))

export const deprecatedInjectedConnection: Connection = {
  getProviderInfo: () => getDeprecatedInjection() ?? { name: `Browser Wallet` },
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  shouldDisplay: () => getIsMetaMaskWallet() || getShouldAdvertiseMetaMask() || getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      window.open('https://metamask.io/', 'inst_metamask')
      return true
    }
    return false
  },
}


export const walletConnectV2Connection: Connection = new (class implements Connection {
  private initializer = (actions: Actions, defaultChainId = 1) =>
    new WalletConnectV2({ actions, defaultChainId, onError })

  type = ConnectionType.WALLET_CONNECT_V2
  getName = () => 'WalletConnect'
  getIcon = () => WALLET_CONNECT_ICON
  getProviderInfo = () => ({
    name: 'WalletConnect',
    icon: WALLET_CONNECT_ICON,
    rdns: 'walletconnectv2'
  })
  shouldDisplay = () => !getIsInjectedMobileBrowser()

  private activeConnector = initializeConnector<WalletConnectV2>(this.initializer)
  // The web3-react Provider requires referentially stable connectors, so we use proxies to allow lazy connections
  // whilst maintaining referential equality.
  private proxyConnector = new Proxy(
    {},
    {
      get: (target, p, receiver) => Reflect.get(this.activeConnector[0], p, receiver),
      getOwnPropertyDescriptor: (target, p) => Reflect.getOwnPropertyDescriptor(this.activeConnector[0], p),
      getPrototypeOf: () => WalletConnectV2.prototype,
      set: (target, p, receiver) => Reflect.set(this.activeConnector[0], p, receiver),
    }
  ) as (typeof this.activeConnector)[0]
  private proxyHooks = new Proxy(
    {},
    {
      get: (target, p, receiver) => {
        return () => {
          // Because our connectors are referentially stable (through proxying), we need a way to trigger React renders
          // from outside of the React lifecycle when our connector is re-initialized. This is done via 'change' events
          // with `useSyncExternalStore`:
          if (typeof window !== "undefined") {
            const hooks = useSyncExternalStore(
              (onChange) => {
                this.onActivate = onChange
                return () => (this.onActivate = undefined)
              },
              () => this.activeConnector[1],
              () => this.activeConnector[1]
            )
            return Reflect.get(hooks, p, receiver)()
          }
        }
      },
    }
  ) as (typeof this.activeConnector)[1]

  private onActivate?: () => void

  overrideActivate = (chainId?: number) => {
    // Always re-create the connector, so that the chainId is updated.
    this.activeConnector = initializeConnector((actions) => this.initializer(actions, chainId))
    this.onActivate?.()
    return false
  }

  get connector() {
    return this.proxyConnector
  }
  get hooks() {
    return this.proxyHooks
  }
})()


/*const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: rpcs[1],
        appName: 'Wallet',

      },
      onError,
    })
)
export const coinbaseWalletConnection: Connection = {
  getProviderInfo: () => ({ name: 'Coinbase Wallet', icon: COINBASE_WALLET_ICON }),
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  shouldDisplay: () =>
    Boolean((isMobile && !getIsInjectedMobileBrowser()) || !isMobile || getIsCoinbaseWalletBrowser()),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open('https://go.cb-w.com/mtUDhEZPy1', 'cbwallet')
      return true
    }
    return false
  },
}*/


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

const magicConnection: Connection = {
  getProviderInfo: () => ({ name: 'Magic Wallet', icon: COINBASE_WALLET_ICON }),
  connector: magic,
  hooks: magicHooks,
  type: ConnectionType.MAGIC,
  shouldDisplay: () => !getIsInjectedMobileBrowser(),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    return false
  },
}

const emailConnection: Connection = {
  ...magicConnection,
  loginType: 'email',
  getProviderInfo: () => ({ name: 'Email', icon: EMAIL_ICON, rdns: 'magic.email' }),
}
const googleConnection: Connection = {
  ...magicConnection,
  loginType: 'google',
  getProviderInfo: () => ({ name: 'Google', icon: GOOGLE_ICON, rdns: 'magic.google' }),
}
const twitterConnection: Connection = {
  ...magicConnection,
  loginType: 'twitter',
  getProviderInfo: () => ({ name: 'Twitter', icon: TWITTER_ICON, rdns: 'magic.twitter' }),
}
const discordConnection: Connection = {
  ...magicConnection,
  loginType: 'discord',
  getProviderInfo: () => ({ name: 'Discord', icon: DISCORD_ICON, rdns: 'magic.discord' }),
}

export const connectionsList = [
  deprecatedInjectedConnection,
  eip6963Connection,
  walletConnectV2Connection,
  // coinbaseWalletConnection,

  googleConnection,
  twitterConnection,
  discordConnection
]


export const connections = [
  deprecatedInjectedConnection,
  emailConnection,
  googleConnection,
  twitterConnection,
  discordConnection,
  eip6963Connection,
  walletConnectV2Connection,
  // coinbaseWalletConnection,
]

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = connections.find((connection) => connection.connector === c)
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return deprecatedInjectedConnection
      /*   case ConnectionType.COINBASE_WALLET:
           return coinbaseWalletConnection*/
      case ConnectionType.WALLET_CONNECT_V2:
        return walletConnectV2Connection
      case ConnectionType.EIP_6963_INJECTED:
        return eip6963Connection
      case ConnectionType.MAGIC:
        return magicConnection
    }
  }
}