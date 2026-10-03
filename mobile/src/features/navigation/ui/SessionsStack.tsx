import { Stack } from 'expo-router';
import { useAppTheme } from '@/shared/theme/useAppTheme';
export function SessionsStack({title='Sessions'}:{title?:string}) {
  const t=useAppTheme();
  return <Stack screenOptions={{
    title,headerLargeTitleEnabled:true,headerTransparent:true,scrollEdgeEffects:{top:'soft'},
    headerShadowVisible:false,headerLargeTitleShadowVisible:false,headerTintColor:t.text,
    headerTitleStyle:{color:t.text},headerLargeTitleStyle:{color:t.text},
    contentStyle:{backgroundColor:t.canvas},
  }}/>;
}
