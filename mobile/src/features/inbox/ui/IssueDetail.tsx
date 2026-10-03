import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import type { InboxIssue } from '../model/inbox';
import { GitHubMark } from './GitHubMark';
import { IssueLabel } from './IssueLabel';
export function IssueDetail({issue,onAgent}:{issue:InboxIssue;onAgent:(prompt:string)=>void}) {
  const t=useAppTheme();
  const [comment,setComment]=useState('');
  const stateColor=issue.state==='open' ? '#00B889' : '#A385ED';
  return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" stickyHeaderIndices={[0]} contentContainerStyle={{paddingBottom:32}}>
      <View style={[styles.header,{backgroundColor:t.canvas,borderColor:t.line}]}>
        <View style={styles.line}><GitHubMark color={t.secondaryText}/><Text style={{color:t.secondaryText,fontSize:12}}>Issue #{issue.number}</Text>
          <AppSymbol name={issue.state==='open' ? 'circle.inset.filled' : 'checkmark.circle'} size={14} tintColor={stateColor}/>
          <Text style={{color:stateColor,fontSize:12}}>{issue.state==='open' ? 'Open' : 'Closed'}</Text></View>
        <Text selectable style={[styles.title,{color:t.text}]}>{issue.title}</Text>
        <Text style={{color:t.secondaryText,fontSize:12,marginTop:10}}>{issue.repo}</Text>
        <View style={[styles.line,{marginTop:12}]}><AppSymbol name="person.crop.circle.fill" size={22} tintColor={t.secondaryText}/>
          <Text numberOfLines={1} style={{flex:1,color:t.secondaryText,fontSize:12}}>{issue.author} · Unassigned</Text></View>
        <Text style={{color:t.tertiaryText,fontSize:11,marginTop:6}}>Created {issue.created} · Updated {issue.updated} ago</Text>
        <View style={[styles.actions,{marginTop:16}]}>
          <Pressable accessibilityRole="button" onPress={()=>onAgent('Work on '+issue.title+'\n'+issue.repo+'#'+issue.number)} style={[styles.action,{backgroundColor:t.text}]}>
            <Text style={{color:t.canvas,fontSize:13,fontWeight:'600'}}>Send to agent</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={()=>onAgent('Help me understand '+issue.title+'\n'+issue.repo+'#'+issue.number)} style={[styles.action,{borderWidth:1,borderColor:t.line}]}>
            <AppSymbol name="bubble.left" size={15} tintColor={t.text}/><Text style={{color:t.text,fontSize:13}}>Ask</Text></Pressable>
          <Pressable accessibilityRole="link" accessibilityLabel="Open issue on GitHub" onPress={()=>Linking.openURL('https://github.com/'+issue.repo+'/issues/'+issue.number).catch(()=>Alert.alert('Unable to open GitHub','Try again when a browser is available.'))} style={styles.action}>
            <AppSymbol name="arrow.up.right.square" size={15} tintColor={t.secondaryText}/><Text style={{color:t.secondaryText,fontSize:12}}>GitHub</Text></Pressable>
        </View>
      </View>
      <View style={{padding:20}}>
        <View style={[styles.actions,{marginBottom:20}]}>{issue.labels.map(label=><IssueLabel key={label.name} label={label}/>)}</View>
        {issue.sections.map(section=><View key={section.title} style={{marginBottom:24}}>
          <Text accessibilityRole="header" style={{color:t.text,fontSize:21,fontWeight:'600',marginBottom:12}}>{section.title}</Text>
          <Text selectable style={styles.body(t.secondaryText)}>{section.body}</Text>
        </View>)}
        <View style={{height:StyleSheet.hairlineWidth,backgroundColor:t.line,marginBottom:22}}/>
        <Text style={{color:t.secondaryText,fontSize:13,marginBottom:16}}>{issue.comments.length} {issue.comments.length===1 ? 'comment' : 'comments'}</Text>
        {issue.comments.map(item=><View key={item.id} style={[styles.comment,{backgroundColor:t.surface,borderColor:t.line}]}>
          <View style={[styles.commentHeader,{borderColor:t.line}]}>
            <AppSymbol name="person.crop.circle.fill" size={24} tintColor={t.secondaryText}/>
            <Text numberOfLines={1} style={{flex:1,color:t.text,fontSize:13,fontWeight:'600'}}>{item.author}</Text>
            <Text style={{color:t.tertiaryText,fontSize:11}}>{item.time}</Text>
          </View>
          <View style={{padding:14}}>
            {item.quote && <View style={{borderLeftWidth:3,borderColor:t.line,paddingLeft:12,marginBottom:12}}><Text selectable style={[styles.body(t.secondaryText),{fontStyle:'italic'}]}>{item.quote}</Text></View>}
            <Text selectable style={styles.body(t.secondaryText)}>{item.body}</Text>
          </View>
        </View>)}
        <View style={[styles.comment,{backgroundColor:t.surface,borderColor:t.line,padding:14,marginTop:12}]}>
          <TextInput accessibilityLabel="Comment draft" multiline placeholder="Leave a comment…" placeholderTextColor={t.tertiaryText} value={comment} onChangeText={setComment}
            style={{color:t.text,fontSize:15,minHeight:80,textAlignVertical:'top'}}/>
          <Pressable accessibilityRole="button" disabled={!comment.trim()} onPress={()=>Alert.alert('Comment draft','Your draft stays here. Connect GitHub through a host to post it.')}
            style={[styles.action,{alignSelf:'flex-end',backgroundColor:t.elevated,opacity:comment.trim() ? 1 : 0.4}]}><Text style={{color:t.text,fontSize:13}}>Comment</Text></Pressable>
        </View>
        <Text style={{color:t.tertiaryText,fontSize:11,lineHeight:16,marginTop:8}}>Sample issue and comments · No GitHub account connected</Text>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>;
}
const styles={
  header:{padding:20,borderBottomWidth:StyleSheet.hairlineWidth},title:{fontSize:22,fontWeight:'700' as const,lineHeight:28,marginTop:12,letterSpacing:-0.4},
  line:{flexDirection:'row' as const,alignItems:'center' as const,gap:7},actions:{flexDirection:'row' as const,flexWrap:'wrap' as const,gap:8},
  action:{minHeight:44,borderRadius:9,paddingHorizontal:12,flexDirection:'row' as const,alignItems:'center' as const,justifyContent:'center' as const,gap:6},
  body:(color:string)=>({color,fontSize:15,lineHeight:24}),comment:{borderWidth:StyleSheet.hairlineWidth,borderRadius:10,overflow:'hidden' as const,marginBottom:12},
  commentHeader:{flexDirection:'row' as const,alignItems:'center' as const,gap:8,padding:12,borderBottomWidth:StyleSheet.hairlineWidth},
};
