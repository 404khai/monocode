import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { sessionFixtures, sectionsForSessions } from '@/fixtures/sessions';
import type { SessionSummary } from '../model/sessionSummary';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { spacing, typography } from '@/shared/theme/theme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import { SessionToolbar, type SessionFilter } from './SessionToolbar';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { InboxSheet } from './InboxSheet';

function SessionRow({session:s}: {session:SessionSummary}) {
  const t=useAppTheme();
  const working=s.state==='working';
  const status=working ? 'Working' : s.state==='needs-input' ? 'Needs input' : s.updatedLabel;
  return <Pressable accessibilityLabel={s.title+', '+status}
    onPress={()=>Alert.alert(s.title,'Mock session · '+s.project+' / '+s.branch)}
    style={({pressed})=>[styles.row,{opacity:pressed ? 0.55 : 1}]}>
    <View style={styles.provider}><ProviderIcon provider={s.provider} color={t.text}/></View>
    <View style={{flex:1}}>
      <View style={styles.line}>
        <Text numberOfLines={1} style={[styles.rowTitle,{color:t.text}]}>{s.title}</Text>
        <View style={styles.state}>
          {working && <Text style={{color:t.accent,fontSize:16}}>⠇</Text>}
          <Text style={[styles.status,{color:working ? t.accent : s.state==='needs-input' ? '#B77A20' : t.secondaryText}]}>{status}</Text>
        </View>
      </View>
      <View style={[styles.line,{marginTop:7}]}>
        <ProjectMascot project={s.project} name={s.projectMascot} color={s.projectColor}/>
        <Text style={[styles.project,{color:t.secondaryText}]}>{s.project}</Text>
        <AppSymbol name="point.topleft.down.curvedto.point.bottomright.up" size={12} tintColor={t.tertiaryText}/>
        <Text numberOfLines={1} style={[styles.branch,{color:t.tertiaryText}]}>{s.branch}</Text>
        {!!s.linkedPullRequest && <View style={[styles.pr,{backgroundColor:t.accentSoft}]}>
          <AppSymbol name="arrow.triangle.pull" size={11} tintColor={t.accent}/>
          <Text style={{color:t.accent,fontSize:11}}>{s.linkedPullRequest}</Text>
        </View>}
      </View>
    </View>
  </Pressable>;
}
export function SessionsScreen({searchEnabled=false}:{searchEnabled?:boolean}) {
  const t=useAppTheme();
  const insets=useSafeAreaInsets();
  const params=useLocalSearchParams<{search?:string}>();
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState<SessionFilter>('all');
  const [inboxOpen,setInboxOpen]=useState(false);
  const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
  const sessions=sessionFixtures.filter(s=>(filter==='all' || s.state===filter) &&
    (s.title+' '+s.project+' '+s.branch).toLowerCase().includes(query.toLowerCase()));
  const groups=sectionsForSessions(sessions);
  return <View style={[styles.screen,{backgroundColor:t.canvas}]}>
    <View style={{position:'absolute',top:0,left:0,right:0}}><PacmanGame/></View>
    <ScrollView contentInsetAdjustmentBehavior="never" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      contentContainerStyle={{paddingTop:insets.top+spacing.sm,paddingHorizontal:spacing.page,paddingBottom:110}}>
      <View style={styles.toolbar}><SessionToolbar onInbox={()=>setInboxOpen(true)} onFilter={setFilter}/></View>
      <Text accessibilityRole="header" style={[styles.heading,{color:t.text}]}>Sessions</Text>
      {(searchEnabled || params.search==='1') && <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
        <TextInput autoFocus placeholder="Search sessions" placeholderTextColor={t.tertiaryText}
          value={query} onChangeText={setQuery} style={[styles.search,{flex:1,color:t.text,backgroundColor:t.elevated}]}/>
        <Pressable accessibilityLabel="Close search" onPress={()=>{setQuery('');router.setParams({search:'0'});if(searchEnabled)router.navigate('/');}}
          style={{width:44,height:44,alignItems:'center',justifyContent:'center',marginBottom:10}}>
          <AppSymbol name="xmark" size={15} tintColor={t.secondaryText}/>
        </Pressable>
      </View>}
      {filter!=='all' && <Pressable onPress={()=>setFilter('all')} style={{minHeight:44,justifyContent:'center'}}><Text style={{color:t.accent,marginBottom:12}}>{filter==='needs-input' ? 'Needs input' : filter==='done' ? 'Completed' : 'Working'} only · Show all</Text></Pressable>}
      {groups.map(g=><View key={g.id}>
        <Pressable accessibilityRole="button" accessibilityLabel={g.title+', '+g.sessions.length+' sessions'}
          onPress={()=>setCollapsed(v=>({...v,[g.id]:!v[g.id]}))} style={styles.section}>
          <Text style={[styles.sectionTitle,{color:t.secondaryText}]}>{g.title}</Text>
          <Text style={[styles.count,{color:t.tertiaryText}]}>{g.sessions.length}</Text>
          {g.sessions.some(s=>s.state==='working') && <Text style={{color:t.accent,fontSize:19}}>⠇</Text>}
          <View style={{flex:1}}/>
          <AppSymbol name={collapsed[g.id] ? 'chevron.right' : 'chevron.down'} size={13} tintColor={t.tertiaryText}/>
        </Pressable>
        {!collapsed[g.id] && g.sessions.map(s=><SessionRow key={s.id} session={s}/>)}
      </View>)}
      {!sessions.length && <Text style={{color:t.secondaryText,paddingVertical:24}}>No sessions match your search.</Text>}
    </ScrollView>
    <InboxSheet visible={inboxOpen} onClose={()=>setInboxOpen(false)}/>
  </View>;
}
const styles=StyleSheet.create({
  screen:{flex:1},toolbar:{alignItems:'flex-end',height:54},heading:{fontSize:typography.title,fontWeight:'700',letterSpacing:-0.8,marginTop:9,marginBottom:spacing.page},
  section:{flexDirection:'row',alignItems:'center',gap:8,height:44,marginTop:5},sectionTitle:{fontSize:16,fontWeight:'600'},count:{fontSize:16},
  row:{flexDirection:'row',minHeight:68,paddingVertical:11},provider:{width:34,paddingTop:1},line:{flexDirection:'row',alignItems:'center'},
  rowTitle:{flex:1,fontSize:typography.session,fontWeight:'500',letterSpacing:-0.3},state:{flexDirection:'row',alignItems:'center',gap:2,marginLeft:spacing.sm},
  status:{fontSize:12},
  project:{fontSize:12,marginLeft:6,marginRight:11},branch:{fontSize:12,flex:1,marginLeft:4},
  pr:{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:5,paddingVertical:3,borderRadius:4,marginLeft:5},
  search:{borderRadius:12,padding:12,fontSize:16,marginBottom:10}
});
