import { useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { sessionFixtures } from '@/fixtures/sessions';
import { groupSessionsByWorkspace } from '../model/sessionHierarchy';
import type { SessionSummary } from '../model/sessionSummary';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { spacing, typography } from '@/shared/theme/theme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import type { SessionFilter } from './SessionToolbar';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { InboxSheet } from './InboxSheet';
import { WorkingPixels } from './WorkingPixels';
import { NewSessionSheet, type NewSessionContext } from './NewSessionSheet';

function SessionRow({session:s,compact=false,selected=false,onSelect}: {session:SessionSummary;compact?:boolean;selected?:boolean;onSelect:()=>void}) {
  const t=useAppTheme();
  const working=s.state==='working';
  const status=working ? 'Working' : s.state==='needs-input' ? 'Needs input' : s.updatedLabel;
  return <Pressable accessibilityLabel={s.title+', '+status}
    onPress={()=>{onSelect();Alert.alert(s.title,'Mock session · '+s.project+' / '+s.branch);}}
    style={({pressed})=>[styles.row,{opacity:pressed ? 0.55 : 1,paddingHorizontal:compact ? 12 : 2,
      minHeight:compact ? 78 : 100,marginHorizontal:compact ? 4 : 0,borderRadius:compact ? 9 : 0,
      backgroundColor:compact&&selected ? t.elevated : 'transparent'}]}>
      <View style={styles.line}>
        {s.pinned ? <AppSymbol name="pin" size={15} tintColor={t.secondaryText}/> : !compact && <ProviderIcon provider={s.provider} color={t.text} size={16}/>}
        <Text numberOfLines={compact ? 2 : 1} style={compact ? [styles.rowTitle,{flex:1,color:t.text,marginLeft:s.pinned ? 7 : 0}] : [styles.model,{color:t.secondaryText}]}>{compact ? s.title : s.model}</Text>
        <View style={styles.state}>
          {working && <WorkingPixels/>}
          <Text style={[styles.status,{color:working ? t.accent : s.state==='needs-input' ? '#B77A20' : t.secondaryText}]}>{status}</Text>
        </View>
      </View>
      {!compact && <Text numberOfLines={2} style={[styles.rowTitle,{color:t.text,marginTop:7}]}>{s.title}</Text>}
      <View style={[styles.line,{marginTop:7}]}>
        <AppSymbol name="point.topleft.down.curvedto.point.bottomright.up" size={12} tintColor={t.tertiaryText}/>
        <Text numberOfLines={1} style={[styles.branch,{color:t.tertiaryText}]}>{s.branch}</Text>
        {!!s.linkedPullRequest && <View style={[styles.pr,{backgroundColor:t.accentSoft}]}>
          <AppSymbol name="arrow.triangle.pull" size={11} tintColor={t.accent}/>
          <Text style={{color:t.accent,fontSize:11}}>{s.linkedPullRequest}</Text>
        </View>}
      </View>
  </Pressable>;
}
export function SessionsScreen({searchEnabled=false}:{searchEnabled?:boolean}) {
  const t=useAppTheme();
  const params=useLocalSearchParams<{search?:string}>();
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState<SessionFilter>('all');
  const [inboxOpen,setInboxOpen]=useState(false);
  const [newSessionContext,setNewSessionContext]=useState<NewSessionContext>();
  const [selectedSessionId,setSelectedSessionId]=useState(sessionFixtures[0].id);
  const [collapsed,setCollapsed]=useState<Record<string,boolean>>({});
  const scrollOffset=useRef(new Animated.Value(0)).current;
  const sessions=sessionFixtures.filter(s=>(filter==='all' || s.state===filter) &&
    (s.title+' '+s.project+' '+s.branch+' '+s.model+' '+s.workspace.name+' '+(s.threadGroup?.name ?? '')).toLowerCase().includes(query.toLowerCase()));
  const projects=groupSessionsByWorkspace(sessions);
  const narrowed=!!query.trim()||filter!=='all';
  const toggle=(id:string)=>setCollapsed(value=>({...value,[id]:!value[id]}));
  return <>
    <Stack.Screen options={{title:searchEnabled ? 'Search' : 'Sessions'}}/>
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Button icon="tray" accessibilityLabel="Inbox" separateBackground onPress={()=>setInboxOpen(true)}/>
      <Stack.Toolbar.Spacer width={12}/>
      <Stack.Toolbar.Menu icon="line.3.horizontal.decrease.circle" accessibilityLabel="Filter sessions" separateBackground>
        <Stack.Toolbar.MenuAction icon="rectangle.stack" isOn={filter==='all'} onPress={()=>setFilter('all')}>All sessions</Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="bolt" isOn={filter==='working'} onPress={()=>setFilter('working')}>Working</Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="hand.raised" isOn={filter==='needs-input'} onPress={()=>setFilter('needs-input')}>Needs input</Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="checkmark.circle" isOn={filter==='done'} onPress={()=>setFilter('done')}>Completed</Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
    <Animated.ScrollView style={[styles.screen,{backgroundColor:t.canvas}]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
      removeClippedSubviews={false} scrollEventThrottle={16}
      onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollOffset}}}],{useNativeDriver:true})}
      contentContainerStyle={{paddingTop:spacing.sm,paddingHorizontal:spacing.page,paddingBottom:110}}>
      {/* Cancel content scrolling natively: the arcade stays pinned to the viewport,
          while this ScrollView remains the first native child for title/edge tracking. */}
      <Animated.View pointerEvents="none" style={{position:'absolute',top:0,left:0,right:0,transform:[{translateY:scrollOffset}]}}>
        <PacmanGame opacity={0.28} fadeBottom/>
      </Animated.View>
      {(searchEnabled || params.search==='1') && <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
        <TextInput autoFocus placeholder="Search sessions" placeholderTextColor={t.tertiaryText}
          value={query} onChangeText={setQuery} style={[styles.search,{flex:1,color:t.text,backgroundColor:t.elevated}]}/>
        <Pressable accessibilityLabel="Close search" onPress={()=>{setQuery('');router.setParams({search:'0'});if(searchEnabled)router.navigate('/');}}
          style={{width:44,height:44,alignItems:'center',justifyContent:'center',marginBottom:10}}>
          <AppSymbol name="xmark" size={15} tintColor={t.secondaryText}/>
        </Pressable>
      </View>}
      {filter!=='all' && <Pressable onPress={()=>setFilter('all')} style={{minHeight:44,justifyContent:'center'}}><Text style={{color:t.accent,marginBottom:12}}>{filter==='needs-input' ? 'Needs input' : filter==='done' ? 'Completed' : 'Working'} only · Show all</Text></Pressable>}
      {projects.map(project=><View key={project.id} style={{marginBottom:24}}>
        <Pressable accessibilityRole="button" accessibilityState={{expanded:narrowed||!collapsed['project:'+project.id]}}
          accessibilityLabel={project.name+', '+project.count+' threads'} onPress={()=>toggle('project:'+project.id)} style={styles.section}>
          <ProjectMascot project={project.name} name={project.mascot} color={project.color}/>
          <Text style={[styles.projectTitle,{color:t.text}]}>{project.name}</Text>
          <Text style={[styles.count,{color:t.tertiaryText}]}>{project.count}</Text>
          <AppSymbol name={!narrowed&&collapsed['project:'+project.id] ? 'chevron.right' : 'chevron.down'} size={13} tintColor={t.secondaryText}/>
        </Pressable>
        {(narrowed||!collapsed['project:'+project.id]) && <>
          {project.workspaces.map(workspace=><View key={workspace.id}>
            {workspace.groups.map(group=><View key={group.id} style={[styles.group,{backgroundColor:t.surface}]}>
              <Pressable accessibilityRole="button" accessibilityState={{expanded:narrowed||!collapsed[group.id]}}
                accessibilityLabel={group.name+', '+group.sessions.length+' threads'} onPress={()=>toggle(group.id)} style={styles.groupHeader}>
                <AppSymbol name={!narrowed&&collapsed[group.id] ? 'folder' : 'chevron.down'} size={16} tintColor={t.text}/>
                <Text style={{flex:1,color:t.text,fontSize:16,fontWeight:'600'}}>{group.name}</Text>
                {group.sessions.some(s=>s.state==='working') && <WorkingPixels/>}
                <Text style={{color:t.tertiaryText,fontSize:13}}>{group.sessions.length}</Text>
              </Pressable>
              {(narrowed||!collapsed[group.id]) && <>
                {group.sessions.map(s=><SessionRow key={s.id} session={s} compact selected={selectedSessionId===s.id} onSelect={()=>setSelectedSessionId(s.id)}/>)}
                <Pressable accessibilityRole="button" accessibilityLabel={'New session in '+group.name}
                  onPress={()=>setNewSessionContext({project:project.name,branch:group.sessions[0].branch,
                    worktree:workspace.workspace.kind==='worktree',group:group.name})}
                  style={[styles.groupNew,{borderColor:t.line}]}>
                  <AppSymbol name="plus" size={14} tintColor={t.secondaryText}/>
                  <Text style={{color:t.secondaryText,fontSize:14,fontWeight:'500'}}>New session</Text>
                </Pressable>
              </>}
            </View>)}
          </View>)}
          {project.workspaces.some(workspace=>workspace.pinned.length>0) && <View style={[styles.group,{backgroundColor:t.surface}]}>
            <Pressable accessibilityRole="button" accessibilityState={{expanded:narrowed||!collapsed['pinned:'+project.id]}}
              accessibilityLabel={'Pinned, '+project.workspaces.reduce((count,workspace)=>count+workspace.pinned.length,0)+' chats'}
              onPress={()=>toggle('pinned:'+project.id)} style={styles.groupHeader}>
              <AppSymbol name="pin" size={17} tintColor={t.text}/>
              <Text style={{flex:1,color:t.text,fontSize:16,fontWeight:'600'}}>Pinned</Text>
              <Text style={{color:t.tertiaryText,fontSize:13}}>{project.workspaces.reduce((count,workspace)=>count+workspace.pinned.length,0)}</Text>
            </Pressable>
            {(narrowed||!collapsed['pinned:'+project.id]) && project.workspaces.flatMap(workspace=>workspace.pinned).map(s=>
              <SessionRow key={s.id} session={s} compact selected={selectedSessionId===s.id} onSelect={()=>setSelectedSessionId(s.id)}/>)}
          </View>}
          {project.workspaces.flatMap(workspace=>workspace.sessions).map(s=>
            <SessionRow key={s.id} session={s} selected={selectedSessionId===s.id} onSelect={()=>setSelectedSessionId(s.id)}/>)}
        </>}
      </View>)}
      {!sessions.length && <Text style={{color:t.secondaryText,paddingVertical:24}}>No sessions match your search.</Text>}
    </Animated.ScrollView>
    <InboxSheet visible={inboxOpen} onClose={()=>setInboxOpen(false)}/>
    <NewSessionSheet visible={!!newSessionContext} context={newSessionContext} onClose={()=>setNewSessionContext(undefined)}/>
  </>;
}
const styles=StyleSheet.create({
  screen:{flex:1},
  section:{flexDirection:'row',alignItems:'center',gap:8,minHeight:48,marginTop:5},projectTitle:{flex:1,fontSize:19,fontWeight:'600'},count:{fontSize:13},
  group:{borderRadius:12,overflow:'hidden',marginBottom:14},groupHeader:{flexDirection:'row',alignItems:'center',gap:10,minHeight:48,paddingHorizontal:12},
  groupNew:{flexDirection:'row',alignItems:'center',gap:8,minHeight:46,paddingHorizontal:14,borderTopWidth:StyleSheet.hairlineWidth},
  row:{minHeight:100,paddingVertical:14},line:{flexDirection:'row',alignItems:'center'},model:{flex:1,fontSize:12,marginLeft:7},
  rowTitle:{fontSize:typography.session,fontWeight:'600',letterSpacing:-0.3},state:{flexDirection:'row',alignItems:'center',gap:4,marginLeft:spacing.sm},
  status:{fontSize:12},
  branch:{fontSize:12,flex:1,marginLeft:5},
  pr:{flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:5,paddingVertical:3,borderRadius:4,marginLeft:5},
  search:{borderRadius:12,padding:12,fontSize:16,marginBottom:10}
});
