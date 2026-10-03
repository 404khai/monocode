import { useState } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { NewSessionBar } from '@/features/sessions/ui/NewSessionBar';
import { NewSessionSheet } from '@/features/sessions/ui/NewSessionSheet';
export function AppNavigation() {
  const t=useAppTheme();
  const pathname=usePathname();
  // Accessory has regular/inline copies: keep the draft and presentation state outside both.
  const [newSessionOpen,setNewSessionOpen]=useState(false);
  return <><StatusBar style="auto"/><NativeTabs tintColor={t.text} hidden={pathname.includes('/thread/')}>
    <NativeTabs.Trigger name="(sessions)">
      <NativeTabs.Trigger.Label>Sessions</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf={{default:'bubble.left.and.bubble.right',selected:'bubble.left.and.bubble.right.fill'}}/>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="notes">
      <NativeTabs.Trigger.Label>Notes</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="note.text"/>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="automations">
      <NativeTabs.Trigger.Label>Automations</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf={{default:'bolt',selected:'bolt.fill'}}/>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings">
      <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf={{default:'gearshape',selected:'gearshape.fill'}}/>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="search" role="search">
      <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      <NativeTabs.Trigger.Icon sf="magnifyingglass"/>
    </NativeTabs.Trigger>
    {(pathname==='/'||pathname==='/search') && <NativeTabs.BottomAccessory>
      <NewSessionBar onPress={()=>setNewSessionOpen(true)}/>
    </NativeTabs.BottomAccessory>}
  </NativeTabs>
  <NewSessionSheet visible={newSessionOpen} onClose={()=>setNewSessionOpen(false)}/>
  </>;
}
