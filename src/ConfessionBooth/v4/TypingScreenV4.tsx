import { useEffect, useRef, useState } from 'react';
import NumberDot from './NumberDot';
import TopNav from './TopNav';
import AvatarChip from './AvatarChip';
import Zigzag from './patterns/Zigzag';
import Confetti from './Confetti';
import { t, getLocale } from '../i18n';
import { playWhoosh, playTap } from '../utils/audio';
import { currentTheme } from './themes';
import { useCurrentUser } from './useCurrentUser';

const MAX = 280;

// Festival edition: the prompt comes from the WEEKLY THEME, not a fixed
// "whisper your sin" line. Displayed as one prominent theme banner.

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
  const sendLabel = SEND[loc] ?? SEND.en;
  const backLabel = BACK[loc] ?? BACK.en;
  const theme = currentTheme();
  const themePrompt = theme.prompt[loc] ?? theme.prompt.en;
  const themeLabel = theme.label[loc] ?? theme.label.en;
  const themeHint = theme.hint[loc] ?? theme.hint.en;
  const { profile } = useCurrentUser();

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
    playWhoosh();
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

      <TopNav left={{ kind: 'back', label: backLabel, onBack: () => { playTap(); onBack(); } }} />

      <div className="cb4-typing__stack">
        {/* Weekly theme banner */}
        <div className="cb4-typing__theme">
          <div className="cb4-typing__theme-label">{themeLabel}</div>
          <div className="cb4-typing__theme-prompt">{themePrompt}</div>
        </div>

        {/* The textarea — a giant cream pill that breaks the "small pill"
            pattern but maintains the language (rounded, black halo) */}
        <div className="cb4-typing__page-wrap">
          <textarea
            ref={textareaRef}
            className="cb4-typing__page"
            placeholder={themeHint}
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

        {/* "Performing as" identity chip — confessions are public this edition */}
        {profile && (
          <div className="cb4-typing__author">
            <span className="cb4-typing__author-label">PERFORMING AS</span>
            <AvatarChip user={profile} size="sm" />
          </div>
        )}

        {showError && (
          <div className="cb4-typing__error-row">
            <span className="cb4-typing__error-text">{showError}</span>
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
