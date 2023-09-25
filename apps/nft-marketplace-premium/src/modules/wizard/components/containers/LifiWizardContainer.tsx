import { SwapConfig } from '@/modules/swap/types';
import { Token as WidgetToken } from '@dexkit/widgets/src/types';

import { ThemeProvider } from '@lifi/widget/providers';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CssVarsTheme, Theme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Token } from 'src/types/blockchain';
import { AppConfig } from '../../../../types/config';
import { StepperButtonProps } from '../../types';
import { SwapPageSection } from '../../types/section';
import { StepperButtons } from '../steppers/StepperButtons';

const LiFiWidget = dynamic(() =>
  import('@lifi/widget').then((module) => module.LiFiWidget),
);

interface Props {
  config: AppConfig;
  swapTheme: Omit<Theme, 'palette'> & CssVarsTheme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function LifiWizardContainer({
  config,
  swapTheme,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const [swapFormData, setSwapFormData] = useState<SwapConfig | undefined>(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'swap',
      ) as SwapPageSection
    )?.config,
  );

  const featuredTokens = useMemo<WidgetToken[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    return tokens.map<WidgetToken>((t: Token) => {
      return {
        contractAddress: t.address,
        chainId: t.chainId as number,
        decimals: t.decimals,
        name: t.name,
        symbol: t.symbol,
      } as WidgetToken;
    });
  }, [config]);

  const tokens = useMemo<Token[]>(() => {
    return config?.tokens?.length ? config?.tokens[0].tokens || [] : [];
  }, [config]);

  const changeConfig = function (
    configToChange: AppConfig,
    formData?: SwapConfig,
  ) {
    const newConfig = { ...configToChange };
    const swapSectionPageIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'swap',
    );
    let editSwapSection: SwapPageSection;
    if (formData) {
      if (swapSectionPageIndex !== -1) {
        editSwapSection = {
          ...(newConfig.pages['home']?.sections[
            swapSectionPageIndex
          ] as SwapPageSection),
          config: formData,
        };
        newConfig.pages['home'].sections[swapSectionPageIndex] =
          editSwapSection;
      } else {
        editSwapSection = {
          title: 'Swap',
          type: 'swap',
          config: formData,
        };
        newConfig.pages['home']?.sections.push(editSwapSection);
      }
    }
    return newConfig;
  };

  const { provider } = useWeb3React();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="tokens" defaultMessage="Tokens" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="choose.default.settings.for.swap.interface"
              defaultMessage="Choose default settings for swap interface"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        {/* TODO: form */}
      </Grid>
      <Grid item xs={12} sm={6}>
        <ThemeProvider>
          <LiFiWidget
            integrator="dexkit"
            walletManagement={{
              async connect() {
                if (!provider) {
                  throw new Error('');
                }

                return provider?.getSigner() as Signer;
              },
              async disconnect() {},
            }}
            config={{
              variant: 'default',
              containerStyle: {
                border: `1px solid rgb(234, 234, 234)`,
                borderRadius: '16px',
              },
            }}
          />
        </ThemeProvider>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {isOnStepper ? (
          <StepperButtons
            {...stepperButtonProps}
            handleNext={() => {
              if (stepperButtonProps?.handleNext) {
                stepperButtonProps.handleNext();
              }
            }}
            disableContinue={false}
          />
        ) : (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary">
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
