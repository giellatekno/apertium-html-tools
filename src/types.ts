import type { createInstance } from '@datapunt/matomo-tracker-react';

export enum Mode {
  Translation = 'translation',
  Analysis = 'analysis',
  Generation = 'generation',
  Sandbox = 'sandbox',
}

export type Config = {
  defaultLocale: string;
  htmlUrl: string;
  apyURL: string;
  stringReplacements: Record<string, string>;
  matomoConfig?: Parameters<typeof createInstance>[0];

  allowedLangs?: Set<string>;
  allowedVariants?: Set<string>;

  defaultMode: Mode;
  enabledModes: Set<Mode>;
  translationChaining: boolean;
  // Offer a toggle that sends text translations to APy's /translateLLM
  // (Apertium + LLM post-editing). That endpoint is not in upstream APy.
  // `model` is the name shown to users, e.g. 'GPT-4.1 mini'. `pairs` limits
  // the toggle to these directions, as APy names them ('sme-nob'); without
  // it, every pair has it.
  llmPostEditing?: { model: string; pairs?: ReadonlyArray<string> };

  subtitle?: string;
  subtitleColor?: string;
  showMoreLanguagesLink: boolean;
};
