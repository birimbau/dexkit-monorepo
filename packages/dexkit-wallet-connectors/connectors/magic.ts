import { OAuthExtension } from "@magic-ext/oauth";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
import type {
  Actions,
} from '@web3-react/types';


import { Connector } from "@web3-react/types";
import { EventEmitter } from "events";

import { waitForEvent } from "../utils";

import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { parseChainId } from "@dexkit/core/utils";


export const MAGIC_EVENT_EXECUTE = "execute";
export const MAGIC_EVENT_REQUEST = "request";
export const MAGIC_EVENT_CANCEL = "cancel";



export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export type MagicConnectOptions = {
  apiKey: string;
};

export interface MagicConnectConstructorArgs {
  actions: Actions;
  options: MagicConnectOptions;
}

export class ProviderWrapper {
  public provider: any;
  public eventEmitter: EventEmitter;

  constructor(provider: any, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.provider = provider;
  }

  async request(args: RequestArguments) {
    if (
      args.method === "eth_sendTransaction" ||
      args.method === "eth_sendRawTransaction"
    ) {
      this.eventEmitter.emit(MAGIC_EVENT_REQUEST, args);

      const newArgs = await waitForEvent(
        this.eventEmitter,
        "execute",
        "cancel"
      );

      return this.provider.request(newArgs);
    } else if (args.method === "personal_sign") {
      this.eventEmitter?.emit("sign", args);

      await waitForEvent(this.eventEmitter, "sign.confirm", "sign.cancel");

      return this.provider.request(args);
    }

    return this.provider.request(args);
  }
}

export type MagicLoginType = "email" | "google" | "twitter" | "discord";

export class MagicConnector extends Connector {
  private options: MagicConnectOptions;
  eventEmitter: EventEmitter;
  loginType?: MagicLoginType;
  type?: string = 'magic';
  magicInstance?: InstanceWithExtensions<SDKBase, OAuthExtension[]>;

  constructor({ actions, options }: MagicConnectConstructorArgs) {
    super(actions);
    this.options = options;
    this.eventEmitter = new EventEmitter();

    if (typeof window !== "undefined") {
      const loginType = localStorage.getItem("loginType");

      if (loginType) {
        this.loginType = loginType as MagicLoginType;
      }
    }
  }

  get providerWrapper(): ProviderWrapper | undefined {
    return this.provider as any;
  }

  public async login({
    loginType,
    email,
    redirectUrl,
  }: {
    loginType?: MagicLoginType;
    email?: string;
    redirectUrl?: string;
  }) {
    //@ts-ignore
    const magic: InstanceWithExtensions<SDKBase, OAuthExtension[]> | undefined =
      this.magicInstance;
    console.log(loginType);
    console.log(window);
    if (typeof window !== "undefined" && loginType) {
      localStorage.setItem("loginType", loginType);
    }

    if (magic) {
      const isLoggedIn = await magic.user.isLoggedIn();

      if (!isLoggedIn) {
        if (loginType === "email" && email) {
          const result = await magic.auth.loginWithMagicLink({ email });

          if (result) {
            await this.initProvider();
            await this.initWallet();
          }
        } else if (loginType === "twitter" && redirectUrl) {

          await magic.oauth.loginWithRedirect({
            provider: "twitter",
            redirectURI: redirectUrl,
            scope: ["user:email"],
          });

          await this.initProvider();
          await this.initWallet();
        } else if (loginType === "google" && redirectUrl) {

          await magic.oauth.loginWithRedirect({
            provider: "google",
            redirectURI: redirectUrl,
          })
        }
        else if (loginType === "discord" && redirectUrl) {

          await magic.oauth.loginWithRedirect({
            provider: "discord",
            redirectURI: redirectUrl,
          });

          await this.initProvider();
          await this.initWallet();
        }
      }
    }
  }

  public async isLoggedIn() {
    return await this.magicInstance?.user.isLoggedIn();
  }

  // don't throw error
  public async connectEagerly(...args: unknown[]): Promise<void> {
    if (!this.magicInstance) {
      await this.initMagicInstances();

      if (await this.isLoggedIn()) {
        await this.initProvider();
        await this.initWallet();
      }
    }
  }

  public async deactivate(...args: unknown[]): Promise<void> {
    await this.magicInstance?.user.logout();

    this.provider = undefined;

    if (typeof window !== "undefined") {
      localStorage.removeItem("loginType");
    }

    this.actions.resetState();
  }

  public async changeNetwork(chainId: number) {
    await this.initMagicInstances(chainId);
    await this.initProvider();
    await this.initWallet();
  }

  public async initMagicInstances(chainId?: number): Promise<any> {
    return import("magic-sdk").then(async (m) => {
      return import("@magic-ext/oauth").then(async (oauth) => {
        const network = NETWORKS[chainId || ChainId.Polygon];

        const customNode = {
          // magic not allow the default rpc used
          rpcUrl:
            network.chainId === ChainId.BSC
              ? "https://bsc-dataseed1.binance.org/"
              : (network?.providerRpcUrl as string),
          chainId: network?.chainId,
        };

        this.magicInstance = new m.Magic(this.options.apiKey, {
          network: chainId !== ChainId.Ethereum ? customNode : undefined,
          extensions: [new oauth.OAuthExtension()],
        });

        if (!(await this.magicInstance.user.isLoggedIn())) {
          try {

            await this.magicInstance.oauth.getRedirectResult();
          } catch (err) { }
        }
      });
    });
  }

  private async initProvider(): Promise<any> {
    if (this.magicInstance) {
      //@ts-ignore
      this.provider = new ProviderWrapper(
        this.magicInstance.rpcProvider,
        this.eventEmitter
      );
    }
  }

  public async initWallet() {
    if (this.provider) {
      return await Promise.all([
        this.provider.request({
          method: "eth_chainId",
        }) as Promise<string>,
        this.provider.request({ method: "eth_accounts" }) as Promise<string[]>,
      ])
        .then(([chainId, accounts]) => {
          const receivedChainId = parseChainId(chainId);
          // if there's no desired chain, or it's equal to the received, update
          return this.actions.update({
            chainId: receivedChainId,
            accounts,
          });
        })
        .catch((error) => {
          this.eventEmitter.removeAllListeners();
          throw error;
        });
    }
  }

  async activate({
    loginType,
    email,
    redirectUrl,
  }: {
    desiredNetworkId?: string;
    loginType?: MagicLoginType;
    email?: string;
    redirectUrl?: string;
  }): Promise<void> {
    let cancelActivation: () => void;
    cancelActivation = this.actions.startActivation();

    // if provider is passed we just use it

    if (!(await this.isLoggedIn())) {
      await this.initMagicInstances();
      await this.login({ loginType, email, redirectUrl }).catch((err) =>
        cancelActivation()
      );
    }
  }
}
