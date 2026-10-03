import { Pressable, View } from 'react-native';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
export type SessionFilter = 'all' | 'working' | 'needs-input' | 'done';
export function SessionToolbar({onInbox,onFilter}:{onInbox:()=>void;onFilter:(filter:SessionFilter)=>void}) {
  const t=useAppTheme();
  return <View style={{flexDirection:'row',gap:12}}>
    <Pressable accessibilityLabel="Inbox" onPress={onInbox} style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
      <AppSymbol name="tray" tintColor={t.text}/>
    </Pressable>
    <Pressable accessibilityLabel="Filter sessions" onPress={()=>onFilter('working')} style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
      <AppSymbol name="line.3.horizontal.decrease.circle" tintColor={t.text}/>
    </Pressable>
  </View>;
}
