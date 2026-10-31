import React from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/userStore";
import { LESSONS } from "@/data/lessons";
import { localDateKey } from "@/utils/date";
import { Page, Button, Progress, ui, colors } from "@/components/ui";
import PathArt from "@/components/PathArt";
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
        <Text style={ui.eyebrow}>VEREDA</Text>
        <Text style={{ color: colors.green, fontWeight: "700" }}>
          ☀ {streak} dias · {user.xp} XP
        </Text>
      </View>
      <View>
        <Text accessibilityRole="header" style={ui.title}>
          Pequenos passos.{"\n"}Raízes profundas.
        </Text>
        <PathArt />
        <Text style={ui.body}>
          Um momento para ler, aprender e levar a fé para o dia.
        </Text>
      </View>
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
                paddingVertical: 12,
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
                <Ionicons name="checkmark" color="white" size={28} />
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
                {lesson.reference} · {completed ? "Revisar" : "30 XP"}
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
