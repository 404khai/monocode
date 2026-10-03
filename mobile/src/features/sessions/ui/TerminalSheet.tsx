import { ScrollView, Text, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { terminalFixture } from '@/fixtures/composer';
export function TerminalSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const t=useAppTheme();
  return <NativeSheet visible={visible} onClose={onClose} detents={['medium','large']}>
    <View style={{flex:1,backgroundColor:t.canvas,paddingTop:16}}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,marginBottom:12}}>
        <View><Text accessibilityRole="header" style={{color:t.text,fontSize:23,fontWeight:'600'}}>Terminal</Text>
          <Text style={{color:t.secondaryText,fontSize:12,marginTop:4}}>monocode · feat/mobile-app · Preview</Text></View>
        <GlassIconButton symbol="xmark" label="Close terminal" onPress={onClose}/>
      </View>
      <ScrollView style={{flex:1,backgroundColor:'#171717'}} contentContainerStyle={{padding:18}}>
        {terminalFixture.map((line,index)=><Text key={index} selectable
          style={{fontFamily:'Menlo',fontSize:12,lineHeight:21,color:line.startsWith('$') ? '#459BF7' : '#EBEBEB'}}>{line || ' '}</Text>)}
      </ScrollView>
    </View>
  </NativeSheet>;
}
