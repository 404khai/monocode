import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { automationFixtures } from '@/fixtures/productivity';
export function AutomationsScreen() {
  const t=useAppTheme();
  const preview=()=>Alert.alert('Automation preview','Automations are configured and run on your MonoCode host. Connect a host to create or enable one.');
  return <>
    <Stack.Toolbar placement="right"><Stack.Toolbar.Button icon="plus" accessibilityLabel="New automation" onPress={preview}/></Stack.Toolbar>
    <ScrollView style={{flex:1,backgroundColor:t.canvas}} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
      <Text style={{color:t.secondaryText,fontSize:14,lineHeight:21,paddingVertical:16}}>Let your desktop agents handle recurring work.</Text>
      {automationFixtures.map(item=><Pressable key={item.id} accessibilityRole="button" onPress={preview} style={{paddingVertical:20,borderBottomWidth:0.5,borderColor:t.line}}>
        <View style={{flexDirection:'row',gap:8,alignItems:'center'}}><ProjectMascot project={item.project}/><Text style={{flex:1,color:t.secondaryText,fontSize:12}}>{item.project}</Text><Text style={{color:t.tertiaryText,fontSize:11}}>Not connected</Text></View>
        <Text style={{color:t.text,fontSize:18,fontWeight:'600',marginTop:9}}>{item.name}</Text>
        <Text style={{color:t.secondaryText,fontSize:14,lineHeight:21,marginTop:7}}>{item.description}</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:6,marginTop:12}}><AppSymbol name="clock" size={13} tintColor={t.tertiaryText}/><Text style={{color:t.tertiaryText,fontSize:12}}>{item.schedule}</Text></View>
      </Pressable>)}
      <Text style={{color:t.tertiaryText,fontSize:11,lineHeight:17,marginTop:24}}>Sample schedules only · Nothing runs on your phone</Text>
    </ScrollView>
  </>;
}
