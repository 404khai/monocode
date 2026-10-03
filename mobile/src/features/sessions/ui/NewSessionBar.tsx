import { Pressable, Text, View } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { sessionFixtures } from '@/fixtures/sessions';
export function NewSessionBar({onPress}:{onPress:()=>void}) {
  const t=useAppTheme();
  const placement=NativeTabs.BottomAccessory.usePlacement();
  return <Pressable accessibilityRole="button" accessibilityLabel="New session" onPress={onPress}
    style={({pressed})=>({height:placement==='inline' ? 44 : 54,paddingHorizontal:12,flexDirection:'row',
      alignItems:'center',gap:10,opacity:pressed ? 0.6 : 1})}>
    <View style={{height:36,width:36,borderRadius:18,alignItems:'center',justifyContent:'center',backgroundColor:t.elevated}}>
      <AppSymbol name="plus" tintColor={t.text} size={21}/>
    </View>
    <Text style={{flex:1,color:t.text,fontSize:17,fontWeight:'600'}}>New session</Text>
    {placement!=='inline' && <>
      <Text style={{color:t.accent,fontSize:20}}>⠇</Text>
      <Text style={{color:t.secondaryText,fontSize:14}}>{sessionFixtures.filter(s=>s.state==='working').length} working</Text>
    </>}
  </Pressable>;
}
