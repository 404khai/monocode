import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { usageFixture } from '@/fixtures/composer';
import type { SessionProvider } from '../model/sessionSummary';
export function UsageStrip({provider,onUsage,onTerminal}:{provider:SessionProvider;onUsage:()=>void;onTerminal:()=>void}) {
  const t=useAppTheme();
  const codex=provider==='codex';
  return <View style={[styles.strip,{borderColor:t.line}]}>
    <View style={styles.usageGroup}>
    <Pressable accessibilityLabel={codex ? 'Codex usage details: 5 percent five-hour usage, 11 percent weekly usage. Preview.' : 'Usage unavailable in preview'}
      onPress={codex ? onUsage : ()=>Alert.alert('Usage unavailable','Only Codex sample usage is populated in this preview.')}
      style={styles.summary}>
      <ProviderIcon provider={provider} color={t.text} size={18}/>
      {codex ? <>
        <View style={[styles.meter,{backgroundColor:t.line}]}><View style={{width:'5%',minWidth:2,height:4,backgroundColor:t.secondaryText}}/></View>
        <Text numberOfLines={1} style={[styles.text,{color:t.secondaryText}]}>
          {usageFixture.windows.map(w=>w.used+'% '+w.compactReset).join(' · ')}
        </Text>
      </> : <Text style={[styles.text,{color:t.secondaryText}]}>Usage unavailable</Text>}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Refresh usage preview" style={styles.refresh}
      onPress={()=>Alert.alert('Usage preview','Connect a host to refresh live provider usage.')}>
      <AppSymbol name="arrow.clockwise" size={13} tintColor={t.secondaryText}/>
    </Pressable>
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel="Open terminal preview" onPress={onTerminal} style={styles.terminal}>
      <AppSymbol name="terminal" size={16} tintColor={t.accent}/><Text style={{color:t.accent,fontSize:13}}>Terminal</Text>
    </Pressable>
  </View>;
}
const styles=StyleSheet.create({
  strip:{borderTopWidth:StyleSheet.hairlineWidth,flexDirection:'row',alignItems:'center',gap:5,minHeight:52,paddingHorizontal:10},
  usageGroup:{flex:1,flexDirection:'row',alignItems:'center'},
  summary:{flexShrink:1,flexDirection:'row',gap:6,alignItems:'center',minHeight:44},meter:{width:30,height:4,borderRadius:2,overflow:'hidden'},
  text:{fontSize:10,flexShrink:1},terminal:{flexDirection:'row',alignItems:'center',gap:5,minHeight:44,paddingHorizontal:4},
  refresh:{width:32,minHeight:44,alignItems:'center',justifyContent:'center'}
});
