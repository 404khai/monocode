import { Stack } from 'expo-router';
import { useAppTheme } from '@/shared/theme/useAppTheme';
export function SessionsStack({ title = 'Sessions' }: { title?: string }) {
  const t = useAppTheme();
  return <Stack screenOptions={{ title, headerShown: true, headerTransparent: false,
    headerStyle: { backgroundColor: t.canvas }, headerShadowVisible: false,
    headerTintColor: t.text, contentStyle: { backgroundColor: t.canvas } }}/>
}
