import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import { ConfigContext, LocaleContext } from '../../context';
import { PairPrefValues, getPairPrefs } from '.';
import LlmPostEditingModal from './LlmPostEditingModal';
import { useLocalization } from '../../util/localization';

export type Props = {
  markUnknown: boolean;
  setMarkUnknown: React.Dispatch<React.SetStateAction<boolean>>;
  instantTranslation: boolean;
  setInstantTranslation: React.Dispatch<React.SetStateAction<boolean>>;
  translationChaining: boolean;
  setTranslationChaining: React.Dispatch<React.SetStateAction<boolean>>;
  llmPostEditing: boolean;
  setLlmPostEditing: (llmPostEditing: boolean) => void;
  srcLang: string;
  tgtLang: string;
  pairPrefs: PairPrefValues;
  setPairPrefs: (prefs: PairPrefValues) => void;
};

const TranslationOptions = ({
  markUnknown,
  setMarkUnknown,
  instantTranslation,
  setInstantTranslation,
  translationChaining,
  setTranslationChaining,
  llmPostEditing,
  setLlmPostEditing,
  srcLang,
  tgtLang,
  pairPrefs,
  setPairPrefs,
}: Props): React.ReactElement => {
  const { t } = useLocalization();
  const locale = React.useContext(LocaleContext);
  const config = React.useContext(ConfigContext);

  const prefs = React.useMemo(() => getPairPrefs(locale, srcLang, tgtLang), [locale, srcLang, tgtLang]);
  const [showPrefDropdown, setShowPrefDropdown] = React.useState(false);
  const [showLlmInfo, setShowLlmInfo] = React.useState(false);

  return (
    <>
      {Object.keys(prefs).length > 0 && (
        <DropdownButton
          className="mb-2"
          drop="down"
          onToggle={(isOpen, event, { source }) => {
            if (isOpen) {
              setShowPrefDropdown(true);
            }

            if (source === 'rootClose') {
              setShowPrefDropdown(false);
            }
          }}
          show={showPrefDropdown}
          size="sm"
          title={
            <>
              <FontAwesomeIcon icon={faCog} /> {t('Norm_Preferences')}
            </>
          }
          variant="secondary"
        >
          <Col
            style={{
              maxHeight: '12rem',
              maxWidth: 'calc(min(100vw - 30px, 400px))',
              overflowY: 'scroll',
              width: 'max-content',
            }}
          >
            {Object.entries(prefs).map(([id, description]) => (
              <Row key={id}>
                <Form.Check
                  checked={!!pairPrefs[id]}
                  className="mx-3"
                  custom
                  id={`pref-${id}`}
                  inline
                  label={description}
                  onChange={({ currentTarget }) => setPairPrefs({ ...pairPrefs, [id]: currentTarget.checked })}
                  style={{ wordBreak: 'break-word' }}
                />
              </Row>
            ))}
          </Col>
        </DropdownButton>
      )}
      <Form.Check
        checked={markUnknown}
        custom
        id="mark-unknown-words"
        label={t('Mark_Unknown_Words')}
        onChange={({ currentTarget }) => setMarkUnknown(currentTarget.checked)}
      />
      <Form.Check
        checked={instantTranslation && !llmPostEditing}
        custom
        disabled={llmPostEditing}
        id="instant-translation"
        label={t('Instant_Translation')}
        onChange={({ currentTarget }) => setInstantTranslation(currentTarget.checked)}
      />
      {config.translationChaining && (
        <Form.Check
          checked={translationChaining}
          custom
          id="translation-chaining"
          label={<span dangerouslySetInnerHTML={{ __html: t('Multi_Step_Translation') }} />}
          onChange={({ currentTarget }) => setTranslationChaining(currentTarget.checked)}
        />
      )}
      {config.llmPostEditing && (
        <Form.Check
          checked={llmPostEditing}
          custom
          id="llm-post-editing"
          label={
            <>
              {t('LLM_Post_Editing')} (
              <Button
                className="p-0 align-baseline"
                onClick={(event) => {
                  event.preventDefault();
                  setShowLlmInfo(true);
                }}
                variant="link"
              >
                {t('LLM_Post_Editing_What')}
              </Button>
              )
            </>
          }
          onChange={({ currentTarget }) => setLlmPostEditing(currentTarget.checked)}
        />
      )}
      {config.llmPostEditing && (
        <LlmPostEditingModal onHide={() => setShowLlmInfo(false)} show={showLlmInfo} {...{ srcLang, tgtLang }} />
      )}
    </>
  );
};

export default TranslationOptions;
