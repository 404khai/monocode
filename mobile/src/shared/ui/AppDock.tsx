import { Pressable, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from './AppSymbol';
export function AppDock({active,onSelect,onSearch}:{active:string;onSelect:(name:'index'|'settings')=>void;onSearch:()=>void}) {
  const t=useAppTheme();
  const insets=useSafeAreaInsets();
  return <View style={{backgroundColor:t.canvas,paddingBottom:Math.max(insets.bottom,12),paddingTop:4,paddingHorizontal:20,flexDirection:'row',gap:10}}>
    <View style={{flex:1,flexDirection:'row',backgroundColor:t.surface,borderRadius:36,padding:4,borderWidth:1,borderColor:t.line}}>
      {(['index','settings'] as const).map(name=><Pressable key={name} accessibilityRole="tab" accessibilityState={{selected:active===name}}
        onPress={()=>onSelect(name)}
        style={{flex:1,alignItems:'center',justifyContent:'center',gap:3,height:56,borderRadius:29,backgroundColor:active===name ? t.elevated : 'transparent'}}>
        <AppSymbol name={name==='index' ? 'bubble.left.and.bubble.right' : 'gearshape'} size={24} tintColor={t.text}/>
        <Text style={{color:t.text,fontSize:11,fontWeight:'600'}}>{name==='index' ? 'Sessions' : 'Settings'}</Text>
      </Pressable>)}
    </View>
    <Pressable accessibilityLabel="Search sessions" onPress={onSearch}
      style={{width:64,height:64,borderRadius:32,alignItems:'center',justifyContent:'center',backgroundColor:t.surface,borderWidth:1,borderColor:t.line}}>
      <AppSymbol name="magnifyingglass" size={27} tintColor={t.text}/>
    </Pressable>
  </View>;
}
