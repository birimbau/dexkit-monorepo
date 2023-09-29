import { NoSsr } from '@mui/base';
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
import { LifiSettings } from 'src/types/lifi';
import { AppConfig } from '../../../../types/config';
import { StepperButtonProps } from '../../types';
import { LifiPageSection } from '../../types/section';
import LifiSettingsForm from '../forms/LifiSettingsForm';
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
  const [data, setData] = useState<LifiSettings | undefined>(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'lifi',
      ) as LifiPageSection
    )?.settings,
  );

  const tokens = useMemo<Token[]>(() => {
    return config?.tokens?.length ? config?.tokens[0].tokens || [] : [];
  }, [config]);

  const changeConfig = function (
    configToChange: AppConfig,
    formData?: LifiSettings,
  ) {
    const newConfig = { ...configToChange };

    const sectionIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'lifi',
    );

    let lifiSection: LifiPageSection;

    if (formData) {
      if (sectionIndex !== -1) {
        lifiSection = {
          ...(newConfig.pages['home']?.sections[
            sectionIndex
          ] as LifiPageSection),
          settings: formData,
        };
        newConfig.pages['home'].sections[sectionIndex] = lifiSection;
      } else {
        lifiSection = {
          title: 'Swap',
          type: 'lifi',
          settings: formData,
        };
        newConfig.pages['home']?.sections.push(lifiSection);
      }
    }

    return newConfig;
  };

  const { provider } = useWeb3React();

  const [isValid, setIsValid] = useState(false);

  const handleSave = () => {};

  const handleValidate = (value: boolean) => setIsValid(value);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant="subtitle2">
            <FormattedMessage id="tokens" defaultMessage="Tokens" />
          </Typography>
          <Typography variant="body2">
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
        <LifiSettingsForm
          onSave={handleSave}
          onValidate={handleValidate}
          tokens={tokens.map((t) => ({
            chainId: t.chainId,
            contractAddress: t.address,
            decimals: t.decimals,
            name: t.name,
            symbol: t.symbol,
            logoURI: t.logoURI,
          }))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <NoSsr>
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
                borderRadius: '8px',
              },
              tokens: {
                featured: [],
                allow: tokens.map((t) => ({
                  address: t.address,
                  chainId: t.chainId as number,
                })),
              },
              disableLanguageDetector: true,
            }}
          />
        </NoSsr>
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
