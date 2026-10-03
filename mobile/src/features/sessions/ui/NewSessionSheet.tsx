import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import { composerModels } from '@/fixtures/composer';
import { SessionComposer } from './SessionComposer';
import { UsageSheet } from './UsageSheet';
import { TerminalSheet } from './TerminalSheet';
import { ProjectPickerSheet } from '@/features/projects/ui/ProjectPickerSheet';
import { projectFixtures } from '@/fixtures/projects';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import type { ComposerMode } from '../model/composerAdd';

export type NewSessionContext={project:string;branch:string;worktree:boolean;group?:string};
export function NewSessionSheet({visible,onClose,context,initialPrompt}:{visible:boolean;onClose:()=>void;context?:NewSessionContext;initialPrompt?:string}) {
  const t=useAppTheme();
  // Draft and configuration outlive the native sheet's presented-content subtree.
  const [prompt,setPrompt]=useState('');
  const [worktree,setWorktree]=useState(false);
  const [modelIndex,setModelIndex]=useState(0);
  const [permissionIndex,setPermissionIndex]=useState(0);
  const [mode,setMode]=useState<ComposerMode>('build');
  const [editing,setEditing]=useState(false);
  const [usageOpen,setUsageOpen]=useState(false);
  const [terminalOpen,setTerminalOpen]=useState(false);
  const [projectPickerOpen,setProjectPickerOpen]=useState(false);
  const [selectedProject,setSelectedProject]=useState('monocode');
  const project=projectFixtures.find(item=>item.id===selectedProject);
  const activeContext=context?.project===selectedProject ? context : undefined;
  const model=composerModels[modelIndex];
  const heroHeight=editing ? 280 : 440;
  const questionStyle=[styles.question,{color:t.text,fontSize:editing ? 26 : 30,lineHeight:editing ? 32 : 36}];
  useEffect(()=>{if(!visible){setUsageOpen(false);setTerminalOpen(false);setProjectPickerOpen(false);setEditing(false);}},[visible]);
  useEffect(()=>{if(visible&&context){setWorktree(false);setSelectedProject(context.project);}},[visible,context]);
  useEffect(()=>{if(visible&&initialPrompt!==undefined)setPrompt(initialPrompt);},[visible,initialPrompt]);
  return <NativeSheet visible={visible} onClose={onClose}>
    <KeyboardAvoidingView style={{flex:1,backgroundColor:t.canvas}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={styles.content}>
        <View style={[styles.hero,{minHeight:heroHeight}]}>
          <View style={StyleSheet.absoluteFill}><PacmanGame height={heroHeight} opacity={0.24} fadeBottom/></View>
          <View style={styles.header}>
            <GlassIconButton symbol="xmark" label="Close new session" onPress={onClose}/>
            <Text accessibilityRole="header" style={[styles.title,{color:t.text}]}>New Session</Text>
            <View style={{width:44}}/>
          </View>
          <View style={[styles.welcome,{paddingBottom:editing ? 20 : 32}]}>
            <ProviderIcon provider={model.provider} color={t.text} size={editing ? 36 : 46}/>
            <View style={{alignItems:'center'}}>
              <Text style={questionStyle}>What should we work on</Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
                <Text style={questionStyle}>in</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={'Choose project, current project '+selectedProject}
                  onPress={()=>{Keyboard.dismiss();setEditing(false);setProjectPickerOpen(true);}}
                  style={({pressed})=>({flexDirection:'row',alignItems:'center',gap:5,minHeight:44,flexShrink:1,opacity:pressed ? 0.6 : 1})}>
                  <Text numberOfLines={1} style={[...questionStyle,{flexShrink:1}]}>{selectedProject}</Text>
                  <AppSymbol name="chevron.down" size={13} tintColor={t.secondaryText}/>
                </Pressable>
                <Text style={questionStyle}>?</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{marginTop:'auto'}}>
          <SessionComposer prompt={prompt} onPromptChange={setPrompt} modelIndex={modelIndex} onModelChange={setModelIndex}
            mode={mode} onModeChange={setMode}
            initialBranch={activeContext?.branch ?? project?.branch} workspaceLabel={activeContext?.worktree ? 'Current worktree' : undefined}
            worktree={worktree} onWorktreeChange={setWorktree} permissionIndex={permissionIndex} onPermissionChange={setPermissionIndex}
            onFocus={()=>setEditing(true)} onBlur={()=>setEditing(false)}
            onUsage={()=>{Keyboard.dismiss();setUsageOpen(true);}} onTerminal={()=>{Keyboard.dismiss();setTerminalOpen(true);}}/>
        </View>
        <Text style={[styles.note,{color:t.tertiaryText}]}>{selectedProject+' / '+(activeContext?.branch ?? project?.branch ?? 'main')+(activeContext?.group ? ' · '+activeContext.group : '')} · No host connected</Text>
      </ScrollView>
      <UsageSheet visible={usageOpen} onClose={()=>setUsageOpen(false)}/>
      <TerminalSheet visible={terminalOpen} onClose={()=>setTerminalOpen(false)}/>
      <ProjectPickerSheet visible={projectPickerOpen} selectedId={selectedProject} projects={projectFixtures}
        onSelect={item=>{setSelectedProject(item.id);setWorktree(false);}} onClose={()=>setProjectPickerOpen(false)}/>
    </KeyboardAvoidingView>
  </NativeSheet>;
}
const styles=StyleSheet.create({
  content:{flexGrow:1,paddingBottom:24},hero:{overflow:'hidden'},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingTop:18},
  title:{fontSize:18,fontWeight:'600'},welcome:{alignItems:'center',justifyContent:'flex-end',flex:1,padding:20,gap:12},
  question:{fontWeight:'600',letterSpacing:-0.5,textAlign:'center',lineHeight:31},
  note:{fontSize:11,textAlign:'center',marginTop:12}
});
