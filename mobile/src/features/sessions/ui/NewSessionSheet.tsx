import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import { composerModels } from '@/fixtures/composer';
import { SessionComposer } from './SessionComposer';
import { UsageSheet } from './UsageSheet';
import { TerminalSheet } from './TerminalSheet';

export type NewSessionContext={project:string;branch:string;worktree:boolean;group?:string};
export function NewSessionSheet({visible,onClose,context}:{visible:boolean;onClose:()=>void;context?:NewSessionContext}) {
  const t=useAppTheme();
  // Draft and configuration outlive the native sheet's presented-content subtree.
  const [prompt,setPrompt]=useState('');
  const [worktree,setWorktree]=useState(false);
  const [modelIndex,setModelIndex]=useState(0);
  const [permissionIndex,setPermissionIndex]=useState(0);
  const [editing,setEditing]=useState(false);
  const [usageOpen,setUsageOpen]=useState(false);
  const [terminalOpen,setTerminalOpen]=useState(false);
  const model=composerModels[modelIndex];
  useEffect(()=>{if(!visible){setUsageOpen(false);setTerminalOpen(false);setEditing(false);}},[visible]);
  useEffect(()=>{if(visible&&context)setWorktree(false);},[visible,context]);
  return <NativeSheet visible={visible} onClose={onClose}>
    <KeyboardAvoidingView style={{flex:1,backgroundColor:t.canvas}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
        <View style={[styles.hero,{minHeight:editing ? 220 : 360}]}>
          <View style={StyleSheet.absoluteFill}><PacmanGame height={editing ? 220 : 360} opacity={0.24} fadeBottom/></View>
          <View style={styles.header}>
            <GlassIconButton symbol="xmark" label="Close new session" onPress={onClose}/>
            <Text accessibilityRole="header" style={[styles.title,{color:t.text}]}>New Session</Text>
            <View style={{width:44}}/>
          </View>
          <View style={styles.welcome}>
            <ProviderIcon provider={model.provider} color={t.text} size={editing ? 36 : 46}/>
            <Text style={[styles.question,{color:t.text,fontSize:editing ? 22 : 26}]}>What should we work on{ '\n' }in monocode?</Text>
          </View>
        </View>
        <View style={{marginTop:'auto'}}>
          <SessionComposer prompt={prompt} onPromptChange={setPrompt} modelIndex={modelIndex} onModelChange={setModelIndex}
            initialBranch={context?.branch} workspaceLabel={context?.worktree ? 'Current worktree' : undefined}
            worktree={worktree} onWorktreeChange={setWorktree} permissionIndex={permissionIndex} onPermissionChange={setPermissionIndex}
            onFocus={()=>setEditing(true)} onBlur={()=>setEditing(false)}
            onUsage={()=>{Keyboard.dismiss();setUsageOpen(true);}} onTerminal={()=>{Keyboard.dismiss();setTerminalOpen(true);}}/>
        </View>
        <Text style={[styles.note,{color:t.tertiaryText}]}>{context ? context.project+' / '+context.branch+(context.group ? ' · '+context.group : '') : 'Mock workspace'} · No host connected</Text>
      </ScrollView>
      <UsageSheet visible={usageOpen} onClose={()=>setUsageOpen(false)}/>
      <TerminalSheet visible={terminalOpen} onClose={()=>setTerminalOpen(false)}/>
    </KeyboardAvoidingView>
  </NativeSheet>;
}
const styles=StyleSheet.create({
  content:{flexGrow:1,paddingBottom:24},hero:{overflow:'hidden'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:18},
  title:{fontSize:18,fontWeight:'600'},welcome:{alignItems:'center',justifyContent:'center',flex:1,padding:20,gap:12},
  question:{fontWeight:'600',letterSpacing:-0.5,textAlign:'center',lineHeight:31},
  note:{fontSize:11,textAlign:'center',marginTop:12}
});
