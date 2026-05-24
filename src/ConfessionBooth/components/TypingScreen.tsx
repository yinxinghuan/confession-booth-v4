import { useEffect, useRef, useState } from 'react';
import StainedGlass from './StainedGlass';
import BrassGrille from './BrassGrille';
import Fluorescent from './Fluorescent';
import Chip from './Chip';
import MetaStrip from './MetaStrip';
import { t, getLocale } from '../i18n';

const MAX = 280;

// Localized crash hero for the typing screen — "SAY IT" / "TELL US" energy.
const CRASH: Record<string, { word: string; tag: string }> = {
  en: { word: 'SAY IT', tag: 'OR HANG UP' },
  zh: { word: '说吧', tag: '不然挂掉' },
  es: { word: 'DILO', tag: 'O CUELGA' },
  pt: { word: 'DIGA', tag: 'OU DESLIGUE' },
  ru: { word: 'ГОВОРИ', tag: 'ИЛИ ВЕШАЙ' },
  ja: { word: '言って', tag: 'または切れ' },
  ko: { word: '말해', tag: '아니면 끊어' },
  fr: { word: 'DIS-LE', tag: 'OU RACCROCHE' },
};

interface Props {
  onSubmit: (text: string) => void;
  onBack: () => void;
}

export default function TypingScreen({ onSubmit, onBack }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showError, setShowError] = useState('');
  const [elapsed, setElapsed] = useState(0); // seconds on the line

  const loc = getLocale();
  const crash = CRASH[loc] ?? CRASH.en;

  useEffect(() => {
    const id = setTimeout(() => textareaRef.current?.focus(), 300);
    return () => clearTimeout(id);
  }, []);

  // Live call timer — sells the "you're on a real call" framing
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
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

  const callTime = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="cb-typing-v2">
      <MetaStrip>
        <span>{t('meta_call')}</span>
        <span className="cb-typing-v2__timer">{callTime}</span>
      </MetaStrip>

      {/* Transom — mini stained glass + fluorescent tube */}
      <div className="cb-typing-v2__transom">
        <div className="cb-typing-v2__transom-glass">
          <StainedGlass width={120} height={62} variant="top-strip" />
        </div>
        <div className="cb-typing-v2__transom-fluo">
          <Fluorescent width={132} height={12} />
        </div>
      </div>

      {/* Crash hero */}
      <h1 className="cb-crash cb-crash--typing">
        <span className="cb-crash__word">{crash.word}</span>
        <span className="cb-typing-v2__rec" aria-hidden>
          <span className="cb-typing-v2__rec-dot" />
          REC
        </span>
        <span className="cb-crash__rule" aria-hidden />
        <span className="cb-crash__tag">{crash.tag}</span>
      </h1>

      {/* The grille — confessor side. Smaller band than booth, but with the
          operator's Post-It pinned to the back ("we're listening") visible. */}
      <div className="cb-typing-v2__grille-band">
        <BrassGrille width="100%" height="100%" density={0.96} cell={22} />
        <span className="cb-typing-v2__op-postit" aria-hidden>
          we&apos;re
          <br />
          listening
          <br />
          <em>— JL</em>
        </span>
      </div>

      {/* The note-paper player area — feels like writing a confession in
          the booth bench's pull-down desk */}
      <div className="cb-typing-v2__well">
        <div className="cb-typing-v2__paper" aria-hidden />
        <textarea
          ref={textareaRef}
          className="cb-typing-v2__input"
          placeholder={t('typing_placeholder')}
          maxLength={MAX + 20}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (showError) setShowError('');
          }}
        />
        {/* LED-segment counter */}
        <div className="cb-typing-v2__counter">
          <span className={`cb-typing-v2__count-led ${text.length > MAX ? 'cb-typing-v2__count-led--over' : ''}`}>
            {String(text.length).padStart(3, '0')}
          </span>
          <span className="cb-typing-v2__count-slash">/</span>
          <span className="cb-typing-v2__count-max">{MAX}</span>
        </div>
      </div>

      {showError && <p className="cb-typing-v2__error">{showError}</p>}

      <div className="cb-typing-v2__dock">
        <Chip variant="ghost" onClick={onBack}>
          {t('typing_back')}
        </Chip>
        <Chip variant="primary" onClick={submit} disabled={text.trim().length < 6} fullWidth>
          {t('typing_send')} →
        </Chip>
      </div>
    </div>
  );
}
