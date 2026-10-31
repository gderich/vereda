import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { READING_PLANS, getPlansByCategory, getPlanStats } from '@/data/plans';
import { usePlanStore } from '@/store/planStore';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: 'destaque', name: '⭐ Destaque', icon: '⭐' },
  { id: 'anual', name: '📅 Anuais', icon: '📅' },
  { id: 'cronologico', name: '📜 Cronológicos', icon: '📜' },
  { id: 'tematico', name: '🙏 Temáticos', icon: '🙏' },
  { id: 'livro', name: '📖 Por Livro', icon: '📖' },
];

export default function PlansScreen() {
  const { activePlanId, setActivePlan } = usePlanStore();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Categorias */}
      {CATEGORIES.map(category => {
        let plans = getPlansByCategory(category.id as any);
        if (category.id === 'destaque') {
          plans = READING_PLANS.filter(p => p.id === 'brasil-365' || p.id === 'bom-completo' || p.id === 'novo-testamento');
        }

        if (plans.length === 0) {
          return null;
        }

        return (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.icon} {category.name}</Text>

            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isActive={activePlanId === plan.id}
                onPress={() => { setActivePlan(plan.id); router.push({ pathname: "/reading/[planId]", params: { planId: plan.id } }); }}
              />
            ))}
          </View>
        );
      })}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

interface PlanCardProps {
  plan: typeof READING_PLANS[0];
  isActive: boolean;
  onPress: () => void;
}

function PlanCard({ plan, isActive, onPress }: PlanCardProps) {
  const { totalChapters, totalXP } = getPlanStats(plan);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={[
        styles.planCard,
        isActive && styles.planCardActive,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {isActive && <View style={styles.activeIndicator} />}

      <View style={styles.planCardHeader}>
        <View style={styles.planIcon}>
          <Text style={styles.planEmoji}>{plan.icon}</Text>
        </View>

        <View style={styles.planInfo}>
          <Text style={[styles.planName, isActive && styles.planNameActive]}>
            {plan.name}
          </Text>

          <View style={styles.planMeta}>
            <Text style={styles.planMetaItem}>
              📅 {totalChapters} capítulos
            </Text>
            <Text style={styles.planMetaItem}>
              ⚡ {totalXP.toLocaleString()} XP total
            </Text>
            <Text style={styles.planMetaItem}>
              {plan.difficulty === 'iniciante' && '🟢 Iniciante'}
              {plan.difficulty === 'intermediario' && '🟡 Intermediário'}
              {plan.difficulty === 'avancado' && '🔴 Avançado'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  planCardActive: {
    borderColor: '#1E3A5F',
    borderWidth: 2,
  },
  planCardLocked: {
    opacity: 0.7,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#1E3A5F',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planEmoji: {
    fontSize: 24,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  planNameActive: {
    color: '#1E3A5F',
  },
  planMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  planMetaItem: {
    fontSize: 12,
    color: '#64748B',
  },
  lockedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  lockedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 12,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
});