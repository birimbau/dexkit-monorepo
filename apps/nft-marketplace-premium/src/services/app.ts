import { AppConfig } from '../types/config';

import { AssetAPI } from 'src/types/nft';
import appBoredApeJson from '../../config/app.boredape.json';
import appCryptoPunksJson from '../../config/app.cryptopunks.json';
import appConfigJson from '../../config/app.json';
import appMutantBoredApeJson from '../../config/app.mutantboredape.json';
import { getConfig } from './whitelabel';


export async function getAppConfig(site?: string): Promise<{ appConfig: AppConfig, appNFT?: AssetAPI }> {
  /**/
  if (site === 'boredapes.dexkit.com') {
    return Promise.resolve({ appConfig: appBoredApeJson as AppConfig });
  }

  if (site === 'mutantboredapes.dexkit.com') {
    return Promise.resolve({ appConfig: appMutantBoredApeJson as AppConfig });
  }

  if (site === 'cryptopunks.dexkit.com') {
    return Promise.resolve({ appConfig: appCryptoPunksJson as AppConfig });
  }
  if (site?.startsWith('whitelabel-nft.dexkit.com')) {
    const slug = site.split(':');
    if (slug.length > 1) {
      const configResponse = (await getConfig({ slug: slug[1] })).data;
      if (configResponse) {
        return { appConfig: JSON.parse(configResponse.config) as AppConfig, appNFT: configResponse.nft };
      }
    }
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  if (site?.startsWith('dexkit.app')) {
    const slug = site.split(':');
    if (slug.length > 1) {
      const configResponse = await (await getConfig({ slug: slug[1] })).data;
      if (configResponse) {
        return { appConfig: JSON.parse(configResponse.config) as AppConfig, appNFT: configResponse.nft };
      }
    }
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  //@ts-ignore
  if (site?.startsWith('localhost')) {
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  //@ts-ignore
  if (site?.endsWith('dex-kit.vercel.app')) {
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  //@ts-ignore
  if (site?.endsWith('.vercel.app')) {
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  const configResponse = (await getConfig({ domain: site })).data;
  if (configResponse) {
    return { appConfig: JSON.parse(configResponse.config) as AppConfig, appNFT: configResponse.nft };
  }

  throw new Error('Oops, something went wrong')

  // return appConfigJson as Promise<AppConfig>;
}
