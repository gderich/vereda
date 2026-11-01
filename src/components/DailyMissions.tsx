import React from "react";
import { Text, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "../store/userStore";
import { localDateKey } from "../utils/date";
import { playSound } from "../services/sounds";
import { Button, ui } from "./ui";
export default function DailyMissions() {
  const user = useUserStore(),
    router = useRouter(),
    today = localDateKey(new Date());
  const tasks = [
    !!user.readingDays[today]?.length,
    !!user.studyDays[today]?.length || user.challengeDays[today] !== undefined,
    !!user.reflectionDays[today],
  ];
  const claimed = user.claimedMissions.includes(today);
  return (
    <View style={ui.card}>
      <Text style={ui.eyebrow}>TRÊS PASSOS PARA HOJE</Text>
      <Text style={ui.heading}>
        {tasks.filter(Boolean).length}/3 missões · bônus de 25 XP
      </Text>
      <Text style={ui.body}>
        {tasks[0] ? "✓" : "○"} Ler e registrar um capítulo
      </Text>
      <Text style={ui.body}>
        {tasks[1] ? "✓" : "○"} Concluir uma lição ou desafio
      </Text>
      <Text style={ui.body}>
        {tasks[2] ? "✓" : "○"} Escrever uma reflexão em uma lição
      </Text>
      <Button
        secondary
        title={
          claimed
            ? "Bônus de hoje recebido"
            : tasks.every(Boolean)
              ? "Resgatar +25 XP"
              : "Ler um capítulo · +15 XP"
        }
        disabled={claimed}
        onPress={() => {
          if (tasks.every(Boolean)) {
            const xp = user.claimMissions();
            if (xp) {
              void playSound("complete");
              Alert.alert(
                "Missões concluídas!",
                `+${xp} XP pela dedicação de hoje.`,
              );
            }
          } else router.push("/library");
        }}
      />
      <Text style={ui.small}>
        Reflexões com pelo menos 15 caracteres contam para a missão. Seu texto
        fica privado neste aparelho.
      </Text>
    </View>
  );
}
