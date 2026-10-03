import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { inboxFixtures } from '@/fixtures/inbox';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { NewSessionSheet } from '@/features/sessions/ui/NewSessionSheet';
import { filterInbox, type InboxFilter } from '../model/inbox';
import { GitHubMark } from './GitHubMark';
import { IssueLabel } from './IssueLabel';
import { IssueDetail } from './IssueDetail';
export function InboxPanel({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const t=useAppTheme();
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState<InboxFilter>('all');
  const [selected,setSelected]=useState<string>();
  const [readIds,setReadIds]=useState<string[]>([]);
  const [agentDraft,setAgentDraft]=useState<string>();
  useEffect(()=>{if(!visible){setSelected(undefined);setAgentDraft(undefined);}},[visible]);
  const issue=inboxFixtures.find(item=>item.id===selected);
  const filters:InboxFilter[]=['all','open','closed','bug','enhancement','unread'];
  const items=filterInbox(inboxFixtures,query,filter,readIds);
  return <View style={{flex:1,backgroundColor:t.canvas}}>
    <View style={styles.heading}>
      {issue ? <Pressable accessibilityRole="button" accessibilityLabel="Back to inbox" onPress={()=>setSelected(undefined)} style={styles.icon}>
        <AppSymbol name="chevron.left" size={18} tintColor={t.text}/></Pressable> : <View style={{width:44}}/>}
      <Text accessibilityRole="header" style={{color:t.text,fontSize:19,fontWeight:'600'}}>Inbox</Text>
      <GlassIconButton symbol="xmark" label="Close inbox" onPress={onClose}/>
    </View>
    {issue ? <IssueDetail key={issue.id} issue={issue} onAgent={setAgentDraft}/> : <>
      <View style={[styles.connection,{borderColor:t.line}]}>
        <View style={[styles.github,{backgroundColor:t.elevated}]}><GitHubMark size={20} color={t.text}/><Text style={{color:t.text,fontSize:15,fontWeight:'600'}}>GitHub</Text></View>
        <Pressable accessibilityRole="button" onPress={()=>Alert.alert('Add connection','Connect GitHub, GitLab, Linear, Jira, or Azure DevOps through a MonoCode host. This screen uses sample issues.')} style={[styles.github,{flex:1}]}>
          <AppSymbol name="plus" size={15} tintColor={t.secondaryText}/><Text style={{color:t.secondaryText,fontSize:13}}>Add connection</Text></Pressable>
      </View>
      <View style={[styles.search,{borderColor:t.line}]}>
        <AppSymbol name="magnifyingglass" size={16} tintColor={t.secondaryText}/>
        <TextInput accessibilityLabel="Filter inbox" value={query} onChangeText={setQuery} placeholder="Filter inbox" placeholderTextColor={t.tertiaryText} style={{flex:1,minWidth:0,color:t.text,fontSize:15,height:44}}/>
        <Pressable accessibilityRole="button" accessibilityLabel={'Inbox filter: '+filter} onPress={()=>Alert.alert('Filter inbox',undefined,filters.map(value=>({text:(value===filter ? '✓ ' : '')+value.charAt(0).toUpperCase()+value.slice(1),onPress:()=>setFilter(value)})))} style={styles.icon}>
          <AppSymbol name="line.3.horizontal.decrease" size={17} tintColor={filter==='all' ? t.secondaryText : t.accent}/></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Mark all sample issues read" onPress={()=>setReadIds(inboxFixtures.map(item=>item.id))} style={styles.icon}><AppSymbol name="checkmark.circle" size={17} tintColor={t.secondaryText}/></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh inbox" onPress={()=>Alert.alert('Sample inbox','Connect a host to fetch live issues.')} style={styles.icon}><AppSymbol name="arrow.clockwise" size={16} tintColor={t.secondaryText}/></Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
        {filter!=='all' && <Pressable onPress={()=>setFilter('all')} style={{minHeight:44,justifyContent:'center'}}><Text style={{color:t.accent,fontSize:12}}>{filter} · Show all</Text></Pressable>}
        {items.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.title+', '+item.state+', issue '+item.number}
          onPress={()=>{setSelected(item.id);setReadIds(ids=>ids.includes(item.id) ? ids : [...ids,item.id]);}} style={({pressed})=>[styles.row,{opacity:pressed ? 0.55 : 1}]}>
          <View style={styles.line}>
            <GitHubMark color={t.secondaryText}/><AppSymbol name={item.state==='open' ? 'circle.inset.filled' : 'checkmark.circle'} size={15} tintColor={item.state==='open' ? '#00B889' : '#A385ED'}/>
            <Text style={{flex:1,color:t.secondaryText,fontSize:12}}>Issue · #{item.number}</Text>
            {item.comments.length>0 && <View style={[styles.line,{gap:3}]}><AppSymbol name="bubble.left.and.bubble.right" size={13} tintColor={t.accent}/><Text style={{color:t.accent,fontSize:11}}>{item.comments.length}</Text></View>}
            <Text style={{color:t.tertiaryText,fontSize:11}}>{item.updated} ago</Text>
          </View>
          <Text numberOfLines={2} style={{color:t.text,fontSize:17,fontWeight:readIds.includes(item.id) ? '500' : '600',lineHeight:23,marginTop:8}}>{item.title}</Text>
          <View style={[styles.line,{marginTop:9}]}><ProjectMascot project={item.project}/><Text numberOfLines={1} style={{flex:1,color:t.secondaryText,fontSize:12}}>{item.repo}</Text></View>
          <View style={[styles.line,{marginTop:8,flexWrap:'wrap'}]}>{item.labels.map(label=><IssueLabel key={label.name} label={label}/>)}</View>
        </Pressable>)}
        {!items.length && <Text style={{color:t.secondaryText,paddingVertical:30}}>No issues match your filter.</Text>}
        <Text style={{color:t.tertiaryText,fontSize:11,marginTop:16}}>Sample inbox · Read state is local to this preview</Text>
      </ScrollView>
    </>}
    <NewSessionSheet visible={agentDraft!==undefined} initialPrompt={agentDraft} onClose={()=>setAgentDraft(undefined)}/>
  </View>;
}
const styles=StyleSheet.create({
  heading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:16,paddingBottom:12},
  connection:{flexDirection:'row',gap:8,paddingHorizontal:16,paddingBottom:12,borderBottomWidth:StyleSheet.hairlineWidth},github:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,minHeight:44,borderRadius:10,paddingHorizontal:16},
  search:{flexDirection:'row',alignItems:'center',paddingHorizontal:16,gap:5,borderBottomWidth:StyleSheet.hairlineWidth},icon:{width:44,minHeight:44,alignItems:'center',justifyContent:'center'},
  row:{paddingVertical:18},line:{flexDirection:'row',alignItems:'center',gap:7},
});
