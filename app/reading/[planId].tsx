import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserStore } from "@/store/userStore";
import { usePlanStore } from "@/store/planStore";
import { getPlan, getNextChapter, calculatePlanProgress } from "@/data/plans";
import { getBook } from "@/data/books";
import { chapterUrl } from "@/data/scriptureLinks";
import { Button } from "@/components/ui";

import ScriptureReader from "@/components/ScriptureReader";
import { playSound } from "@/services/sounds";
export default function ReadingPlanScreen() {
  const [reading, setReading] = useState(false);
  const params = useLocalSearchParams<{ planId: string }>();
  const planId = Array.isArray(params.planId)
    ? params.planId[0]
    : params.planId;
  const router = useRouter();
  const { userPlans, completeChapter } = usePlanStore();
  const plan = getPlan(planId ?? "");
  const progress = userPlans[planId ?? ""];
  const next = plan
    ? getNextChapter(plan, progress?.completedChapters ?? [])
    : null;
  function finishChapter() {
    if (!plan || !next) return;
    const result = completeChapter(plan.id, next.bookId, next.chapter);
    if (!result.awarded) return;
    const user = useUserStore.getState();
    void playSound("complete");
    user.recordReading(next.bookId, next.chapter);
    if (result.finished) user.addXP(plan.bonusXpOnComplete);
    if (result.finished)
      Alert.alert(
        "Plano concluído!",
        `Você recebeu ${plan.bonusXpOnComplete} XP de bônus.`,
      );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {reading && next && chapterUrl(next.bookId, next.chapter) && (
        <ScriptureReader
          url={chapterUrl(next.bookId, next.chapter)!}
          title={`${getBook(next.bookId)?.name} ${next.chapter}`}
          onClose={() => setReading(false)}
          onRead={(id, ch) => {
            if (id === next.bookId && ch === next.chapter) {
              finishChapter();
              setReading(false);
            }
          }}
        />
      )}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.planName}>Leitura</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        {!plan ? (
          <Text style={styles.error}>Plano não encontrado.</Text>
        ) : (
          <>
            <Text style={styles.chapterNumber}>{plan.name}</Text>
            <Text style={styles.bookProgressText}>
              {calculatePlanProgress(plan, progress?.completedChapters ?? [])}%
              concluído
            </Text>
            {next ? (
              <>
                <Text style={styles.planName}>
                  {getBook(next.bookId)?.name} · Capítulo {next.chapter}
                </Text>
                <Text style={styles.verseText}>
                  Leia no Vereda e receba 15 XP por capítulo novo. A conclusão
                  também avança este plano.
                </Text>
                <Button
                  secondary
                  title="Ler capítulo no Vereda"
                  onPress={() => setReading(true)}
                />
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.completeButton}
                  onPress={() =>
                    Alert.alert(
                      "Registrar leitura",
                      "Você terminou a leitura deste capítulo?",
                      [
                        { text: "Ainda não", style: "cancel" },
                        { text: "Sim, concluí", onPress: finishChapter },
                      ],
                    )
                  }
                >
                  <Text style={styles.completeButtonText}>
                    Registrar capítulo lido (+15 XP na primeira leitura)
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.modalTitle}>Plano concluído!</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1D29",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#142F3E",
    borderBottomWidth: 1,
    borderBottomColor: "#35505D",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: "#F2C66D",
    fontWeight: "600",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F5E8C8",
  },
  streakBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400E",
  },
  bookProgress: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#142F3E",
    borderBottomWidth: 1,
    borderBottomColor: "#35505D",
  },
  bookProgressBg: {
    height: 6,
    backgroundColor: "#35505D",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  bookProgressBar: {
    height: "100%",
    backgroundColor: "#F2C66D",
    borderRadius: 3,
  },
  bookProgressText: {
    fontSize: 13,
    color: "#AEC0C9",
    textAlign: "center",
  },
  reader: {
    flex: 1,
  },
  readerContent: {
    paddingBottom: 100,
  },
  chapterHeader: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#142F3E",
    borderBottomWidth: 1,
    borderBottomColor: "#35505D",
  },
  bookName: {
    fontSize: 14,
    color: "#AEC0C9",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  chapterNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F5E8C8",
  },
  verses: {
    padding: 16,
  },
  verse: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#142F3E",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  verseNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F2C66D",
    marginBottom: 4,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1E293B",
  },
  bottomAction: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#142F3E",
    borderTopWidth: 1,
    borderTopColor: "#35505D",
  },
  completeButton: {
    backgroundColor: "#F2C66D",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#142F3E",
    fontWeight: "bold",
    fontSize: 17,
  },
  completedButton: {
    backgroundColor: "#059669",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  completedButtonText: {
    color: "#142F3E",
    fontWeight: "bold",
    fontSize: 17,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#142F3E",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5E8C8",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#AEC0C9",
    textAlign: "center",
    marginBottom: 16,
  },
  bold: {
    fontWeight: "bold",
    color: "#F2C66D",
  },
  modalXP: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#F2C66D",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: "#142F3E",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "#EF4444",
    marginTop: 40,
  },
});
