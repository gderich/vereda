import React, { useState } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getLesson, scriptureUrl } from "@/data/lessons";
import { useUserStore } from "@/store/userStore";
import { Page, Button, Progress, ui, colors } from "@/components/ui";
import PathArt from "@/components/PathArt";
import ScriptureReader from "@/components/ScriptureReader";
import { playSound } from "@/services/sounds";
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);
  const router = useRouter();
  const user = useUserStore();
  const [reading, setReading] = useState(false);
  const [step, setStep] = useState(-1);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [reward, setReward] = useState<number | null>(null);
  if (!lesson)
    return (
      <Page>
        <Text style={ui.heading}>Lição não encontrada</Text>
        <Button title="Voltar à jornada" onPress={() => router.replace("/")} />
      </Page>
    );
  const question = lesson.questions[step];
  const finish = step === lesson.questions.length;
  function exit() {
    if (step >= 0 && reward === null)
      Alert.alert(
        "Sair da lição?",
        "As respostas desta tentativa serão reiniciadas. Sua reflexão fica salva.",
        [
          { text: "Continuar estudando", style: "cancel" },
          { text: "Sair", onPress: () => router.replace("/") },
        ],
      );
    else router.replace("/");
  }
  return (
    <Page>
      {reading && (
        <ScriptureReader
          url={scriptureUrl(lesson.path)}
          title={lesson.reference}
          onClose={() => setReading(false)}
        />
      )}
      <Button secondary title="Voltar à jornada" onPress={exit} />
      <Text style={ui.eyebrow}>{lesson.reference.toUpperCase()}</Text>
      <Progress
        value={reward !== null ? 1 : (step + 1) / (lesson.questions.length + 2)}
        label="Progresso da lição"
      />
      {step === -1 ? (
        <>
          <Text accessibilityRole="header" style={ui.title}>
            {lesson.title}
          </Text>
          <Text style={ui.body}>{lesson.subtitle}</Text>
          <PathArt />
          <View style={ui.card}>
            <Text style={ui.heading}>Antes de começar</Text>
            <Text style={ui.body}>{lesson.summary}</Text>
            <Text style={ui.small}>
              Resumo de estudo do Vereda. Leia o trecho completo na fonte
              oficial ou no seu exemplar.
            </Text>
          </View>
          <Button
            secondary
            title={`Ler ${lesson.reference}`}
            onPress={() => setReading(true)}
          />
          <Text style={ui.small}>
            A Bíblia e o Livro de Mórmon abrem no leitor offline. Ao fechar a leitura, você volta à lição.
          </Text>
          <Button title="Já li · Vamos praticar" onPress={() => setStep(0)} />
        </>
      ) : finish ? (
        <>
          <Text accessibilityRole="header" style={ui.title}>
            {reward !== null ? "Mais um passo dado!" : "Leve para o seu dia"}
          </Text>
          <Text style={ui.body}>{lesson.reflection}</Text>
          <TextInput
            accessibilityLabel="Minha reflexão pessoal"
            placeholder="Minha reflexão (opcional)…"
            placeholderTextColor={colors.muted}
            multiline
            maxLength={2000}
            value={user.reflections[id] || ""}
            onChangeText={(text) => user.saveReflection(id, text)}
            style={ui.input}
          />
          <Text style={ui.small}>
            Sua reflexão é salva automaticamente neste aparelho.
          </Text>
          {reward === null ? (
            <Button
              title="Concluir lição"
              onPress={() => {
                const result = user.finishLesson(id, answers);
                if (result.completed) {
                  setReward(result.xp);
                  void playSound("complete");
                } else
                  Alert.alert(
                    "Revise as respostas",
                    "Volte à jornada e refaça a lição.",
                  );
              }}
            />
          ) : (
            <View style={ui.card}>
              <Text style={ui.heading}>
                {reward > 0
                  ? `+${reward} XP conquistados`
                  : "Revisão concluída"}
              </Text>
              <Text style={ui.body}>
                {reward > 0
                  ? "Você leu, praticou e refletiu. Continue amanhã."
                  : "Revisões mantêm sua sequência e contam uma vez por lição para a meta do dia. O XP é concedido na primeira conclusão."}
              </Text>
              <Button
                title="Voltar à jornada"
                onPress={() => router.replace("/")}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={ui.small}>
            PERGUNTA {step + 1} DE {lesson.questions.length}
          </Text>
          <Text accessibilityRole="header" style={ui.heading}>
            {question.prompt}
          </Text>
          {question.options.map((option, i) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{
                selected: selected === i,
                disabled: checked,
              }}
              disabled={checked}
              onPress={() => setSelected(i)}
              style={[
                ui.card,
                {
                  borderWidth: 2,
                  borderColor: selected === i ? colors.green : colors.line,
                  backgroundColor: selected === i ? colors.pale : colors.surface,
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
                {selected === question.answer
                  ? "Isso mesmo!"
                  : "Vamos olhar de novo"}
              </Text>
              <Text style={ui.body}>{question.explanation}</Text>
              <Text style={ui.small}>
                {selected === question.answer
                  ? "Você pode continuar."
                  : "Sem penalidade. Tente novamente com esse ensinamento em mente."}
              </Text>
            </View>
          )}
          <Button
            disabled={selected === null}
            title={
              !checked
                ? "Verificar"
                : selected === question.answer
                  ? "Continuar"
                  : "Tentar novamente"
            }
            onPress={() => {
              if (!checked) {
                setChecked(true);
                void playSound(
                  selected === question.answer ? "correct" : "retry",
                );
              } else if (selected === question.answer) {
                setAnswers([...answers, selected]);
                setStep(step + 1);
                setSelected(null);
                setChecked(false);
              } else {
                setSelected(null);
                setChecked(false);
              }
            }}
          />
        </>
      )}
    </Page>
  );
}
