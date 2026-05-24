// Cold-start wall fallback + ?demo=absolution data, localized for the 8
// supported languages. Each locale ships 6 sins + quips + penances + a
// single multi-line operator reply (re-used across all 6 entries with the
// ticket number rolled per row). Verdicts rotate so wall reads as varied.

import type { Confession, Verdict } from '../types';
import { getLocale } from '../i18n';

type LocaleKey = 'en' | 'zh' | 'es' | 'pt' | 'ru' | 'ja' | 'ko' | 'fr';

interface LocaleDemo {
  /** Multi-line operator reply re-used by demo entries (the persona's voice in this locale). */
  reply: string;
  sins: string[]; // 6 sins
  quips: string[]; // 6 quips (1:1 with sins)
  penance: string;
}

const DEMOS: Record<LocaleKey, LocaleDemo> = {
  en: {
    reply: [
      "Yeah. Okay. Heard you.",
      "Hold on, my coffee's been cold for an hour.",
      "Look — that's not a sin, that's just being a person on a Tuesday.",
      "Stop apologizing for it.",
      "Go drink some water. One glass.",
      "Te absolvo, mostly.",
    ].join('\n'),
    sins: [
      "I screenshotted a friend's ex's wedding photos and zoomed in on their teeth.",
      "I told my roommate the milk was bad so I could finish the cereal alone.",
      "I rehearsed an apology in the shower and used the saved time to scroll Reels.",
      "I bought a self-help book and put it face-down on my nightstand for a month.",
      "I clapped at the end of a movie I didn't actually like, to fit in.",
      "I wrote a passive-aggressive Slack message and blamed my dog for keyboard-stepping.",
    ],
    quips: [
      'Teeth are public domain.',
      'Heard worse before lunch.',
      "Logistics is its own apology.",
      'Books absolve in stages.',
      'Applause is a survival skill.',
      'Dogs absolve everything.',
    ],
    penance: "Compliment a stranger's shoes before Friday.",
  },
  zh: {
    reply: [
      '嗯。听到了。',
      '等等，我咖啡凉了一个钟头了。',
      '这算不上什么罪，就是个普通的周二而已。',
      '别再为这个道歉了。',
      '去喝杯水，一杯就行。',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      '我截了朋友前任的婚礼照片，然后放大看牙齿。',
      '我跟室友说牛奶坏了，好让自己一个人吃完麦片。',
      '我在洗澡的时候排练道歉，把省下的时间拿来刷小红书。',
      '我买了本心灵成长书，盖朝下扣在床头柜上一个月。',
      '我在一部其实不喜欢的电影结束时跟着鼓掌，为了合群。',
      '我发了一条阴阳怪气的微信，然后说是我家猫踩到键盘。',
    ],
    quips: [
      '牙齿是公共财产。',
      '午饭前听过更糟的。',
      '排练本身就是一种道歉。',
      '书是分批赦免的。',
      '鼓掌是种求生本能。',
      '猫能赦免一切。',
    ],
    penance: '在周五前夸一个陌生人鞋子好看。',
  },
  es: {
    reply: [
      'Sí. Vale. Te escuché.',
      'Espera, mi café lleva una hora frío.',
      'Mira — eso no es pecado, es ser persona un martes.',
      'Deja de pedir perdón por eso.',
      'Bebe un vaso de agua. Uno solo.',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      'Hice captura de las fotos de boda del ex de mi amiga y le hice zoom a los dientes.',
      'Le dije a mi compañera que la leche estaba mala para terminarme yo el cereal.',
      'Ensayé una disculpa en la ducha y usé el tiempo ahorrado en ver Reels.',
      'Compré un libro de autoayuda y lo dejé boca abajo en la mesita un mes entero.',
      'Aplaudí al final de una peli que en realidad no me gustó, para no destacar.',
      'Escribí un mensaje pasivo-agresivo y eché la culpa al perro que pisó el teclado.',
    ],
    quips: [
      'Los dientes son de dominio público.',
      'He oído peores antes del almuerzo.',
      'La logística también es una disculpa.',
      'Los libros absuelven por fases.',
      'Aplaudir es supervivencia.',
      'Los perros absuelven todo.',
    ],
    penance: 'Halaga los zapatos de un extraño antes del viernes.',
  },
  pt: {
    reply: [
      'Tá. Ouvi.',
      'Espera, meu café tá frio há uma hora.',
      'Olha — isso não é pecado, é só ser uma pessoa numa terça.',
      'Para de pedir desculpa por isso.',
      'Vai beber um copo d\'água. Um só.',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      'Tirei print das fotos do casamento do ex da minha amiga e dei zoom nos dentes.',
      'Falei pro meu colega que o leite tinha estragado pra terminar o cereal sozinho.',
      'Ensaiei um pedido de desculpas no chuveiro e gastei o tempo poupado em Reels.',
      'Comprei um livro de autoajuda e deixei virado pra baixo na mesinha por um mês.',
      'Bati palma no fim de um filme que não gostei só pra me encaixar.',
      'Mandei uma mensagem agressiva no Slack e culpei o cachorro de pisar no teclado.',
    ],
    quips: [
      'Dentes são domínio público.',
      'Já ouvi pior antes do almoço.',
      'Logística é seu próprio pedido de desculpas.',
      'Livros absolvem por etapas.',
      'Aplaudir é instinto de sobrevivência.',
      'Cachorro absolve tudo.',
    ],
    penance: 'Elogie os sapatos de um estranho antes de sexta.',
  },
  ru: {
    reply: [
      'Угу. Понял.',
      'Подожди — кофе уже час как остыл.',
      'Слушай — это не грех, это просто быть человеком во вторник.',
      'Хватит извиняться за это.',
      'Выпей стакан воды. Один.',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      'Я сделал скриншоты свадебных фоток бывшего подруги и увеличил зубы.',
      'Я сказал соседу, что молоко испортилось, чтобы доесть хлопья одному.',
      'Я отрепетировал извинение в душе и потратил сэкономленное время на Reels.',
      'Я купил книгу по саморазвитию и положил её обложкой вниз на месяц.',
      'Я аплодировал в конце фильма, который не понравился, чтобы вписаться.',
      'Я написал пассивно-агрессивное сообщение и свалил на собаку, что наступила на клавиатуру.',
    ],
    quips: [
      'Зубы — это общественное достояние.',
      'Слышал и похуже до обеда.',
      'Логистика — сама себе извинение.',
      'Книги отпускают грехи поэтапно.',
      'Аплодисменты — инстинкт выживания.',
      'Собаки отпускают всё.',
    ],
    penance: 'Похвали обувь незнакомца до пятницы.',
  },
  ja: {
    reply: [
      'うん。聞こえてる。',
      'ちょっと待って、コーヒー一時間冷めてる。',
      'いや — それ罪じゃない、ただの火曜日の人間。',
      'もう謝らなくていい。',
      'コップ一杯、水飲んで。一杯だけ。',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      '友達の元カレの結婚式写真をスクショして歯を拡大した。',
      'ルームメイトに牛乳が悪くなったと嘘ついて、シリアル一人で食べきった。',
      'シャワーで謝罪を練習して、浮いた時間でReels見てた。',
      '自己啓発本を買って、サイドテーブルに表紙伏せて一ヶ月放置した。',
      '本当は好きじゃない映画のラストで、馴染むために拍手した。',
      'パッシブアグレッシブなSlack送って、犬がキーボード踏んだせいにした。',
    ],
    quips: [
      '歯はパブリックドメイン。',
      'ランチ前にもっとひどいの聞いた。',
      'ロジスティクス自体が謝罪。',
      '本は段階的に赦してくれる。',
      '拍手は生存本能。',
      '犬は全部赦してくれる。',
    ],
    penance: '金曜までに知らない人の靴を褒めて。',
  },
  ko: {
    reply: [
      '응. 들었어.',
      '잠깐, 커피 한 시간째 식어 있어.',
      '봐 — 그건 죄가 아니야, 그냥 화요일의 사람일 뿐이지.',
      '그것 때문에 그만 사과해.',
      '물 한 잔 마셔. 딱 한 잔만.',
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      '친구 전남친 결혼식 사진 스크린샷 찍고 이빨을 확대해서 봤어요.',
      '룸메이트한테 우유 상했다고 거짓말하고 시리얼 혼자 다 먹었어요.',
      '샤워하면서 사과를 연습하고 남은 시간으로 릴스를 봤어요.',
      '자기계발서 사놓고 표지 아래로 향하게 한 달 동안 침대 옆에 뒀어요.',
      '진짜로는 별로였던 영화 끝에 어울리려고 박수쳤어요.',
      '수동공격적인 슬랙 메시지 보내고 강아지가 키보드 밟았다고 핑계댔어요.',
    ],
    quips: [
      '이빨은 공공재산.',
      '점심 전에 더한 것도 들었어.',
      '로지스틱스도 사과의 일종.',
      '책은 단계적으로 사함을 줘.',
      '박수는 생존 본능.',
      '강아지가 다 사함받게 해줘.',
    ],
    penance: '금요일 전에 낯선 사람의 신발을 칭찬해줘.',
  },
  fr: {
    reply: [
      "Ouais. D'accord. Entendu.",
      "Attends, mon café est froid depuis une heure.",
      "Écoute — c'est pas un péché, c'est juste être un humain un mardi.",
      "Arrête de t'excuser pour ça.",
      "Va boire un verre d'eau. Un seul.",
      'Te absolvo, mostly.',
    ].join('\n'),
    sins: [
      "J'ai screenshoté les photos de mariage de l'ex d'une amie et j'ai zoomé sur leurs dents.",
      "J'ai dit à mon coloc que le lait était périmé pour finir les céréales seul.",
      "J'ai répété une excuse sous la douche et j'ai passé le temps gagné sur des Reels.",
      "J'ai acheté un livre de développement perso et l'ai laissé face cachée pendant un mois.",
      "J'ai applaudi à la fin d'un film que j'aimais pas, juste pour me fondre dans la masse.",
      "J'ai envoyé un message Slack passif-agressif et accusé mon chien d'avoir marché sur le clavier.",
    ],
    quips: [
      'Les dents sont du domaine public.',
      'J\'ai entendu pire avant midi.',
      'La logistique est sa propre excuse.',
      'Les livres absolvent par étapes.',
      'Applaudir est un instinct de survie.',
      'Les chiens absolvent tout.',
    ],
    penance: "Complimente les chaussures d'un inconnu avant vendredi.",
  },
};

