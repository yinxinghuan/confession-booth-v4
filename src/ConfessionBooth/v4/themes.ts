// "Sin of the Week" — rotating festival theme system.
//
// 12 themes cycle by ISO week number. Each player who confesses during a
// given week is answering the SAME prompt; the Wall is the gathering of
// everyone's answers to that prompt, like a festival's lineup of acts.

export interface Theme {
  week: number; // 0-based week index in the cycle
  prompt: Record<string, string>; // per-locale prompt headline
  hint: Record<string, string>;   // per-locale placeholder hint
  /** short banner label (1-3 words, all caps) per locale */
  label: Record<string, string>;
}

const THEMES_RAW: Array<Omit<Theme, 'week'>> = [
  {
    label: { en: 'PETTIEST SIN', zh: '最小气的罪', es: 'PECADO MEZQUINO', pt: 'PECADO MESQUINHO', ru: 'МЕЛОЧНЫЙ ГРЕХ', ja: '最も小さな罪', ko: '가장 쪼잔한 죄', fr: 'PÉCHÉ MESQUIN' },
    prompt: {
      en: 'WHAT WAS YOUR PETTIEST SIN THIS WEEK?',
      zh: '你这周做过最小气的一件事？',
      es: '¿CUÁL FUE TU PECADO MÁS MEZQUINO ESTA SEMANA?',
      pt: 'QUAL FOI SEU PECADO MAIS MESQUINHO ESTA SEMANA?',
      ru: 'КАКОЙ САМЫЙ МЕЛОЧНЫЙ ГРЕХ ЭТОЙ НЕДЕЛИ?',
      ja: '今週一番ちっぽけな罪は？',
      ko: '이번 주 가장 쪼잔한 죄는?',
      fr: 'QUEL ÉTAIT TON PÉCHÉ LE PLUS MESQUIN CETTE SEMAINE?',
    },
    hint: {
      en: 'I took the last...', zh: '我抢走了最后一……',
      es: 'Me quedé con el último…', pt: 'Eu peguei o último…',
      ru: 'Я забрал последний…', ja: '最後の…を取った',
      ko: '마지막 ...를 가져갔다', fr: "J'ai pris le dernier…",
    },
  },
  {
    label: { en: 'MESSAGE NEVER SENT', zh: '没发出去的消息', es: 'MENSAJE NO ENVIADO', pt: 'MENSAGEM NÃO ENVIADA', ru: 'НЕПОСЛАННОЕ', ja: '送らなかったLINE', ko: '안 보낸 메시지', fr: 'MESSAGE NON ENVOYÉ' },
    prompt: {
      en: 'WHAT MESSAGE DID YOU TYPE BUT NEVER SEND?',
      zh: '你打好了但没发出去的那条消息？',
      es: '¿QUÉ MENSAJE ESCRIBISTE PERO NUNCA ENVIASTE?',
      pt: 'QUE MENSAGEM VOCÊ DIGITOU MAS NUNCA ENVIOU?',
      ru: 'КАКОЕ СООБЩЕНИЕ ТЫ НАПИСАЛ, НО НЕ ОТПРАВИЛ?',
      ja: '打ったけど送らなかったメッセージは？',
      ko: '쓰고는 안 보낸 메시지?',
      fr: "QUEL MESSAGE AS-TU ÉCRIT MAIS JAMAIS ENVOYÉ?",
    },
    hint: {
      en: 'I almost said...', zh: '我差点说……',
      es: 'Casi dije…', pt: 'Eu quase disse…',
      ru: 'Я почти написал…', ja: '言いそうになった…',
      ko: '거의 보낼 뻔했어...', fr: 'J\'ai failli dire…',
    },
  },
  {
    label: { en: '3AM CONFESSION', zh: '凌晨3点', es: 'CONFESIÓN DE LAS 3AM', pt: 'CONFISSÃO DAS 3 DA MANHÃ', ru: 'В 3 НОЧИ', ja: '深夜3時', ko: '새벽 3시', fr: 'CONFESSION DE 3H' },
    prompt: {
      en: 'WHAT DID YOU DO AT 3AM THIS WEEK?',
      zh: '你这周凌晨3点干了什么？',
      es: '¿QUÉ HICISTE A LAS 3AM ESTA SEMANA?',
      pt: 'O QUE VOCÊ FEZ ÀS 3 DA MANHÃ ESTA SEMANA?',
      ru: 'ЧТО ТЫ ДЕЛАЛ В 3 НОЧИ НА ЭТОЙ НЕДЕЛЕ?',
      ja: '今週深夜3時、何してた？',
      ko: '이번 주 새벽 3시에 뭐 했어?',
      fr: "QU'AS-TU FAIT À 3H DU MATIN CETTE SEMAINE?",
    },
    hint: {
      en: 'I was just...', zh: '我只是……',
      es: 'Solo estaba…', pt: 'Eu só estava…',
      ru: 'Я просто…', ja: 'ただ…してた',
      ko: '그냥...', fr: "J'étais juste en train de…",
    },
  },
  {
    label: { en: 'TINY LIE', zh: '小谎', es: 'PEQUEÑA MENTIRA', pt: 'PEQUENA MENTIRA', ru: 'МАЛЕНЬКАЯ ЛОЖЬ', ja: '小さな嘘', ko: '작은 거짓말', fr: 'PETIT MENSONGE' },
    prompt: {
      en: 'WHAT TINY LIE GOT TOO BIG?',
      zh: '哪个小谎滚成了大雪球？',
      es: '¿QUÉ PEQUEÑA MENTIRA SE HIZO ENORME?',
      pt: 'QUE PEQUENA MENTIRA FICOU GRANDE DEMAIS?',
      ru: 'КАКАЯ МАЛЕНЬКАЯ ЛОЖЬ РАЗРОСЛАСЬ?',
      ja: 'どんな小さな嘘が大きくなった？',
      ko: '어떤 작은 거짓말이 너무 커졌어?',
      fr: 'QUEL PETIT MENSONGE EST DEVENU TROP GROS?',
    },
    hint: {
      en: 'I told my...', zh: '我跟……说……',
      es: 'Le dije a…', pt: 'Eu disse pra…',
      ru: 'Я сказал…', ja: '…に言ったら',
      ko: '...한테 말했더니', fr: "J'ai dit à…",
    },
  },
  {
    label: { en: 'SHOWER RANT', zh: '淋浴里的演讲', es: 'DISCURSO DE DUCHA', pt: 'DISCURSO DE BANHO', ru: 'РЕЧЬ В ДУШЕ', ja: 'シャワー演説', ko: '샤워실 연설', fr: 'DISCOURS DE DOUCHE' },
    prompt: {
      en: 'WHAT DID YOU REHEARSE IN THE SHOWER?',
      zh: '你在洗澡的时候排练了什么？',
      es: '¿QUÉ ENSAYASTE EN LA DUCHA?',
      pt: 'O QUE VOCÊ ENSAIOU NO CHUVEIRO?',
      ru: 'ЧТО ТЫ РЕПЕТИРОВАЛ В ДУШЕ?',
      ja: 'シャワー中、何の練習をしてた？',
      ko: '샤워하면서 뭘 연습했어?',
      fr: "QU'AS-TU RÉPÉTÉ SOUS LA DOUCHE?",
    },
    hint: {
      en: 'The speech I would give...', zh: '我会给他/她的那段话……',
      es: 'El discurso que les daría…', pt: 'O discurso que eu daria…',
      ru: 'Речь, которую бы я сказал…', ja: '言いたかった台詞は…',
      ko: '하고 싶었던 말은...', fr: 'Le discours que je donnerais…',
    },
  },
  {
    label: { en: 'CART ABANDONED', zh: '没付款的购物车', es: 'CARRITO ABANDONADO', pt: 'CARRINHO ABANDONADO', ru: 'БРОШЕННАЯ КОРЗИНА', ja: '放置したカート', ko: '버려진 장바구니', fr: 'PANIER ABANDONNÉ' },
    prompt: {
      en: 'WHAT DID YOU ALMOST BUY THIS WEEK?',
      zh: '你这周差点买下什么？',
      es: '¿QUÉ ESTUVISTE A PUNTO DE COMPRAR ESTA SEMANA?',
      pt: 'O QUE VOCÊ QUASE COMPROU ESTA SEMANA?',
      ru: 'ЧТО ТЫ ПОЧТИ КУПИЛ НА ЭТОЙ НЕДЕЛЕ?',
      ja: '今週、買いそうになったものは？',
      ko: '이번 주 거의 살 뻔한 건?',
      fr: "QU'AS-TU FAILLI ACHETER CETTE SEMAINE?",
    },
    hint: {
      en: 'In my cart was...', zh: '我购物车里有……',
      es: 'En mi carrito tenía…', pt: 'No meu carrinho tinha…',
      ru: 'В моей корзине было…', ja: 'カートに入れたのは…',
      ko: '장바구니에 들어있던 건...', fr: 'Dans mon panier il y avait…',
    },
  },
  {
    label: { en: 'EXIT TAKEN', zh: '逃跑路线', es: 'SALIDA TOMADA', pt: 'SAÍDA TOMADA', ru: 'ВЫХОД', ja: '逃げ道', ko: '도망친 길', fr: 'SORTIE PRISE' },
    prompt: {
      en: 'WHEN DID YOU LEAVE INSTEAD OF APOLOGIZING?',
      zh: '什么时候你选择走人而不是道歉？',
      es: '¿CUÁNDO TE FUISTE EN VEZ DE PEDIR PERDÓN?',
      pt: 'QUANDO VOCÊ SAIU EM VEZ DE PEDIR DESCULPA?',
      ru: 'КОГДА ТЫ УШЁЛ ВМЕСТО ТОГО, ЧТОБЫ ИЗВИНИТЬСЯ?',
      ja: '謝らずに逃げたのはいつ？',
      ko: '사과 대신 도망친 적이 있어?',
      fr: 'QUAND ES-TU PARTI AU LIEU DE T\'EXCUSER?',
    },
    hint: {
      en: 'I just walked away from...', zh: '我直接走开了，离开……',
      es: 'Me alejé de…', pt: 'Eu só saí de…',
      ru: 'Я просто ушёл от…', ja: '…から逃げた',
      ko: '...에서 그냥 가버렸어', fr: "Je me suis éloigné de…",
    },
  },
  {
    label: { en: 'BOOK FAKED', zh: '装读过的书', es: 'LIBRO FINGIDO', pt: 'LIVRO FINGIDO', ru: 'КНИГА ВРАНЬЁ', ja: 'ふりした本', ko: '읽은 척한 책', fr: 'LIVRE BLUFFÉ' },
    prompt: {
      en: 'WHAT BOOK DID YOU PRETEND TO READ?',
      zh: '哪本书你装读过？',
      es: '¿QUÉ LIBRO FINGISTE LEER?',
      pt: 'QUE LIVRO VOCÊ FINGIU TER LIDO?',
      ru: 'КАКУЮ КНИГУ ТЫ ПРИТВОРИЛСЯ ЧТО ЧИТАЛ?',
      ja: '読んだふりした本は？',
      ko: '읽은 척했던 책은?',
      fr: 'QUEL LIVRE AS-TU FAIT SEMBLANT DE LIRE?',
    },
    hint: {
      en: 'I told everyone I read...', zh: '我跟所有人说我读过……',
      es: 'A todos les dije que leí…', pt: 'Falei pra todos que li…',
      ru: 'Я всем сказал что читал…', ja: '読んだと言ったのは…',
      ko: '읽었다고 했던 건...', fr: "J'ai dit à tous que j'avais lu…",
    },
  },
  {
    label: { en: 'COMPLIMENT KEPT', zh: '没说出口的夸赞', es: 'CUMPLIDO NO DADO', pt: 'ELOGIO NÃO DADO', ru: 'НЕСКАЗАННЫЙ КОМПЛИМЕНТ', ja: '言わなかった褒め言葉', ko: '못 한 칭찬', fr: 'COMPLIMENT NON DIT' },
    prompt: {
      en: 'WHAT COMPLIMENT DID YOU NOT GIVE?',
      zh: '你没说出口的那句夸赞是？',
      es: '¿QUÉ CUMPLIDO NO DISTE?',
      pt: 'QUE ELOGIO VOCÊ NÃO DEU?',
      ru: 'КАКОЙ КОМПЛИМЕНТ ТЫ НЕ СКАЗАЛ?',
      ja: '言わなかった褒め言葉は？',
      ko: '하지 않은 칭찬은?',
      fr: "QUEL COMPLIMENT N'AS-TU PAS DONNÉ?",
    },
    hint: {
      en: 'I wanted to say...', zh: '我想说的是……',
      es: 'Quería decirle…', pt: 'Eu queria dizer…',
      ru: 'Я хотел сказать…', ja: '言いたかったのは…',
      ko: '하고 싶었던 말은...', fr: 'Je voulais dire…',
    },
  },
  {
    label: { en: 'WATCHED ALONE', zh: '一个人看时', es: 'A SOLAS', pt: 'SOZINHO', ru: 'НАЕДИНЕ', ja: '一人の時', ko: '혼자 있을 때', fr: 'SEUL' },
    prompt: {
      en: 'WHAT DO YOU DO WHEN NO ONE IS WATCHING?',
      zh: '没人看的时候你会做什么？',
      es: '¿QUÉ HACES CUANDO NADIE TE VE?',
      pt: 'O QUE VOCÊ FAZ QUANDO NINGUÉM TÁ OLHANDO?',
      ru: 'ЧТО ТЫ ДЕЛАЕШЬ, КОГДА НИКТО НЕ СМОТРИТ?',
      ja: '誰も見てない時に何してる？',
      ko: '아무도 안 볼 때 뭐 해?',
      fr: 'QUE FAIS-TU QUAND PERSONNE NE REGARDE?',
    },
    hint: {
      en: 'Honestly, I just...', zh: '其实我就……',
      es: 'Honestamente, solo…', pt: 'Sinceramente, eu só…',
      ru: 'Честно, я просто…', ja: '正直、ただ…',
      ko: '솔직히 그냥...', fr: 'Honnêtement, je…',
    },
  },
  {
    label: { en: 'TUESDAY FEELING', zh: '周二感', es: 'SENTIR DE MARTES', pt: 'SENSAÇÃO DE TERÇA', ru: 'ВТОРНИК', ja: '火曜日の気分', ko: '화요일 기분', fr: 'AMBIANCE MARDI' },
    prompt: {
      en: 'WHICH TUESDAY FELT LIKE A FRIDAY?',
      zh: '哪个周二感觉像周五？',
      es: '¿QUÉ MARTES SE SINTIÓ COMO VIERNES?',
      pt: 'QUE TERÇA PARECIA UMA SEXTA?',
      ru: 'КАКОЙ ВТОРНИК ОЩУЩАЛСЯ КАК ПЯТНИЦА?',
      ja: '金曜日みたいな火曜日は？',
      ko: '금요일 같았던 화요일은?',
      fr: 'QUEL MARDI A SEMBLÉ UN VENDREDI?',
    },
    hint: {
      en: 'That Tuesday I...', zh: '那个周二我……',
      es: 'Ese martes yo…', pt: 'Naquela terça eu…',
      ru: 'В тот вторник я…', ja: 'あの火曜日、…した',
      ko: '그 화요일 나는...', fr: 'Ce mardi-là j\'ai…',
    },
  },
  {
    label: { en: 'TAB CLOSED', zh: '关掉的对话', es: 'PESTAÑA CERRADA', pt: 'ABA FECHADA', ru: 'ВКЛАДКА', ja: '閉じたタブ', ko: '닫은 탭', fr: 'ONGLET FERMÉ' },
    prompt: {
      en: 'WHOSE MESSAGE DID YOU "FORGET" TO REPLY TO?',
      zh: '谁的消息你“忘了”回？',
      es: '¿A QUIÉN "OLVIDASTE" RESPONDER?',
      pt: 'PRA QUEM VOCÊ "ESQUECEU" DE RESPONDER?',
      ru: 'КОМУ ТЫ "ЗАБЫЛ" ОТВЕТИТЬ?',
      ja: '誰のメッセージに「忘れて」返さなかった？',
      ko: '누구한테 답장 "잊었어"?',
      fr: 'À QUI AS-TU "OUBLIÉ" DE RÉPONDRE?',
    },
    hint: {
      en: 'They sent me...', zh: 'TA 给我发了……',
      es: 'Me escribieron…', pt: 'Me mandaram…',
      ru: 'Мне написали…', ja: 'メッセージが来た…',
      ko: '메시지가 왔어...', fr: "Ils m'ont écrit…",
    },
  },
];

export const THEMES: Theme[] = THEMES_RAW.map((t, i) => ({ ...t, week: i }));

// ISO-ish week number — number of weeks since the epoch's first Sunday,
// modulo theme count. Stable for a calendar week.
export function currentWeekIndex(now: Date = new Date()): number {
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const weekOfYear = Math.floor((days + startOfYear.getDay()) / 7);
  return weekOfYear % THEMES.length;
}

export function currentTheme(now: Date = new Date()): Theme {
  return THEMES[currentWeekIndex(now)];
}
