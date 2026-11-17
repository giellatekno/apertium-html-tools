import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { ConfigContext } from '../../context';
import { useLocalization } from '../../util/localization';

export type Props = {
  show: boolean;
  srcLang: string;
  tgtLang: string;
  // Info mode: a plain popup that can be closed.
  onHide?: () => void;
  // Consent mode: the user has to pick whether to use the AI cleanup.
  onChoose?: (useLlm: boolean) => void;
};

const LlmPostEditingModal = ({ show, srcLang, tgtLang, onHide, onChoose }: Props): React.ReactElement => {
  const { t, tLang } = useLocalization();
  const config = React.useContext(ConfigContext);

  const fill = (id: string) =>
    t(id)
      .replace(/{{source}}/g, tLang(srcLang))
      .replace(/{{target}}/g, tLang(tgtLang))
      .replace(/{{model}}/g, config.llmPostEditing?.model || 'AI');

  return (
    <Modal backdrop={onChoose ? 'static' : true} keyboard={!onChoose} onHide={onHide || (() => undefined)} show={show}>
      <Modal.Header closeButton={!onChoose}>
        <Modal.Title>{t('LLM_Post_Editing')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{fill('LLM_Post_Editing_Info')}</p>
        <p className={onChoose ? undefined : 'mb-0'}>{fill('LLM_Post_Editing_Privacy')}</p>
        {onChoose && <p className="mb-0 font-weight-bold">{t('LLM_Post_Editing_Question')}</p>}
      </Modal.Body>
      {onChoose && (
        <Modal.Footer>
          <Button onClick={() => onChoose(false)} variant="secondary">
            {t('LLM_Post_Editing_No')}
          </Button>
          <Button onClick={() => onChoose(true)} variant="primary">
            {t('LLM_Post_Editing_Yes')}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default LlmPostEditingModal;
