import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, AppState } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useUserStore } from '@/store/userStore';
import { usePlanStore } from '@/store/planStore';
import { useAnnotationStore } from '@/store/annotationStore';
import { useReadingHabitStore } from '@/store/readingHabitStore';
import { loadPersonalScriptures, useScriptureStore } from '@/store/scriptureStore';

import { StatusBar } from 'expo-status-bar';
import { stopSounds } from '@/services/sounds';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => { if (state !== 'active') void stopSounds(); });
    return () => { subscription.remove(); void stopSounds(); };
  }, []);
  useEffect(() => {
    SplashScreen.hideAsync().catch(console.warn);
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;
    const stores = [useUserStore,usePlanStore,useAnnotationStore,useReadingHabitStore];
    const check = () => {
      if (mounted && stores.every(store=>store.persist.hasHydrated()) && useScriptureStore.getState().ready) {
        useUserStore.getState().migrateReadings(Object.values(usePlanStore.getState().userPlans).flatMap(plan => plan.completedChapters));
        clearTimeout(timer); setReady(true);
      }
    };
    const off = stores.map(store=>store.persist.onFinishHydration(check));
    void loadPersonalScriptures().then(check);
    timer = setTimeout(() => { if (mounted) setFailed(true); }, 10000);
    check();
    return () => { mounted = false; clearTimeout(timer); off.forEach(unsubscribe=>unsubscribe()); };
  }, []);
  return <SafeAreaProvider>
    <StatusBar style="light" />
    {ready ? <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1D29" }} edges={['top']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reading/[planId]" />
        <Stack.Screen name="lesson/[id]" />
        <Stack.Screen name="challenge" />
      </Stack>
    </SafeAreaView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {failed ? <Text>Não foi possível carregar o progresso. Feche e abra o aplicativo novamente. Seus dados não foram apagados.</Text> : <ActivityIndicator />}
    </View>}
  </SafeAreaProvider>;
}
