import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { ComposerMenu } from './ComposerMenu';
import { UsageStrip } from './UsageStrip';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { composerModels } from '@/fixtures/composer';

type Props={prompt:string;onPromptChange:(text:string)=>void;modelIndex:number;onModelChange:(index:number)=>void;initialBranch?:string;workspaceLabel?:string;
  worktree:boolean;onWorktreeChange:(enabled:boolean)=>void;permissionIndex:number;onPermissionChange:(index:number)=>void;
  onFocus:()=>void;onBlur:()=>void;onUsage:()=>void;onTerminal:()=>void};
export function SessionComposer(props:Props) {
  const t=useAppTheme();
  const [width,setWidth]=useState(374);
  const [branch,setBranch]=useState(props.initialBranch ?? 'feat/mobile-app');
  useEffect(()=>{if(props.initialBranch)setBranch(props.initialBranch);},[props.initialBranch]);
  const model=composerModels[props.modelIndex];
  return <View onLayout={event=>setWidth(event.nativeEvent.layout.width)}
    style={[styles.card,{backgroundColor:t.surface,borderColor:t.line}]}>
    <View style={styles.body}>
      <View style={styles.identity}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{gap:8,alignItems:'center'}}>
          <ComposerMenu label={props.worktree ? 'New worktree' : props.workspaceLabel ?? 'Current checkout'} accessibilityLabel="Workspace"
            symbol="folder" width={145} glass={false} choices={[props.workspaceLabel ?? 'Current checkout','New worktree']}
            onSelect={index=>props.onWorktreeChange(index===1)}/>
          <ComposerMenu label={branch} accessibilityLabel="Branch" symbol="point.topleft.down.curvedto.point.bottomright.up"
            width={142} glass={false} choices={[props.initialBranch ?? 'feat/mobile-app','main']} onSelect={index=>setBranch(index===0 ? props.initialBranch ?? 'feat/mobile-app' : 'main')}/>
        </ScrollView>
        <View accessibilityLabel="Context usage: no connected session" style={{height:22,width:22}}>
          <Svg width={22} height={22}><Circle cx={11} cy={11} r={8} fill="none" stroke={t.tertiaryText} strokeWidth={2}/></Svg>
        </View>
      </View>
      <TextInput accessibilityLabel="Task prompt" autoFocus multiline value={props.prompt} onChangeText={props.onPromptChange}
        onFocus={props.onFocus} onBlur={props.onBlur} placeholder="Ask, build, / for commands, @ for references…"
        placeholderTextColor={t.tertiaryText} style={[styles.input,{color:t.text}]} textAlignVertical="top"/>
      <View style={styles.controls}>
        <View style={styles.pickers}>
          <GlassIconButton square symbol="plus" label="Add attachment"
            onPress={()=>Alert.alert('Attachments','Attachments will be available with a connected host.')}/>
          <ComposerMenu compact trailingShield provider={model.provider} label={model.label+' '+model.effort} accessibilityLabel="Model and reasoning effort, full access"
            width={Math.max(110,width-136)} choices={composerModels.map(m=>m.label+' · '+m.effort)} onSelect={props.onModelChange}/>
        </View>
        <GlassIconButton square white symbol="arrow.up" label="Create preview session" disabled={!props.prompt.trim()}
          onPress={()=>Alert.alert('Draft ready','Your task stays in this preview. Connect a host to start a real session.')}/>
      </View>
    </View>
    <UsageStrip provider={model.provider} onUsage={props.onUsage} onTerminal={props.onTerminal}/>
  </View>;
}
const styles=StyleSheet.create({
  card:{borderRadius:17,borderWidth:1,overflow:'hidden',marginHorizontal:14},
  body:{paddingHorizontal:12,paddingTop:5,paddingBottom:10},identity:{flexDirection:'row',alignItems:'center',gap:7},
  input:{minHeight:90,maxHeight:170,fontSize:17,lineHeight:24,paddingVertical:13},
  controls:{flexDirection:'row',gap:6,alignItems:'flex-end'},pickers:{flex:1,flexDirection:'row',flexWrap:'wrap',gap:6}
});
