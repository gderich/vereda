import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { usePlanStore } from '@/store/planStore';
import { getPlan, getNextChapter, calculatePlanProgress } from '@/data/plans';
import { getBook } from '@/data/books';
import { enableDailyReminder, disableDailyReminder } from '@/services/notifications';
import { localDateKey } from '@/utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore();
  const { activePlanId, userPlans, setActivePlan } = usePlanStore();
  const [busy, setBusy] = useState(false);
  const plan = getPlan(activePlanId ?? 'bom-completo');
  const completed = plan ? userPlans[plan.id]?.completedChapters ?? [] : [];
  const next = plan ? getNextChapter(plan, completed) : null;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const streak = user.lastReadDate === localDateKey(new Date()) || user.lastReadDate === localDateKey(yesterday) ? user.streakDays : 0;
  async function toggleReminder() {
    setBusy(true);
    try {
      if (user.notificationsEnabled) {
        await disableDailyReminder();
        useUserStore.setState({ notificationsEnabled: false });
      } else {
        const enabled = await enableDailyReminder();
        useUserStore.setState({ notificationsEnabled: enabled });
        if (!enabled) Alert.alert('Permissão necessária', 'Ative as notificações nas configurações do celular para receber o lembrete.');
      }
    } catch { Alert.alert('Não foi possível configurar', 'Tente novamente nas configurações de notificações do celular.'); }
    finally { setBusy(false); }
  }
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>VEREDA · LEITURA DIÁRIA</Text>
    <Text style={styles.title}>Um capítulo de cada vez.</Text>
    <Text style={styles.muted}>Seu progresso fica salvo neste celular.</Text>
    <View style={styles.stats}>
      <Text style={styles.stat}>{streak} dias seguidos</Text>
      <Text style={styles.stat}>{user.xp} XP · Nível {user.level}</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.eyebrow}>SEU PLANO</Text>
      <Text style={styles.heading}>{plan?.name ?? 'Escolha um plano'}</Text>
      {plan && <Text style={styles.muted}>{calculatePlanProgress(plan, completed)}% concluído</Text>}
      {next && <Text style={styles.chapter}>{getBook(next.bookId)?.name} {next.chapter}</Text>}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => {
        if (plan) { setActivePlan(plan.id); router.push({ pathname: '/reading/[planId]', params: { planId: plan.id } }); }
        else router.push('/plans');
      }}><Text style={styles.buttonText}>{next ? 'Continuar leitura' : 'Ver plano'}</Text></Pressable>
      <Pressable accessibilityRole="button" style={styles.link} onPress={() => router.push('/plans')}><Text style={styles.linkText}>Escolher outro plano</Text></Pressable>
    </View>
    <View style={styles.card}>
      <Text style={styles.heading}>Lembrete diário</Text>
      <Text style={styles.muted}>Às 19h, no horário local do aparelho.</Text>
      <Pressable accessibilityRole="button" disabled={busy} style={styles.link} onPress={toggleReminder}><Text style={styles.linkText}>{busy ? 'Configurando…' : user.notificationsEnabled ? 'Desativar lembrete' : 'Ativar lembrete'}</Text></Pressable>
    </View>
    <Text style={styles.notice}>Os textos completos das escrituras ainda não estão incluídos nesta versão. Você pode acompanhar aqui a leitura feita no seu exemplar.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' }, content: { padding: 24, gap: 20, paddingBottom: 40 },
  eyebrow: { color: '#64748B', fontSize: 12, letterSpacing: 1 }, title: { fontSize: 32, fontWeight: '700', color: '#1E3A5F' },
  muted: { color: '#475569', fontSize: 15, lineHeight: 23 }, stats: { gap: 8 }, stat: { color: '#1E3A5F', fontWeight: '600', fontSize: 17 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, gap: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  heading: { fontSize: 21, fontWeight: '600', color: '#0F172A' }, chapter: { fontSize: 18, color: '#1E3A5F' },
  button: { backgroundColor: '#1E3A5F', padding: 16, borderRadius: 12, alignItems: 'center' }, buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  link: { paddingVertical: 12 }, linkText: { color: '#1E3A5F', fontWeight: '600' }, notice: { color: '#64748B', lineHeight: 22 },
});
