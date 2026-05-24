import { useEffect, useState } from 'react';
import StainedGlass from './StainedGlass';
import Fluorescent from './Fluorescent';
import MetaStrip from './MetaStrip';
import { t, getLocale } from '../i18n';
import type { ProcessingStage } from '../types';

interface Props {
  stage: ProcessingStage | '';
}

const STAGE_KEY: Record<ProcessingStage, string> = {
  ringing: 'processing_ringing',
  hold: 'processing_hold',
  connected: 'processing_connected',
  'cross-ref': 'processing_crossref',
  stamping: 'processing_stamping',
};

const STAGE_ORDER: ProcessingStage[] = ['ringing', 'hold', 'connected', 'cross-ref', 'stamping'];

// Big crash-type word per stage, per locale.
const STAGE_CRASH: Record<ProcessingStage, Record<string, string>> = {
  ringing: { en: 'RINGING', zh: '振铃', es: 'LLAMANDO', pt: 'CHAMANDO', ru: 'ВЫЗОВ', ja: '発信', ko: '연결중', fr: 'SONNERIE' },
  hold: { en: 'HOLD', zh: '请稍候', es: 'EN ESPERA', pt: 'AGUARDE', ru: 'ОЖИДАНИЕ', ja: '保留', ko: '대기중', fr: 'EN ATTENTE' },
  connected: { en: 'CONNECTED', zh: '已接通', es: 'CONECTADO', pt: 'CONECTADO', ru: 'НА СВЯЗИ', ja: '応答', ko: '연결됨', fr: 'CONNECTÉ' },
  'cross-ref': { en: 'CROSSREF', zh: '检索', es: 'COTEJANDO', pt: 'COTEJANDO', ru: 'СВЕРКА', ja: '照合', ko: '대조중', fr: 'RECOUPE' },
  stamping: { en: 'STAMPING', zh: '盖戳', es: 'SELLANDO', pt: 'SELANDO', ru: 'ШТАМП', ja: '捺印', ko: '도장', fr: 'TAMPON' },
};

