export interface SwapFeeForm {
  recipient: string;
  amountPercentage: number;
}

export interface SeoForm {
  title: string;
  description: string;
  shareImageUrl: string;
}

export enum SetupSteps {
  Disabled = -1,
  General,
  Theme,
  Collection,
  Pages,
  PagesMenu,
  Tokens,
  Fees,
  SwapFees,
  Seo,
  Done,
}

export enum WizardSetupSteps {
  Disabled = -1,
  Required,
  General,
  CollectionTokens,
  Layout,
  Done,
}

export interface StepperButtonProps {
  handleNext?: () => void;
  handleBack?: () => void;
  disableContinue?: boolean,
  isLastStep?: boolean;
  isFirstStep?: boolean;
}


