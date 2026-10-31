export interface Question {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  reference: string;
  path: string;
  summary: string;
  reflection: string;
  questions: Question[];
}
// Resumos e perguntas autorais. O texto integral permanece na fonte oficial.
export const LESSONS: Lesson[] = [
  {
    id: "semente",
    title: "Uma semente de fé",
    subtitle: "Começar pequeno também é começar",
    reference: "Alma 32:21–43",
    path: "bofm/alma/32",
    summary:
      "Alma compara a palavra a uma semente. O convite é experimentar, observar o crescimento e continuar nutrindo a fé com paciência.",
    reflection: "Que pequeno hábito você pode nutrir nesta semana?",
    questions: [
      {
        prompt: "Na comparação de Alma, o que precisa ser nutrido?",
        options: [
          "A reputação diante dos outros",
          "A palavra, como uma semente",
          "A certeza de nunca ter dúvidas",
        ],
        answer: 1,
        explanation:
          "Alma 32:28, 37 compara a palavra a uma semente e ensina a cuidar de seu crescimento.",
      },
      {
        prompt: "O que Alma ensina sobre a fé?",
        options: [
          "É ter conhecimento perfeito de tudo",
          "Dispensa qualquer ação",
          "É esperar por coisas verdadeiras que não vemos",
        ],
        answer: 2,
        explanation:
          "Alma 32:21 distingue fé de conhecimento perfeito e a relaciona à esperança em coisas verdadeiras.",
      },
    ],
  },
  {
    id: "luz",
    title: "Sua luz no mundo",
    subtitle: "A fé que se transforma em cuidado",
    reference: "Mateus 5:13–16",
    path: "nt/matt/5",
    summary:
      "Jesus usa as imagens do sal e da luz para ensinar sobre influência. As boas obras podem ajudar outras pessoas a reconhecer e glorificar o Pai.",
    reflection: "Qual gesto de bondade você pode oferecer hoje?",
    questions: [
      {
        prompt: "A que Jesus compara seus discípulos?",
        options: [
          "Ao sal da terra e à luz do mundo",
          "A tesouros escondidos de todos",
          "A juízes de seus vizinhos",
        ],
        answer: 0,
        explanation: "Em Mateus 5:13–14, Jesus usa as imagens do sal e da luz.",
      },
      {
        prompt: "Segundo Mateus 5:16, as boas obras devem levar as pessoas a…",
        options: [
          "Competir por reconhecimento",
          "Glorificar o Pai",
          "Evitar ajudar em público",
        ],
        answer: 1,
        explanation:
          "O propósito ensinado é glorificar o Pai, e não buscar admiração pessoal.",
      },
    ],
  },
  {
    id: "amor",
    title: "O caminho do amor",
    subtitle: "Mais que palavras bonitas",
    reference: "1 Coríntios 13",
    path: "nt/1-cor/13",
    summary:
      "Paulo ensina que dons e realizações perdem o sentido sem amor. Paciência, bondade e humildade dão forma a esse amor no cotidiano.",
    reflection: "Em qual relacionamento você pode exercitar mais paciência?",
    questions: [
      {
        prompt: "Qual atitude combina com o amor descrito por Paulo?",
        options: [
          "Guardar cada ofensa",
          "Procurar sempre o próprio interesse",
          "Agir com paciência e bondade",
        ],
        answer: 2,
        explanation:
          "1 Coríntios 13:4–5 descreve o amor como paciente, bondoso e sem egoísmo.",
      },
      {
        prompt: "Entre fé, esperança e amor, qual Paulo chama de maior?",
        options: ["O amor", "A habilidade de falar", "O conhecimento"],
        answer: 0,
        explanation:
          "Paulo encerra o capítulo destacando o amor em 1 Coríntios 13:13.",
      },
    ],
  },
  {
    id: "servir",
    title: "Servir é se aproximar",
    subtitle: "O sagrado nos gestos simples",
    reference: "Mosias 2:17–19",
    path: "bofm/mosiah/2",
    summary:
      "O rei Benjamim relaciona o serviço ao próximo ao serviço a Deus. Seu ensino convida a reconhecer a dignidade de quem está ao nosso redor.",
    reflection: "Quem está perto de você e precisa de ajuda prática?",
    questions: [
      {
        prompt: "Segundo Mosias 2:17, servir ao próximo também é…",
        options: [
          "Servir a Deus",
          "Garantir uma recompensa material",
          "Mostrar superioridade",
        ],
        answer: 0,
        explanation:
          "Benjamim ensina que o serviço aos semelhantes é serviço a Deus.",
      },
      {
        prompt: "Qual ação aplica esse ensinamento?",
        options: [
          "Esperar um título para ajudar",
          "Ajudar alguém em uma necessidade real",
          "Servir apenas se houver elogios",
        ],
        answer: 1,
        explanation:
          "Ajudar alguém é uma aplicação prática do convite ao serviço de Mosias 2:17–19.",
      },
    ],
  },
  {
    id: "pedir",
    title: "Sabedoria para o caminho",
    subtitle: "Há espaço para suas perguntas",
    reference: "Tiago 1:5–6",
    path: "nt/james/1",
    summary:
      "Tiago convida quem precisa de sabedoria a pedi-la a Deus. A oração é apresentada como um ato de confiança na generosidade divina.",
    reflection: "Que pergunta você gostaria de levar à sua próxima oração?",
    questions: [
      {
        prompt: "O que Tiago orienta quem precisa de sabedoria a fazer?",
        options: [
          "Esconder suas perguntas",
          "Comparar-se com os outros",
          "Pedir a Deus",
        ],
        answer: 2,
        explanation: "Tiago 1:5 convida a pedir sabedoria a Deus.",
      },
      {
        prompt: "Como Deus é descrito nesse convite?",
        options: [
          "Generoso ao dar",
          "Indiferente às perguntas",
          "Disposto a humilhar quem pede",
        ],
        answer: 0,
        explanation:
          "Tiago 1:5 descreve Deus como aquele que dá liberalmente, sem censurar quem pede.",
      },
    ],
  },
  {
    id: "caridade",
    title: "Um amor que permanece",
    subtitle: "A prática continua além da lição",
    reference: "Morôni 7:45–48",
    path: "bofm/moro/7",
    summary:
      "O ensino preservado por Morôni descreve a caridade como o puro amor de Cristo. Somos convidados a buscá-la em oração e a vivê-la com perseverança.",
    reflection: "O que você quer levar destas lições para a próxima semana?",
    questions: [
      {
        prompt: "Como a caridade é definida em Morôni 7:47?",
        options: [
          "Uma troca de favores",
          "O puro amor de Cristo",
          "Uma forma de prestígio",
        ],
        answer: 1,
        explanation: "Morôni 7:47 relaciona a caridade ao puro amor de Cristo.",
      },
      {
        prompt: "Qual convite aparece em Morôni 7:48?",
        options: [
          "Evitar toda convivência",
          "Desistir quando for difícil",
          "Orar ao Pai para sermos cheios desse amor",
        ],
        answer: 2,
        explanation:
          "O versículo convida a orar com toda a energia do coração por esse amor.",
      },
    ],
  },
];
export const getLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
export const scriptureUrl = (path: string) =>
  `https://www.churchofjesuschrist.org/study/scriptures/${path}?lang=por`;
