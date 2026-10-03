import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { HARNESSES } from '@/features/arcade/model/harnesses';
import { SETTINGS_GROUPS, SETTINGS_SECTIONS, SETTINGS_INDEX, KEYBINDINGS, type SettingsSectionId } from '../model/settingsCatalog';

const icons = {
  general:'slider.horizontal.3',connections:'network',appearance:'paintpalette',keybindings:'keyboard',
  chat:'bubble.left.and.bubble.right',providers:'cpu',mcp:'globe',skills:'sparkles',inbox:'tray',
  archive:'archivebox',worktrees:'point.topleft.down.curvedto.point.bottomright.up',
} as const;
export function SettingsScreen() {
  const t=useAppTheme(),insets=useSafeAreaInsets();
  const [selected,setSelected]=useState<SettingsSectionId|null>(null);
  const [query,setQuery]=useState('');
  const section=SETTINGS_SECTIONS.find(s=>s.id===selected);
  const matches=(text:string)=>text.toLowerCase().includes(query.toLowerCase());
  const rows=SETTINGS_INDEX.filter(row=>row.section===selected && matches(row.label+' '+row.keywords));
  return <ScrollView style={{backgroundColor:t.canvas}} keyboardDismissMode="on-drag"
    contentInsetAdjustmentBehavior="never" contentContainerStyle={[styles.content,{paddingTop:insets.top+18}]}>
    {selected && <Pressable accessibilityLabel="Back to settings" onPress={()=>{setSelected(null);setQuery('');}} style={styles.back}>
      <AppSymbol name="chevron.left" tintColor={t.text} size={17}/>
      <Text style={{color:t.text,fontSize:16}}>Settings</Text>
    </Pressable>}
    <Text accessibilityRole="header" style={[styles.title,{color:t.text}]}>{section?.label ?? 'Settings'}</Text>
    {section && <Text style={[styles.description,{color:t.secondaryText}]}>{section.description}</Text>}
    <TextInput accessibilityLabel="Search settings" placeholder={section ? 'Search '+section.label.toLowerCase() : 'Search settings'}
      placeholderTextColor={t.tertiaryText} value={query} onChangeText={setQuery} style={[styles.search,{color:t.text,backgroundColor:t.elevated}]}/>
    {!section ? SETTINGS_GROUPS.map(group=>{
      const items=SETTINGS_SECTIONS.filter(s=>s.group===group.id && (matches(s.label+' '+s.keywords) ||
        SETTINGS_INDEX.some(row=>row.section===s.id && matches(row.label+' '+row.keywords))));
      if(!items.length)return null;
      return <View key={group.id}>
        <Text style={[styles.groupTitle,{color:t.secondaryText}]}>{group.label}</Text>
        <View style={[styles.group,{backgroundColor:t.surface,borderColor:t.line}]}>
          {items.map((item,index)=><Pressable key={item.id} accessibilityRole="button"
            onPress={()=>{setSelected(item.id);setQuery('');}}
            style={({pressed})=>[styles.row,{opacity:pressed ? 0.6 : 1},index<items.length-1&&{borderBottomWidth:StyleSheet.hairlineWidth,borderColor:t.line}]}>
            <AppSymbol name={icons[item.id]} size={19} tintColor={t.secondaryText}/>
            <Text style={[styles.rowTitle,{color:t.text}]}>{item.label}</Text>
            <AppSymbol name="chevron.right" size={12} tintColor={t.tertiaryText}/>
          </Pressable>)}
        </View>
      </View>;
    }) : <>
      {selected==='keybindings' ? <View style={[styles.group,{backgroundColor:t.surface,borderColor:t.line}]}>
        {KEYBINDINGS.filter(row=>matches(row.command+' '+row.keys)).map(row=><View key={row.command}
          style={[styles.detailRow,{borderColor:t.line}]}>
          <View style={{flex:1}}><Text style={{color:t.text,fontSize:14}}>{row.command}</Text>
            <Text style={[styles.caption,{color:t.secondaryText}]}>{row.when}</Text></View>
          <Text style={{color:t.secondaryText,fontSize:12,fontFamily:'Menlo'}}>{row.keys}</Text>
        </View>)}
      </View> : rows.length>0 && <View style={[styles.group,{backgroundColor:t.surface,borderColor:t.line}]}>
        {rows.map(row=><View key={row.id} style={[styles.detailRow,{borderColor:t.line}]}>
          <Text style={[styles.rowTitle,{color:t.text}]}>{row.label}</Text>
          <Text style={{color:t.tertiaryText,fontSize:12}}>{row.id==='update' ? 'Mobile 0.1.0' : 'Host managed'}</Text>
        </View>)}
      </View>}
      {selected==='providers' && <View style={[styles.group,{backgroundColor:t.surface,borderColor:t.line,marginTop:20}]}>
        {HARNESSES.filter(provider=>matches(provider)).map(provider=><View key={provider} style={[styles.detailRow,{borderColor:t.line}]}>
          <ProviderIcon provider={provider} color={t.text}/><Text style={[styles.rowTitle,{color:t.text}]}>{provider==='claude' ? 'Claude Code' : provider==='codex' ? 'Codex' : provider}</Text>
          <Text style={{fontSize:12,color:t.tertiaryText}}>Not connected</Text>
        </View>)}
      </View>}
      {selected==='skills' && <View style={[styles.group,{backgroundColor:t.surface,borderColor:t.line}]}>
        {['Project skills','Personal skills','Harness skills'].filter(matches).map(label=><View key={label} style={[styles.detailRow,{borderColor:t.line}]}>
          <Text style={[styles.rowTitle,{color:t.text}]}>{label}</Text><Text style={{color:t.tertiaryText,fontSize:12}}>No host</Text>
        </View>)}
      </View>}
      {selected==='archive' && <Text style={[styles.description,{color:t.secondaryText}]}>No archived projects or conversations in this preview.</Text>}
      {query && !rows.length && selected!=='keybindings' && selected!=='skills' && selected!=='providers' &&
        <Text style={[styles.description,{color:t.secondaryText}]}>No settings match your search.</Text>}
    </>}
    <Text style={[styles.note,{color:t.tertiaryText}]}>Desktop settings catalog · Preview only. Host-managed settings and desktop shortcuts are shown for reference, not applied on this phone.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({
  content:{flexGrow:1,paddingHorizontal:20,paddingBottom:40},title:{fontSize:34,fontWeight:'700',letterSpacing:-0.8},
  description:{fontSize:14,lineHeight:21,marginTop:12},search:{marginTop:22,borderRadius:13,padding:12,fontSize:16,marginBottom:8},
  back:{flexDirection:'row',gap:8,alignItems:'center',minHeight:44,marginBottom:12},
  groupTitle:{fontSize:13,fontWeight:'600',marginTop:24,marginBottom:9,marginLeft:12},
  group:{borderRadius:17,borderWidth:StyleSheet.hairlineWidth,overflow:'hidden',marginTop:8},
  row:{minHeight:54,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16},
  rowTitle:{flex:1,fontSize:15},detailRow:{minHeight:60,padding:14,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:StyleSheet.hairlineWidth},
  caption:{fontSize:11,marginTop:5},note:{fontSize:12,lineHeight:18,marginTop:28,marginHorizontal:8}
});
