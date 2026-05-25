import { useEffect, useRef, useState } from 'react';
import Pill from './Pill';
import ArrowChip from './ArrowChip';
import NumberDot from './NumberDot';
import TopNav from './TopNav';
import Zigzag from './patterns/Zigzag';
import Confetti from './Confetti';
import { t, getLocale } from '../i18n';

const MAX = 280;

// Per-locale prompt chips, structured as 2 rows. Each chip is one word/phrase
// with its own pill variant — mirrors Wolność Panel 2's "OGÓLNOPOLSKI /
// FESTIWAL / NAJLEPSZYCH / SPEKTAKLI / → TWORZONYCH / PRZEZ" multi-row stack.
type PromptChip = { text: string; variant: 'pink' | 'cream' | 'teal' | 'coral' | 'yellow' | 'lavender' };
type PromptRow = { chips: PromptChip[]; arrow?: boolean };

// One short prompt row only — leaves the textarea as the visual focus
const PROMPT_ROWS: Record<string, PromptRow[]> = {
  en: [{ chips: [{ text: 'WHISPER', variant: 'pink' }, { text: 'YOUR SIN', variant: 'cream' }] }],
  zh: [{ chips: [{ text: '低声', variant: 'pink' }, { text: '告诉我', variant: 'cream' }] }],
  es: [{ chips: [{ text: 'SUSURRA', variant: 'pink' }, { text: 'TU PECADO', variant: 'cream' }] }],
  pt: [{ chips: [{ text: 'SUSSURRE', variant: 'pink' }, { text: 'SEU PECADO', variant: 'cream' }] }],
  ru: [{ chips: [{ text: 'ШЕПНИ', variant: 'pink' }, { text: 'СВОЙ ГРЕХ', variant: 'cream' }] }],
  ja: [{ chips: [{ text: 'ささやけ', variant: 'pink' }, { text: 'あなたの罪を', variant: 'cream' }] }],
  ko: [{ chips: [{ text: '속삭여라', variant: 'pink' }, { text: '당신의 죄를', variant: 'cream' }] }],
  fr: [{ chips: [{ text: 'CHUCHOTE', variant: 'pink' }, { text: 'TON PÉCHÉ', variant: 'cream' }] }],
};

const SEND: Record<string, string> = {
  en: 'SEND', zh: '发送', es: 'ENVIAR', pt: 'ENVIAR',
  ru: 'ОТПРАВИТЬ', ja: '送信', ko: '전송', fr: 'ENVOYER',
};
const BACK: Record<string, string> = {
  en: 'BACK', zh: '返回', es: 'ATRÁS', pt: 'VOLTAR',
  ru: 'НАЗАД', ja: '戻る', ko: '뒤로', fr: 'RETOUR',
};

interface Props {
  onSubmit: (text: string) => void;
  onBack: () => void;
}

// Typing = Wolność Panel 2: full-screen dense V-zigzag in coral/pink, with
// a multi-row pill stack as the content. Our functional adaptation: the
// prompt copy lives in the top pill rows; the TEXTAREA becomes the central
// big cream rounded-rectangle pill (the "page" the player writes on);
// SEND lives at the bottom as a colored arrow chip + label pair.
export default function TypingScreenV4({ onSubmit, onBack }: Props) {
  const [text, setText] = useState('');
  const [showError, setShowError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loc = getLocale();
  const prompts = PROMPT_ROWS[loc] ?? PROMPT_ROWS.en;
  const sendLabel = SEND[loc] ?? SEND.en;
  const backLabel = BACK[loc] ?? BACK.en;

  useEffect(() => {
    const id = setTimeout(() => textareaRef.current?.focus(), 250);
    return () => clearTimeout(id);
  }, []);

  const submit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 6) {
      setShowError(t('error_short'));
      return;
    }
    if (trimmed.length > MAX) {
      setShowError(t('error_long'));
      return;
    }
    onSubmit(trimmed);
  };

  const isOver = text.length > MAX;
  const tooShort = text.trim().length < 6;
  const canSubmit = !tooShort && !isOver;
  // Status hint for the SEND button — instead of "disabled forever", tell
  // the user WHY they can't submit yet.
  const sendHint = tooShort ? `${6 - text.trim().length} MORE` : isOver ? 'TOO LONG' : null;

  return (
    <div className="cb4-typing">
      <Zigzag color="#ff4d8e" accent="#ff7a4a" bg="#0a0a0a" cols={16} className="cb4-typing__pattern" />
      <Confetti width={400} height={840} count={14} colors={['#fce8c8', '#ffd24a']} rRange={[3, 5]} seed={23} className="cb4-typing__confetti" />

      <TopNav left={{ kind: 'back', label: backLabel, onBack }} />

      <div className="cb4-typing__stack">
        {/* Prompt pill rows (2 rows) */}
        <div className="cb4-typing__prompts">
          {prompts.map((row, ri) => (
            <div key={ri} className="cb4-typing__prompt-row">
              {row.arrow && <ArrowChip direction="right" variant="orange" />}
              {row.chips.map((chip, ci) => (
                <Pill key={ci} variant={chip.variant} size="sm">
                  {chip.text}
                </Pill>
              ))}
            </div>
          ))}
        </div>

        {/* The textarea — a giant cream pill that breaks the "small pill"
            pattern but maintains the language (rounded, black halo) */}
        <div className="cb4-typing__page-wrap">
          <textarea
            ref={textareaRef}
            className="cb4-typing__page"
            placeholder={t('typing_placeholder')}
            maxLength={MAX + 20}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (showError) setShowError('');
            }}
          />
          <div className="cb4-typing__counter">
            <NumberDot value={text.length} color={isOver ? 'pink' : 'orange'} size="sm" />
            <span className="cb4-typing__counter-max">/{MAX}</span>
          </div>
        </div>

        {showError && (
          <div className="cb4-typing__error-row">
            <Pill variant="pink" size="sm">{showError}</Pill>
          </div>
        )}

        {/* SEND row — when blocked, shows the reason instead of just being disabled */}
        <div className="cb4-typing__send-row">
          <button
            type="button"
            className={`cb4-typing__send ${canSubmit ? '' : 'cb4-typing__send--disabled'}`}
            onPointerDown={(e) => {
              e.preventDefault();
              if (canSubmit) submit();
            }}
            disabled={!canSubmit}
          >
            <span className="cb4-typing__send-arrow">→</span>
            <span className="cb4-typing__send-label">
              {sendHint ? sendHint : sendLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
