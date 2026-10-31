import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { usePlanStore } from '@/store/planStore';
import { getPlan, getNextChapter, calculatePlanProgress } from '@/data/plans';
import { getBook } from '@/data/books';
import { chapterUrl } from '@/data/scriptureLinks';
import { Button } from '@/components/ui';

export default function ReadingPlanScreen() {
  const params = useLocalSearchParams<{ planId: string }>();
  const planId = Array.isArray(params.planId) ? params.planId[0] : params.planId;
  const router = useRouter();
  const { userPlans, completeChapter } = usePlanStore();
  const plan = getPlan(planId ?? '');
  const progress = userPlans[planId ?? ''];
  const next = plan ? getNextChapter(plan, progress?.completedChapters ?? []) : null;
  function finishChapter() {
    if (!plan || !next) return;
    const result = completeChapter(plan.id, next.bookId, next.chapter);
    if (!result.awarded) return;
    const user = useUserStore.getState();
    user.markChapterRead(next.bookId, next.chapter);
    user.addXP(plan.xpPerChapter + (result.finished ? plan.bonusXpOnComplete : 0));
    if (result.finished) Alert.alert('Plano concluído!', `Você recebeu ${plan.bonusXpOnComplete} XP de bônus.`);
  }
  return <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
    <View style={styles.header}>
      <TouchableOpacity accessibilityRole="button" style={styles.backButton} onPress={() => router.replace('/')}><Text style={styles.backText}>← Início</Text></TouchableOpacity>
      <Text style={styles.planName}>Leitura</Text>
    </View>
    <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
      {!plan ? <Text style={styles.error}>Plano não encontrado.</Text> : <>
        <Text style={styles.chapterNumber}>{plan.name}</Text>
        <Text style={styles.bookProgressText}>{calculatePlanProgress(plan, progress?.completedChapters ?? [])}% concluído</Text>
        {next ? <>
          <Text style={styles.planName}>{getBook(next.bookId)?.name} · Capítulo {next.chapter}</Text>
          <Text style={styles.verseText}>Leia o capítulo na fonte oficial ou no seu exemplar. Depois, volte aqui para registrar seu progresso.</Text>
          <Button secondary title="Abrir capítulo nas escrituras ↗" onPress={() => { const url=chapterUrl(next.bookId,next.chapter); if(url) Linking.openURL(url).catch(()=>Alert.alert('Não foi possível abrir','Verifique sua conexão e tente novamente.')); else Alert.alert('Referência indisponível','Abra a coleção pela aba Escrituras.'); }} />
          <TouchableOpacity accessibilityRole="button" style={styles.completeButton} onPress={() => Alert.alert(
            'Registrar leitura', 'Você terminou a leitura deste capítulo?',
            [{ text: 'Ainda não', style: 'cancel' }, { text: 'Sim, concluí', onPress: finishChapter }],
          )}><Text style={styles.completeButtonText}>Registrar capítulo lido (+{plan.xpPerChapter} XP)</Text></TouchableOpacity>
        </> : <Text style={styles.modalTitle}>Plano concluído!</Text>}
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDDD4',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#216653',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#203D46',
  },
  streakBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  bookProgress: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDDD4',
  },
  bookProgressBg: {
    height: 6,
    backgroundColor: '#DCDDD4',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bookProgressBar: {
    height: '100%',
    backgroundColor: '#216653',
    borderRadius: 3,
  },
  bookProgressText: {
    fontSize: 13,
    color: '#57676B',
    textAlign: 'center',
  },
  reader: {
    flex: 1,
  },
  readerContent: {
    paddingBottom: 100,
  },
  chapterHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDDD4',
  },
  bookName: {
    fontSize: 14,
    color: '#57676B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  chapterNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#203D46',
  },
  verses: {
    padding: 16,
  },
  verse: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  verseNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#216653',
    marginBottom: 4,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1E293B',
  },
  bottomAction: {
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DCDDD4',
  },
  completeButton: {
    backgroundColor: '#216653',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  completedButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#203D46',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: '#216653',
  },
  modalXP: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#216653',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    color: '#EF4444',
    marginTop: 40,
  },
});