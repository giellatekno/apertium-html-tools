import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Config from '../../../../config';
import { ConfigContext } from '../../../context';

import TranslationOptions, { Props } from '../TranslationOptions';

const renderTranslationOptions = (props_: Partial<Props> = {}, config: Partial<typeof Config> = {}) => {
  const props = {
    markUnknown: false,
    setMarkUnknown: jest.fn(),
    instantTranslation: false,
    setInstantTranslation: jest.fn(),
    translationChaining: false,
    setTranslationChaining: jest.fn(),
    llmPostEditing: false,
    setLlmPostEditing: jest.fn(),
    srcLang: 'eng',
    tgtLang: 'spa',
    pairPrefs: {},
    setPairPrefs: jest.fn(),
    ...props_,
  };

  render(
    <ConfigContext.Provider value={{ ...Config, ...config }}>
      <TranslationOptions {...props} />
    </ConfigContext.Provider>,
  );

  return props;
};

describe('mark unknown', () => {
  const name = 'Mark_Unknown_Words-Default';

  it.each([false, true])('renders %s', (markUnknown) => {
    renderTranslationOptions({ markUnknown });
    expect(screen.getByRole('checkbox', { name, checked: markUnknown })).toBeDefined();
  });

  it.each([false, true])('toggles from %s', (markUnknown) => {
    const props = renderTranslationOptions({ markUnknown });

    userEvent.click(screen.getByRole('checkbox', { name }));

    expect(props.setMarkUnknown).toHaveBeenCalledWith(!markUnknown);
  });
});

describe('instant translation', () => {
  const name = 'Instant_Translation-Default';

  it.each([false, true])('renders %s', (instantTranslation) => {
    renderTranslationOptions({ instantTranslation });
    expect(screen.getByRole('checkbox', { name, checked: instantTranslation })).toBeDefined();
  });

  it.each([false, true])('toggles from %s', (instantTranslation) => {
    const { setInstantTranslation } = renderTranslationOptions({ instantTranslation });

    userEvent.click(screen.getByRole('checkbox', { name }));

    expect(setInstantTranslation).toHaveBeenCalledWith(!instantTranslation);
  });
});

describe('translation chaining', () => {
  const name = 'Multi_Step_Translation-Default';

  it.each([false, true])('renders %s', (translationChaining) => {
    renderTranslationOptions({ translationChaining });
    expect(screen.getByRole('checkbox', { name, checked: translationChaining })).toBeDefined();
  });

  it.each([false, true])('toggles from %s', (translationChaining) => {
    const { setTranslationChaining } = renderTranslationOptions({ translationChaining });

    userEvent.click(screen.getByRole('checkbox', { name }));

    expect(setTranslationChaining).toHaveBeenCalledWith(!translationChaining);
  });
});

describe('LLM post-editing', () => {
  // The label also contains the "what is this?" link
  const name = /^LLM_Post_Editing-Default/;
  const config = { llmPostEditing: { model: 'Some-Model' } };

  it('is hidden unless enabled in config', () => {
    renderTranslationOptions();
    expect(screen.queryByRole('checkbox', { name })).toBeNull();
  });

  it.each([false, true])('renders %s', (llmPostEditing) => {
    renderTranslationOptions({ llmPostEditing }, config);
    expect(screen.getByRole('checkbox', { name, checked: llmPostEditing })).toBeDefined();
  });

  it.each([false, true])('toggles from %s', (llmPostEditing) => {
    const { setLlmPostEditing } = renderTranslationOptions({ llmPostEditing }, config);

    userEvent.click(screen.getByRole('checkbox', { name }));

    expect(setLlmPostEditing).toHaveBeenCalledWith(!llmPostEditing);
  });

  it('turns off and disables instant translation', () => {
    renderTranslationOptions({ llmPostEditing: true, instantTranslation: true }, config);

    const instant = screen.getByRole('checkbox', { name: 'Instant_Translation-Default' }) as HTMLInputElement;
    expect(instant.checked).toBe(false);
    expect(instant.disabled).toBe(true);
  });

  it('opens an explanation without toggling', async () => {
    const { setLlmPostEditing } = renderTranslationOptions({}, config);

    userEvent.click(screen.getByRole('button', { name: 'LLM_Post_Editing_What-Default' }));

    expect(await screen.findByRole('dialog')).toBeDefined();
    expect(screen.getByText('LLM_Post_Editing_Info-Default')).toBeDefined();
    expect(setLlmPostEditing).not.toHaveBeenCalled();
  });
});

describe('pair prefs', () => {
  const withPrefsOptions = { srcLang: 'eng', tgtLang: 'cat' };

  it('renders nothing when prefs are unavailable', () => {
    renderTranslationOptions();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders closed dropdown when prefs are available', () => {
    renderTranslationOptions(withPrefsOptions);
    expect(screen.getByRole('button').textContent).toBe(' Norm_Preferences-Default');
  });

  it('renders prefs when dropdown clicked', async () => {
    renderTranslationOptions(withPrefsOptions);
    userEvent.click(screen.getByRole('button'));

    expect(await screen.findByRole('checkbox', { name: 'foo_pref' })).toBeDefined();
  });

  it('closes dropdown when clicked', () => {
    renderTranslationOptions(withPrefsOptions);

    const button = screen.getByRole('button');
    userEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    userEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('updates prefs when checkbox clicked', async () => {
    const { setPairPrefs } = renderTranslationOptions(withPrefsOptions);

    userEvent.click(screen.getByRole('button'));
    userEvent.click(await screen.findByRole('checkbox', { name: 'foo_pref' }));

    expect(setPairPrefs).toBeCalledWith({ foo: true });
  });
});
