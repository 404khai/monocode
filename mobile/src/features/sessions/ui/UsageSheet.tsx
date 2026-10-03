import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { usageFixture as usage } from '@/fixtures/composer';

export function UsageSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const t=useAppTheme();
  return <NativeSheet visible={visible} onClose={onClose} detents={['medium','large']}>
    <ScrollView style={{flex:1,backgroundColor:t.canvas}} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <ProviderIcon provider="codex" color={t.text} size={40}/>
        <View style={{flex:1}}>
          <Text accessibilityRole="header" style={[styles.title,{color:t.text}]}>Codex usage</Text>
          <Text style={[styles.secondary,{color:t.secondaryText}]}>Updated {usage.updated}</Text>
        </View>
        <GlassIconButton symbol="xmark" label="Close usage" onPress={onClose}/>
      </View>
      <Pressable accessibilityLabel="Preview provider account" onPress={()=>Alert.alert('Preview account','No provider account is connected.')}
        style={{minHeight:44,justifyContent:'center',marginVertical:8}}>
        <Text numberOfLines={1} style={[styles.secondary,{color:t.secondaryText}]}>{usage.account}  ›</Text>
      </Pressable>
      {usage.windows.map(window=><View key={window.id} style={[styles.card,{backgroundColor:t.elevated,borderColor:t.line}]}>
        <View style={styles.line}>
          <Text style={[styles.label,{color:t.secondaryText}]}>{window.title}</Text>
          <Text style={[styles.label,{color:t.text}]}>{window.used}% used</Text>
        </View>
        <View accessibilityRole="progressbar" accessibilityLabel={window.title+' usage'}
          accessibilityValue={{min:0,max:100,now:window.used}} style={[styles.track,{backgroundColor:t.line}]}>
          <View style={{height:7,width:window.used+'%' as `${number}%`,backgroundColor:t.secondaryText,borderRadius:4}}/>
        </View>
        <View style={styles.line}>
          <Text style={[styles.secondary,{color:t.tertiaryText}]}>{100-window.used}% remaining</Text>
          <Text style={[styles.secondary,{color:t.tertiaryText}]}>Resets in {window.reset}</Text>
        </View>
      </View>)}
      <View style={{height:1,backgroundColor:t.line,marginVertical:14}}/>
      <View style={[styles.card,styles.line,{backgroundColor:t.elevated,borderColor:t.line,minHeight:90}]}>
        <View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
            <Text style={[styles.label,{color:t.text}]}>Banked resets</Text>
            <Text style={{color:t.secondaryText,backgroundColor:t.line,borderRadius:10,paddingHorizontal:6,paddingVertical:2,fontSize:12}}>{usage.bankedResets}</Text>
          </View>
          <Text style={[styles.secondary,{color:t.secondaryText,marginTop:7}]}>{usage.bankedResets} resets available</Text>
        </View>
        <ProjectMascot project="monocode" name="dino" color="#F4C025" size={64}/>
      </View>
      <View style={[styles.card,{backgroundColor:t.elevated,borderColor:t.line}]}>
        <Text style={[styles.label,{color:t.text}]}>{usage.resetTitle}</Text>
        <Text style={[styles.secondary,{color:t.secondaryText,marginTop:10,lineHeight:21}]}>Thanks for using Codex! You've been granted one free rate limit reset.</Text>
        <View style={[styles.line,{marginTop:14}]}>
          <Text style={[styles.secondary,{color:t.tertiaryText}]}>Expires in {usage.resetExpires}</Text>
          <Pressable accessibilityLabel="Use reset (preview only)" onPress={()=>Alert.alert('Preview only','A real usage reset requires a connected host and provider account. No reset has been used.')}
            style={{minHeight:44,paddingHorizontal:12,justifyContent:'center',borderRadius:10,borderWidth:1,borderColor:t.line}}>
            <Text style={[styles.label,{color:t.secondaryText}]}>Use reset</Text>
          </Pressable>
        </View>
      </View>
      <Text style={[styles.secondary,{color:t.tertiaryText,textAlign:'center',marginTop:12}]}>Sample usage · No account connected</Text>
    </ScrollView>
  </NativeSheet>;
}
const styles=StyleSheet.create({
  content:{padding:20,paddingTop:18,paddingBottom:30},header:{flexDirection:'row',alignItems:'center',gap:12},
  title:{fontSize:23,fontWeight:'600'},secondary:{fontSize:12},label:{fontSize:14,fontWeight:'600'},
  card:{borderRadius:14,borderWidth:1,padding:15,marginBottom:10},line:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8},
  track:{height:7,borderRadius:4,overflow:'hidden',marginVertical:13}
});
