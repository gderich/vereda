import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Page, Button, Progress, ui, colors } from "@/components/ui";
import { dailyQuestions } from "@/data/challenge";
import { localDateKey } from "@/utils/date";
import { useUserStore } from "@/store/userStore";
import { playSound } from "@/services/sounds";
export default function Challenge() {
  const router = useRouter();
  const user = useUserStore();
  const [date] = useState(() => localDateKey(new Date()));
  const [questions] = useState(() => dailyQuestions(date));
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ xp: number; score: number } | null>(
    null,
  );
  const q = questions[answers.length];
  return (
    <Page>
      <Button
        secondary
        title="Voltar à jornada"
        onPress={() => router.replace("/")}
      />
      <Text style={ui.eyebrow}>DESAFIO DIÁRIO · 5 PERGUNTAS</Text>
      <Text style={ui.title}>
        {result ? "Você foi além." : "O que ficou da leitura?"}
      </Text>
      <Progress
        value={result ? 1 : answers.length / questions.length}
        label="Progresso do desafio"
      />
      {result ? (
        <>
          <View style={ui.card}>
            <Text style={ui.heading}>
              {result.score}/5 acertos · +{result.xp} XP
            </Text>
            <Text style={ui.body}>
              {result.xp
                ? "A primeira rodada do dia rende 10 XP pela prática e 4 XP por acerto."
                : "Você já recebeu o XP do desafio hoje. Continue revisando livremente."}
            </Text>
          </View>
          {questions.filter((item, i) => item.answer !== answers[i]).length >
            0 && (
            <Text style={ui.heading}>Vamos guardar estes ensinamentos</Text>
          )}
          {questions.map((item, i) =>
            item.answer !== answers[i] ? (
              <View key={item.id} style={ui.card}>
                <Text style={ui.heading}>{item.prompt}</Text>
                <Text style={ui.body}>{item.explanation}</Text>
                <Text style={ui.small}>{item.reference}</Text>
              </View>
            ) : null,
          )}
          <Button
            title="Revisar novamente"
            onPress={() => {
              setAnswers([]);
              setSelected(null);
              setChecked(false);
              setResult(null);
            }}
          />
          <Button
            secondary
            title="Escolher uma leitura"
            onPress={() => router.push("/library")}
          />
        </>
      ) : (
        <>
          <Text style={ui.small}>
            PERGUNTA {answers.length + 1} DE 5 · {q.reference}
          </Text>
          <Text style={ui.heading}>{q.prompt}</Text>
          {q.options.map((option, i) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                selected: selected === i,
                disabled: checked,
              }}
              key={option}
              disabled={checked}
              onPress={() => setSelected(i)}
              style={[
                ui.card,
                {
                  borderWidth: 2,
                  borderColor: selected === i ? colors.green : colors.line,
                },
              ]}
            >
              <Text style={ui.body}>
                {String.fromCharCode(65 + i)}. {option}
              </Text>
            </Pressable>
          ))}
          {checked && (
            <View accessibilityLiveRegion="polite" style={ui.card}>
              <Text style={ui.heading}>
                {selected === q.answer
                  ? "✓ Muito bem!"
                  : "↺ Um novo aprendizado"}
              </Text>
              <Text style={ui.body}>{q.explanation}</Text>
            </View>
          )}
          <Button
            disabled={selected === null}
            title={checked ? "Continuar" : "Confirmar resposta"}
            onPress={() => {
              if (!checked) {
                setChecked(true);
                void playSound(selected === q.answer ? "correct" : "retry");
              } else {
                const updated = [...answers, selected!];
                setAnswers(updated);
                setSelected(null);
                setChecked(false);
                if (updated.length === questions.length) {
                  setResult(user.finishChallenge(date, updated));
                  void playSound("complete");
                }
              }
            }}
          />
          <Text style={ui.small}>
            Sem vidas ou bloqueios. A primeira resposta de cada pergunta define
            sua pontuação nesta rodada.
          </Text>
        </>
      )}
    </Page>
  );
}
