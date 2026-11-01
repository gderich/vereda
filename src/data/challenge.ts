import { LESSONS } from "./lessons";
export function dailyQuestions(date: string) {
  let seed =
    Array.from(date).reduce(
      (n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) | 0,
      7,
    ) >>> 0;
  const questions = LESSONS.flatMap((l) =>
    l.questions.map((q, i) => ({
      ...q,
      id: `${l.id}:${i}`,
      reference: l.reference,
    })),
  );
  for (let i = questions.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions.slice(0, 5);
}
