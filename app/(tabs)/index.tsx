import React from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { LESSONS } from "@/data/lessons";
import { localDateKey } from "@/utils/date";
import { Page, Button, Progress, ui, colors } from "@/components/ui";
import PathArt from "@/components/PathArt";
import BrandMark from "@/components/BrandMark";
import ReadingHabitCard from "@/components/ReadingHabitCard";
import DailyMissions from "@/components/DailyMissions";
import { testSound } from "@/services/sounds";
export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore();
  const done = Object.keys(user.lessonCompletions).length;
  const next = LESSONS.find((l) => !user.lessonCompletions[l.id]);
  const today = (user.studyDays[localDateKey(new Date())] || []).length;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const streak = [localDateKey(new Date()), localDateKey(yesterday)].includes(
    user.lastReadDate || "",
  )
    ? user.streakDays
    : 0;
  return (
    <Page>
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        <View style={[ui.row, { gap: 8 }]}>
          <View style={{ backgroundColor: colors.night, borderRadius: 12 }}>
            <BrandMark size={40} />
          </View>
          <Text style={ui.eyebrow}>VEREDA</Text>
        </View>
        <Text style={{ color: colors.green, fontWeight: "700" }}>
          🔥 {streak} dias · {user.xp} XP
        </Text>
      </View>
      <View>
        <Text accessibilityRole="header" style={ui.title}>
          Luz para o seu{"\n"}próximo passo.
        </Text>
        <PathArt />
        <Text style={ui.body}>
          Leia com atenção. Aprenda com propósito. Leve uma pequena ação para o
          seu dia.
        </Text>
      </View>
      <ReadingHabitCard />
      <View style={ui.card}>
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Text style={ui.heading}>
            {today >= user.dailyGoal
              ? "Meta alcançada!"
              : "Seu momento de hoje"}
          </Text>
          <Text style={ui.small}>
            {Math.min(today, user.dailyGoal)}/{user.dailyGoal} lições
          </Text>
        </View>
        <Progress value={today / user.dailyGoal} label="Meta diária" />
        <Text style={ui.small}>
          Uma lição diferente por marcação. Revisar também conta para a meta.
        </Text>
        <Button
          title={next ? `Começar · ${next.title}` : "Revisar a jornada"}
          onPress={() =>
            router.push({
              pathname: "/lesson/[id]",
              params: { id: next?.id || LESSONS[0].id },
            })
          }
        />
      </View>
      <Button
        secondary
        title="♫ Testar áudio do app"
        onPress={() => void testSound()}
      />
      <DailyMissions />
      <View style={ui.card}>
        <Text style={ui.eyebrow}>PRÁTICA RÁPIDA</Text>
        <Text style={ui.heading}>Desafio do dia</Text>
        <Text style={ui.body}>
          Cinco perguntas para recordar o que importa. Até 30 XP na primeira
          rodada do dia.
        </Text>
        <Button
          title="Começar desafio"
          onPress={() => router.push("/challenge")}
        />
      </View>
      <View>
        <Text style={ui.eyebrow}>JORNADA 01 · FUNDAMENTOS</Text>
        <Text accessibilityRole="header" style={[ui.heading, { marginTop: 8 }]}>
          Aprender e viver
        </Text>
        <Text style={ui.small}>
          {done} de {LESSONS.length} lições concluídas · Sem pressa, sem perder
          vidas.
        </Text>
      </View>
      {LESSONS.map((lesson, i) => {
        const completed = !!user.lessonCompletions[lesson.id];
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${lesson.title}. ${completed ? "Concluída. Revisar" : "Começar lição"}`}
            key={lesson.id}
            onPress={() =>
              router.push({
                pathname: "/lesson/[id]",
                params: { id: lesson.id },
              })
            }
            style={({ pressed }) => [
              {
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
                padding: 16,
                backgroundColor: colors.surface,
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  next?.id === lesson.id ? colors.green : colors.line,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                backgroundColor: completed ? colors.green : colors.pale,
                justifyContent: "center",
                alignItems: "center",
                borderBottomWidth: 4,
                borderBottomColor: "#C0D5C7",
              }}
            >
              {completed ? (
                <Ionicons name="checkmark" color={colors.night} size={28} />
              ) : (
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: colors.green,
                  }}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: colors.ink }}
              >
                {lesson.title}
              </Text>
              <Text style={ui.small}>
                {lesson.reference} ·{" "}
                {completed
                  ? "Concluída · Revisar"
                  : next?.id === lesson.id
                    ? "Seu próximo passo · 30 XP"
                    : "30 XP"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        );
      })}
      <Button
        secondary
        title="Continuar meu plano de leitura"
        onPress={() => router.push("/plans")}
      />
    </Page>
  );
}
