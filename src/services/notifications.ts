import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
const channelId = 'daily-reminder';
const identifier = 'vereda-daily-reminder';
Notifications.setNotificationHandler({ handleNotification: async () => ({
  shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
}) });
export async function enableDailyReminder(hour = 19, minute = 0): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Leitura diária', importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const existing = await Notifications.getPermissionsAsync();
  const permission = existing.granted ? existing : await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;
  await Notifications.cancelScheduledNotificationAsync(identifier);
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title: 'Hora das escrituras', body: 'Reserve um momento para sua leitura de hoje.' },
    trigger: { hour, minute, repeats: true, channelId },
  });
  return true;
}
export async function disableDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
