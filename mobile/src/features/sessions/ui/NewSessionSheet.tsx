import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import type { SessionProvider } from '../model/sessionSummary';

export function NewSessionSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  const t=useAppTheme();
  // Kept outside the native sheet's presented content so swipe-dismiss does not discard the draft.
  const [prompt,setPrompt]=useState('');
  const [worktree,setWorktree]=useState(true);
  const [provider,setProvider]=useState<SessionProvider>('claude');
  const [editing,setEditing]=useState(false);
  const providers:SessionProvider[]=['claude','codex','cursor','opencode'];
  return <NativeSheet visible={visible} onClose={onClose}>
    <KeyboardAvoidingView style={{flex:1,backgroundColor:t.canvas}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={[styles.hero,{minHeight:editing ? 230 : 360}]}>
          <View style={StyleSheet.absoluteFill}><PacmanGame height={editing ? 230 : 360} opacity={0.24}/></View>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Close new session" onPress={onClose} style={[styles.close,{backgroundColor:t.surface}]}>
              <AppSymbol name="xmark" size={22} tintColor={t.text}/>
            </Pressable>
            <Text accessibilityRole="header" style={[styles.title,{color:t.text}]}>New Session</Text>
            <View style={{width:44}}/>
          </View>
          <View style={styles.welcome}>
            <ProviderIcon provider={provider} color={t.text} size={46}/>
            <Text style={[styles.question,{color:t.text}]}>What should we work on{ '\n' }in monocode?</Text>
          </View>
        </View>
        <View style={[styles.composer,{backgroundColor:t.surface,borderColor:t.line}]}>
          <TextInput accessibilityLabel="Describe the task" autoFocus multiline placeholder="Describe the task"
            onFocus={()=>setEditing(true)} onBlur={()=>setEditing(false)}
            placeholderTextColor={t.tertiaryText} value={prompt} onChangeText={setPrompt}
            style={[styles.input,{color:t.text}]} textAlignVertical="top"/>
          <View style={styles.options}>
            <Pressable accessibilityLabel="Add attachment" onPress={()=>Alert.alert('Attachments','Attachments will be available when a host is connected.')}
              style={[styles.optionIcon,{backgroundColor:t.elevated}]}>
              <AppSymbol name="plus" tintColor={t.text} size={21}/>
            </Pressable>
            <View style={[styles.chip,{backgroundColor:t.elevated}]}>
              <ProjectMascot project="monocode" size={14}/>
              <Text style={{color:t.text,fontSize:13,fontWeight:'500'}}>monocode</Text>
            </View>
            <Pressable accessibilityLabel="Use new worktree" accessibilityState={{selected:worktree}} onPress={()=>setWorktree(v=>!v)}
              style={[styles.chip,{backgroundColor:t.elevated}]}>
              <AppSymbol name="point.topleft.down.curvedto.point.bottomright.up" tintColor={t.secondaryText} size={13}/>
              <Text style={{color:t.text,fontSize:12}}>{worktree ? 'New worktree' : 'Current branch'}</Text>
            </Pressable>
            <View style={{flex:1}}/>
            <Pressable accessibilityLabel="Choose provider" onPress={()=>setProvider(providers[(providers.indexOf(provider)+1)%providers.length])}>
              <ProviderIcon provider={provider} color={t.text} size={28}/>
            </Pressable>
            <Pressable accessibilityLabel="Create preview session" disabled={!prompt.trim()}
              onPress={()=>Alert.alert('Draft ready','Your task is saved in this preview. Connect a host to start a real session.')}
              style={[styles.optionIcon,{backgroundColor:prompt.trim() ? t.text : t.elevated}]}>
              <AppSymbol name="arrow.up" tintColor={prompt.trim() ? t.canvas : t.tertiaryText} size={21}/>
            </Pressable>
          </View>
        </View>
        <Text style={[styles.note,{color:t.tertiaryText}]}>Mock workspace · No host connected</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </NativeSheet>;
}
const styles=StyleSheet.create({
  content:{flexGrow:1,paddingBottom:24},hero:{minHeight:360,overflow:'hidden'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:18},
  close:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'},title:{fontSize:18,fontWeight:'600'},
  welcome:{alignItems:'center',justifyContent:'center',flex:1,padding:30,gap:14},
  question:{fontSize:26,fontWeight:'600',letterSpacing:-0.5,textAlign:'center',lineHeight:33},
  composer:{marginHorizontal:14,marginTop:'auto',borderRadius:26,borderWidth:1,padding:14},
  input:{minHeight:96,maxHeight:180,fontSize:18,lineHeight:25},options:{flexDirection:'row',alignItems:'center',gap:7,flexWrap:'wrap',marginTop:12},
  optionIcon:{width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center'},chip:{borderRadius:18,paddingHorizontal:10,height:34,flexDirection:'row',gap:5,alignItems:'center'},
  note:{fontSize:11,textAlign:'center',marginTop:12}
});
