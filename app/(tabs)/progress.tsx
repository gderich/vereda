import React, { useState } from "react";
import { Text, View, Alert, Share } from "react-native";
import { useUserStore } from "@/store/userStore";
import { LESSONS } from "@/data/lessons";
import { localDateKey } from "@/utils/date";
import {
  enableDailyReminder,
  disableDailyReminder,
} from "@/services/notifications";
import {
  applyDownloadedUpdate,
  checkForAppUpdate,
  getUpdateInfo,
} from "@/services/updates";
import { Page, Button, Progress, ui, colors } from "@/components/ui";
import {
  testSound,
  soundsAvailable,
  playSound,
  stopSounds,
} from "@/services/sounds";

export default function ProgressScreen() {
  const user = useUserStore();
  const [busy, setBusy] = useState(false);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const updateInfo = getUpdateInfo();
  const count = Object.keys(user.lessonCompletions).length;
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const key = localDateKey(date);
    return {
      key,
      label: ["D", "S", "T", "Q", "Q", "S", "S"][date.getDay()],
      done: (user.studyDays[key] || []).length,
    };
  });
  const badges = [
    {
      title: "Primeira semente",
      description: "Concluir sua primeira lição",
      earned: count >= 1,
    },
    {
      title: "Criando raízes",
      description: "Concluir três lições diferentes",
      earned: count >= 3,
    },
    {
      title: "Jornada completa",
      description: "Concluir as seis lições de Fundamentos",
      earned: count >= LESSONS.length,
    },
    {
      title: "Constância",
      description: "Estudar por sete dias seguidos",
      earned: user.maxStreak >= 7,
    },
    {
      title: "Leitor dedicado",
      description: "Registrar dez capítulos nos planos",
      earned: user.chaptersReadCount >= 10,
    },
  ];

  async function reminder() {
    setBusy(true);
    try {
      if (user.notificationsEnabled) {
        await disableDailyReminder();
        useUserStore.setState({ notificationsEnabled: false });
      } else {
        const enabled = await enableDailyReminder();
        useUserStore.setState({ notificationsEnabled: enabled });
        if (!enabled)
          Alert.alert(
            "Permissão necessária",
            "Ative as notificações nas configurações do celular.",
          );
      }
    } catch {
      Alert.alert(
        "Não foi possível configurar",
        "Tente novamente nas configurações do celular.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function checkUpdate() {
    setUpdateBusy(true);
    setUpdateMessage("Verificando…");
    try {
      const result = await checkForAppUpdate();
      setUpdateMessage(result.message);
      setUpdateDownloaded(result.status === "downloaded");
    } finally {
      setUpdateBusy(false);
    }
  }

  return (
    <Page>
      <Text style={ui.eyebrow}>SEU CRESCIMENTO</Text>
      <Text accessibilityRole="header" style={ui.title}>
        Cada passo conta.
      </Text>
      <View style={ui.card}>
        <Text style={ui.heading}>
          Nível {user.level} · {user.xp} XP
        </Text>
        <Progress
          value={(user.xp % 200) / 200}
          label="Progresso para o próximo nível"
        />
        <Text style={ui.small}>
          Faltam {200 - (user.xp % 200)} XP para o próximo nível.
        </Text>
        <Text style={ui.body}>
          {count} lições · {user.chaptersReadCount} capítulos
        </Text>
        <Text style={ui.small}>Sua maior sequência: {user.maxStreak} dias</Text>
      </View>
      <Text accessibilityRole="header" style={ui.heading}>
        Últimos sete dias
      </Text>
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        {week.map((day) => (
          <View
            accessible
            accessibilityLabel={`${day.key}: ${day.done} lições`}
            key={day.key}
            style={{ alignItems: "center", gap: 8 }}
          >
            <Text style={ui.small}>{day.label}</Text>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: day.done ? colors.green : colors.line,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: day.done ? "white" : colors.muted }}>
                {day.done ? "✓" : "·"}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={ui.small}>
        O calendário mostra lições e revisões. Leituras dos planos também mantêm
        sua sequência.
      </Text>
      <Text accessibilityRole="header" style={ui.heading}>
        Seu ritmo
      </Text>
      <Text style={ui.body}>
        Meta de lições diferentes por dia. Você pode ajustar quando quiser.
      </Text>
      <View style={ui.row}>
        {[1, 2, 3].map((goal) => (
          <View key={goal} style={{ flex: 1 }}>
            <Button
              secondary={user.dailyGoal !== goal}
              title={`${goal} ${goal === 1 ? "lição" : "lições"}${user.dailyGoal === goal ? " ✓" : ""}`}
              onPress={() => user.setDailyGoal(goal)}
            />
          </View>
        ))}
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Sons do estudo</Text>
        <View style={ui.row}>
          {[0.4, 0.8, 1].map((volume) => (
            <Button
              key={volume}
              secondary={user.soundVolume !== volume}
              title={`${Math.round(volume * 100)}%`}
              onPress={() => {
                useUserStore.setState({ soundVolume: volume });
                void testSound();
              }}
            />
          ))}
        </View>
        <Text style={ui.body}>
          Notas suaves para acertos, novas tentativas e conclusão. Sem música
          contínua.
        </Text>
        <Button
          secondary
          title={
            user.soundsEnabled
              ? "Sons ativados · Desligar"
              : "Sons desativados · Ligar"
          }
          onPress={() => {
            const enabled = !user.soundsEnabled;
            useUserStore.setState({ soundsEnabled: enabled });
            if (enabled) void playSound("correct");
            else void stopSounds();
          }}
        />
        {soundsAvailable() ? (
          <Button
            secondary
            disabled={!user.soundsEnabled}
            title="Ouvir exemplo"
            onPress={() => void testSound()}
          />
        ) : (
          <Text style={ui.small}>
            Os sons estarão disponíveis depois de instalar a nova versão do
            aplicativo.
          </Text>
        )}
      </View>
      <Text accessibilityRole="header" style={ui.heading}>
        Conquistas
      </Text>
      {badges.map((b) => (
        <View
          key={b.title}
          style={[
            ui.card,
            { backgroundColor: b.earned ? colors.pale : colors.surface },
          ]}
        >
          <Text style={ui.heading}>
            {b.earned ? "✦" : "○"} {b.title}
          </Text>
          <Text style={ui.small}>
            {b.description} · {b.earned ? "Conquistada" : "Em andamento"}
          </Text>
        </View>
      ))}
      <View style={ui.card}>
        <Text style={ui.heading}>Um convite às 19h</Text>
        <Text style={ui.body}>Lembrete diário no horário do aparelho.</Text>
        <Button
          secondary
          disabled={busy}
          title={
            busy
              ? "Configurando…"
              : user.notificationsEnabled
                ? "Desativar lembrete"
                : "Ativar lembrete"
          }
          onPress={reminder}
        />
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Atualizações do Vereda</Text>
        <Text style={ui.body}>
          O app pode receber correções, novas telas, textos e conteúdos sem você
          precisar instalar outro APK.
        </Text>
        <Text style={ui.small}>
          {updateInfo.enabled
            ? `Canal: ${updateInfo.channel || "não identificado"} · Runtime: ${updateInfo.runtimeVersion || "—"}`
            : "Atualizações OTA ficam disponíveis no APK de distribuição."}
        </Text>
        {!!updateMessage && <Text style={ui.small}>{updateMessage}</Text>}
        {updateDownloaded ? (
          <Button
            title="Reiniciar e aplicar atualização"
            onPress={() => void applyDownloadedUpdate()}
          />
        ) : (
          <Button
            secondary
            disabled={updateBusy}
            title={updateBusy ? "Verificando…" : "Verificar atualização"}
            onPress={() => void checkUpdate()}
          />
        )}
      </View>
      <View style={ui.card}>
        <Text style={ui.heading}>Seu diário de reflexões</Text>
        {LESSONS.filter((l) => user.reflections[l.id]?.trim()).length === 0 ? (
          <Text style={ui.body}>
            Suas reflexões aparecerão aqui após uma lição.
          </Text>
        ) : (
          LESSONS.filter((l) => user.reflections[l.id]?.trim()).map((l) => (
            <View key={l.id} style={{ gap: 8, paddingVertical: 8 }}>
              <Text style={{ color: colors.green, fontWeight: "700" }}>
                {l.title}
              </Text>
              <Text selectable style={ui.body}>
                {user.reflections[l.id]}
              </Text>
            </View>
          ))
        )}
      </View>
      <Button
        secondary
        title="Compartilhar meu resumo"
        onPress={() =>
          Share.share({
            message: `Minha jornada no Vereda: ${count} lições, ${user.chaptersReadCount} capítulos e ${user.xp} XP. Um pequeno passo por dia.`,
          }).catch(() =>
            Alert.alert("Não foi possível compartilhar", "Tente novamente."),
          )
        }
      />
      <Text style={ui.small}>
        O Vereda é um projeto independente. Progresso e reflexões ficam neste
        aparelho; não há sincronização com a conta da Igreja. Desinstalar o app
        pode apagar esses dados.
      </Text>
    </Page>
  );
}