export default function ProcessingScreen({ stage }: Props) {
  const loc = getLocale();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);
  const dots = '·'.repeat(tick + 1) + ' '.repeat(3 - tick);
  const i = stage ? STAGE_ORDER.indexOf(stage) : 0;
  const label = stage ? t(STAGE_KEY[stage] as any) : '';
  const crashWord = stage ? (STAGE_CRASH[stage][loc] ?? STAGE_CRASH[stage].en) : '';
  const isRinging = stage === 'ringing';
  const isHold = stage === 'hold';

  // fake ticket / caller-id metadata
  const callerNum = '4827';
  const line = '7';

  return (
    <div className="cb-proc-v2">
      <MetaStrip>{t('meta_call')}</MetaStrip>

      <div className="cb-proc-v2__transom">
        <div className="cb-proc-v2__transom-glass">
          <StainedGlass width={120} height={62} variant="top-strip" />
        </div>
        <div className="cb-proc-v2__transom-fluo">
          <Fluorescent width={132} height={12} />
        </div>
      </div>

      {/* Crash hero — current stage as massive blackletter */}
      <h1 className="cb-crash cb-crash--proc">
        <span className="cb-crash__word">{crashWord}</span>
        <span className="cb-crash__dots">{dots}</span>
      </h1>

      {/* The phone + cassette staging area */}
      <div className="cb-proc-v2__stage">
        <div className="cb-proc-v2__phone-wrap">
          <svg className="cb-proc-v2__phone" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <linearGradient id="cb-phone-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a1c12" />
                <stop offset="100%" stopColor="#0a0703" />
              </linearGradient>
              <radialGradient id="cb-phone-dial" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3d2818" />
                <stop offset="100%" stopColor="#1a0f08" />
              </radialGradient>
            </defs>
            {/* Cradle base */}
            <rect x="34" y="118" width="132" height="58" rx="10" fill="url(#cb-phone-body)" stroke="#0a0703" />
            {/* Cradle slots */}
            <rect x="50" y="124" width="100" height="8" rx="3" fill="#0a0703" />
            {/* Dial face */}
            <circle cx="100" cy="148" r="22" fill="url(#cb-phone-dial)" />
            <circle cx="100" cy="148" r="20" fill="none" stroke="#a87e3a" strokeWidth="0.6" opacity="0.6" />
            {/* Dial holes */}
            {Array.from({ length: 10 }).map((_, n) => {
              const angle = (-90 + (n * 360) / 10) * (Math.PI / 180);
              const r = 14;
              return (
                <g key={n}>
                  <circle cx={100 + Math.cos(angle) * r} cy={148 + Math.sin(angle) * r} r="2.2" fill="#0a0703" />
                  <text x={100 + Math.cos(angle) * r} y={148 + Math.sin(angle) * r + 1} textAnchor="middle" fontSize="3" fill="#fce6a3" opacity="0.6">
                    {(n + 1) % 10}
                  </text>
                </g>
              );
            })}
            {/* Handset */}
            <g className={`cb-proc-v2__handset ${isRinging ? 'cb-proc-v2__handset--ring' : ''}`}>
              <path
                d="M 30 90 Q 26 38 100 30 Q 174 38 170 90 L 154 90 Q 154 56 100 50 Q 46 56 46 90 Z"
                fill="url(#cb-phone-body)"
                stroke="#0a0703"
              />
              {/* Earpiece + mouthpiece */}
              <circle cx="36" cy="90" r="10" fill="#0a0703" />
              <circle cx="36" cy="90" r="5" fill="#3d2818" />
              <circle cx="164" cy="90" r="10" fill="#0a0703" />
              <circle cx="164" cy="90" r="5" fill="#3d2818" />
              {/* Handset highlight */}
              <path d="M 30 90 Q 26 60 90 48" stroke="#a87e3a" strokeWidth="0.6" fill="none" opacity="0.4" />
            </g>
            {/* Sound waves while ringing */}
            {isRinging && (
              <g className="cb-proc-v2__waves" stroke="@neon-yellow" strokeWidth="1.6" fill="none">
                <path d="M 14 80 Q 4 90 14 100" stroke="#ffba3a" />
                <path d="M 8 70 Q -4 90 8 110" stroke="#ffba3a" />
                <path d="M 186 80 Q 196 90 186 100" stroke="#ffba3a" />
                <path d="M 192 70 Q 204 90 192 110" stroke="#ffba3a" />
              </g>
            )}
            {/* Coiled cord */}
            <path
              d="M 100 176 Q 116 178 130 184 Q 124 192 116 196 Q 132 198 144 200"
              stroke="#3d2818"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Cassette tape spinning beside phone during hold/connected/crossref */}
        {(isHold || stage === 'connected' || stage === 'cross-ref') && (
          <div className="cb-proc-v2__cassette" aria-hidden>
            <svg viewBox="0 0 110 70">
              <rect x="2" y="2" width="106" height="66" rx="3" fill="#1a0f08" stroke="#3d2818" strokeWidth="1.5" />
              <rect x="10" y="8" width="90" height="22" rx="1" fill="#efe4c8" />
              <line x1="14" y1="14" x2="96" y2="14" stroke="#7a5a32" strokeWidth="0.6" />
              <line x1="14" y1="20" x2="96" y2="20" stroke="#7a5a32" strokeWidth="0.6" />
              <text x="55" y="26" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="11" fill="#1a0f08">
                MUZAK ’92
              </text>
              {/* Reels */}
              <g className="cb-proc-v2__reel" style={{ transformOrigin: '32px 50px' }}>
                <circle cx="32" cy="50" r="10" fill="#3d2818" stroke="#fce6a3" strokeWidth="0.6" />
                <circle cx="32" cy="50" r="3" fill="#a87e3a" />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <line
                    key={a}
                    x1="32" y1="50"
                    x2={32 + Math.cos((a * Math.PI) / 180) * 9}
                    y2={50 + Math.sin((a * Math.PI) / 180) * 9}
                    stroke="#fce6a3"
                    strokeWidth="0.6"
                  />
                ))}
              </g>
              <g className="cb-proc-v2__reel cb-proc-v2__reel--b" style={{ transformOrigin: '78px 50px' }}>
                <circle cx="78" cy="50" r="10" fill="#3d2818" stroke="#fce6a3" strokeWidth="0.6" />
                <circle cx="78" cy="50" r="3" fill="#a87e3a" />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <line
                    key={a}
                    x1="78" y1="50"
                    x2={78 + Math.cos((a * Math.PI) / 180) * 9}
                    y2={50 + Math.sin((a * Math.PI) / 180) * 9}
                    stroke="#fce6a3"
                    strokeWidth="0.6"
                  />
                ))}
              </g>
              {/* Tape strip between reels */}
              <line x1="40" y1="50" x2="70" y2="50" stroke="#a87e3a" strokeWidth="1" opacity="0.6" />
            </svg>
            <span className="cb-proc-v2__cassette-label">♪ HOLD MUSIC</span>
          </div>
        )}
      </div>

      {/* Caller ID strip */}
      <div className="cb-proc-v2__caller">
        <span className="cb-proc-v2__caller-key">CALLER</span>
        <span className="cb-proc-v2__caller-val">#{callerNum}</span>
        <span className="cb-proc-v2__caller-sep" aria-hidden />
        <span className="cb-proc-v2__caller-key">LINE</span>
        <span className="cb-proc-v2__caller-val">{line}</span>
        <span className="cb-proc-v2__caller-sep" aria-hidden />
        <span className="cb-proc-v2__caller-val cb-proc-v2__caller-status">{label}</span>
      </div>

      {/* LED bar with stage labels */}
      <div className="cb-proc-v2__bar">
        {STAGE_ORDER.map((s, idx) => (
          <div
            key={s}
            className={`cb-proc-v2__seg ${
              idx < i ? 'cb-proc-v2__seg--done' : idx === i ? 'cb-proc-v2__seg--now' : ''
            }`}
          >
            <span className="cb-proc-v2__seg-led" aria-hidden />
            <span className="cb-proc-v2__seg-label">{(STAGE_CRASH[s][loc] ?? STAGE_CRASH[s].en).slice(0, 6)}</span>
          </div>
        ))}
      </div>

      <p className="cb-proc-v2__fineprint">
        <span className="cb-proc-v2__fp-num">1-800-CONFESS</span>
        <span className="cb-proc-v2__fp-sep" aria-hidden />
        <span>{t('processing_fineprint')}</span>
      </p>
    </div>
  );
}
