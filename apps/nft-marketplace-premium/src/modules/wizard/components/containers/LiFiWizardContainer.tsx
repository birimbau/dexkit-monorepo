import { SwapConfig } from '@/modules/swap/types';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  CssVarsTheme,
  Theme,
} from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Token } from 'src/types/blockchain';
import { AppConfig } from '../../../../types/config';
import { StepperButtonProps } from '../../types';
import { SwapLiFiPageSection, SwapPageSection } from '../../types/section';
import { SwapConfigForm } from '../forms/SwapConfigForm';
import { StepperButtons } from '../steppers/StepperButtons';
const LiFiSection = dynamic(() => import('../sections/LiFiSection'));
interface Props {
  config: AppConfig;
  swapTheme: Omit<Theme, 'palette'> & CssVarsTheme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function LiFiWizardContainer({
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
        (s) => s.type === 'swap-lifi',
      ) as SwapPageSection
    )?.config,
  );

  const featuredTokens = useMemo<Token[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    return tokens.map<Token>((t: Token) => {
      return {
        address: t.address,
        chainId: t.chainId as number,
        decimals: t.decimals,
        name: t.name,
        logoURI: t.logoURI,
        symbol: t.symbol,
      } as Token;
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
      (s) => s.type === 'swap-lifi',
    );
    let editSwapSection: SwapLiFiPageSection;
    if (formData) {
      if (swapSectionPageIndex !== -1) {
        editSwapSection = {
          ...(newConfig.pages['home']?.sections[
            swapSectionPageIndex
          ] as SwapLiFiPageSection),
          config: formData,
        };
        newConfig.pages['home'].sections[swapSectionPageIndex] =
          editSwapSection;
      } else {
        editSwapSection = {
          title: 'Swap',
          type: 'swap-lifi',
          config: formData,
        };
        newConfig.pages['home']?.sections.push(editSwapSection);
      }
    }
    return newConfig;
  };

  const handleSave = () => {
    onSave(changeConfig(config, swapFormData));
  };

  const handleOnChange = (form: SwapConfig) => {
    setSwapFormData(form);
    onChange(changeConfig(config, swapFormData));
  };

  useEffect(() => {
    onChange(changeConfig(config, swapFormData));
  }, [swapFormData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
            <FormattedMessage id="tokens" defaultMessage="Tokens" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="choose.default.settings.for.lifi.swap.interface"
              defaultMessage="Choose default settings for LiFi swap interface"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <SwapConfigForm
          onChange={setSwapFormData}
          data={swapFormData}
          featuredTokens={tokens}
        />
      </Grid>
      <Grid item xs={6}>
        <CssVarsProvider theme={swapTheme}>
          <LiFiSection
            section={{
              type: 'swap-lifi',
              config: {
                featuredTokens: featuredTokens,
                defaultChainId: swapFormData?.defaultEditChainId,
                configByChain: swapFormData?.configByChain
                  ? swapFormData?.configByChain
                  : {},
              },
            }}
            isEdit={true}
          />
        </CssVarsProvider>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {isOnStepper ? (
          <StepperButtons
            {...stepperButtonProps}
            handleNext={() => {
              handleSave();
              if (stepperButtonProps?.handleNext) {
                stepperButtonProps.handleNext();
              }
            }}
            disableContinue={false}
          />
        ) : (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
