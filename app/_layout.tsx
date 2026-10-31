import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useUserStore } from '@/store/userStore';
import { usePlanStore } from '@/store/planStore';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    SplashScreen.hideAsync().catch(console.warn);
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      if (mounted && useUserStore.persist.hasHydrated() && usePlanStore.persist.hasHydrated()) {
        clearTimeout(timer); setReady(true);
      }
    };
    const offUser = useUserStore.persist.onFinishHydration(check);
    const offPlan = usePlanStore.persist.onFinishHydration(check);
    timer = setTimeout(() => { if (mounted) setFailed(true); }, 10000);
    check();
    return () => { mounted = false; clearTimeout(timer); offUser(); offPlan(); };
  }, []);
  return <SafeAreaProvider>
    {ready ? <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reading/[planId]" />
      </Stack>
    </SafeAreaView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {failed ? <Text>Não foi possível carregar o progresso. Feche e abra o aplicativo novamente. Seus dados não foram apagados.</Text> : <ActivityIndicator />}
    </View>}
  </SafeAreaProvider>;
}
