import { Pressable, ScrollView, Text, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { sessionFixtures } from '@/fixtures/sessions';
export function InboxSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const t=useAppTheme();
  return <NativeSheet visible={visible} onClose={onClose}>
    <ScrollView style={{flex:1,backgroundColor:t.canvas}} contentContainerStyle={{padding:20}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <Text accessibilityRole="header" style={{color:t.text,fontSize:28,fontWeight:'700'}}>Inbox</Text>
        <Pressable accessibilityLabel="Close inbox" onPress={onClose} style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}>
          <AppSymbol name="xmark" tintColor={t.text}/>
        </Pressable>
      </View>
      {sessionFixtures.filter(s=>s.state==='needs-input'||s.state==='done').map(s=><View key={s.id} style={{paddingVertical:18,borderBottomWidth:0.5,borderColor:t.line}}>
        <Text style={{color:t.secondaryText,fontSize:12,marginBottom:6}}>{s.state==='needs-input' ? 'Needs your input' : 'Completed'} · {s.project}</Text>
        <Text style={{color:t.text,fontSize:17,fontWeight:'500'}}>{s.title}</Text>
      </View>)}
      <Text style={{color:t.tertiaryText,fontSize:12,marginTop:24}}>Fixture notifications · No host connected</Text>
    </ScrollView>
  </NativeSheet>;
}
