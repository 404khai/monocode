import { View } from 'react-native';
import { usePathname, type Href } from 'expo-router';
import { Tabs, TabList, TabTrigger, TabSlot, useTabTrigger } from 'expo-router/ui';
import { StatusBar } from 'expo-status-bar';
import { Host, NavigationBar, NavigationBarItem, RNHostView, Text } from '@expo/ui/jetpack-compose';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';

const tabs = [
  { name: 'sessions', href: '/', label: 'Sessions', symbol: 'bubble.left.and.bubble.right' },
  { name: 'notes', href: '/notes', label: 'Notes', symbol: 'note.text' },
  { name: 'automations', href: '/automations', label: 'Automations', symbol: 'bolt' },
  { name: 'settings', href: '/settings', label: 'Settings', symbol: 'gearshape' },
  { name: 'search', href: '/search', label: 'Search', symbol: 'magnifyingglass' },
] as const;

function ComposeTab({ tab }: { tab: typeof tabs[number] }) {
  const t = useAppTheme();
  const { triggerProps, switchTab } = useTabTrigger({ name: tab.name });
  const selected = triggerProps.isFocused;
  return <NavigationBarItem selected={selected} onClick={() => switchTab(tab.name, {})}
    colors={{ selectedIconColor: t.accent, selectedTextColor: t.text, selectedIndicatorColor: t.accentSoft,
      unselectedIconColor: t.secondaryText, unselectedTextColor: t.secondaryText }}>
    <NavigationBarItem.Icon><RNHostView matchContents>
      <AppSymbol name={tab.symbol} size={24} tintColor={selected ? t.accent : t.secondaryText}/>
    </RNHostView></NavigationBarItem.Icon>
    <NavigationBarItem.Label><Text style={{ fontSize: 11 }}>{tab.label}</Text></NavigationBarItem.Label>
  </NavigationBarItem>;
}
function ComposeTabBar() {
  const t = useAppTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  if (pathname.includes('/thread/')) return null;
  return <View style={{ backgroundColor: t.surface, paddingBottom: insets.bottom }}>
    <Host matchContents={{ vertical: true }} seedColor={t.accent}>
      <NavigationBar containerColor={t.surface} tonalElevation={0}>
        {tabs.map(tab => <ComposeTab key={tab.name} tab={tab}/>)}
      </NavigationBar>
    </Host>
  </View>;
}
export function AppNavigation() {
  const t = useAppTheme();
  return <><StatusBar style="auto"/><Tabs style={{ flex: 1, backgroundColor: t.canvas }} options={{ backBehavior: 'history' }}>
    <TabSlot style={{ flex: 1 }}/>
    <TabList style={{ display: 'none' }}>
      {tabs.map(tab => <TabTrigger key={tab.name} name={tab.name} href={tab.href as Href}/>)}
    </TabList>
    <ComposeTabBar/>
  </Tabs></>;
}