const VERDICTS: Verdict[] = ['ABSOLVED', 'ABSOLVED', 'DEFERRED', 'ABSOLVED', 'ABSOLVED', 'DENIED'];
const TICKETS = ['#4823-2', '#4824-9', '#4825-3', '#4826-5', '#4827-1', '#4828-0'];

function localeOrEn(): LocaleKey {
  const l = getLocale();
  return (DEMOS as any)[l] ? (l as LocaleKey) : 'en';
}

export function getDemoConfession(): Confession {
  const loc = localeOrEn();
  const d = DEMOS[loc];
  return {
    id: 'demo-1',
    sin: d.sins[0],
    operatorReply: d.reply,
    penance: d.penance,
    quip: d.quips[0],
    verdict: 'ABSOLVED',
    ticketNumber: '#4827-7',
    callDuration: '01:14',
    createdAt: Date.now(),
  };
}

export function getDemoWall(): Confession[] {
  const loc = localeOrEn();
  const d = DEMOS[loc];
  return d.sins.map((sin, i) => ({
    id: `wall-${i + 1}`,
    sin,
    operatorReply: d.reply,
    penance: d.penance,
    quip: d.quips[i],
    verdict: VERDICTS[i] || 'ABSOLVED',
    ticketNumber: TICKETS[i] || `#0000-${i}`,
    callDuration: '01:14',
    createdAt: Date.now() - i * 60_000,
  }));
}

// Legacy named exports — kept so any older import path keeps working in
// case anything else picks them up.
export const DEMO_CONFESSION = getDemoConfession();
export const DEMO_WALL = getDemoWall();
