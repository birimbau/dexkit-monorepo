import { useConnectWalletDialog } from '@dexkit/ui';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';
import dynamic from 'next/dynamic';

export const LiFiWidget = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget),
  {
    ssr: false,
  },
);

export const LIFISection = () => {
  const connectWalletDialog = useConnectWalletDialog();
  const { provider, account } = useWeb3React();

  return <LiFiWidget 
  integrator={'dexkit'} 
  walletManagement={{
    async connect() {
      if(!account){
        connectWalletDialog.setOpen(true)
      } 
    

      return provider?.getSigner() as Signer;
    },
    async disconnect() {


    },
  }}
  
  
  />;
};