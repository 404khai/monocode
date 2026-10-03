import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sessionFixtures } from '@/fixtures/sessions';
import { composerModels } from '@/fixtures/composer';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import type { SessionSummary } from '../model/sessionSummary';
import type { ComposerMode } from '../model/composerAdd';
import { createThreadFixture, hasMoreChatBelow, type ChatMessage } from '../model/threadChat';
import { SessionComposer } from './SessionComposer';
import { ChatMessageBlock } from './ChatTranscript';
import { UsageSheet } from './UsageSheet';
import { TerminalSheet } from './TerminalSheet';
import { WorkingPixels } from './WorkingPixels';
import { ComposerRunner } from './ComposerRunner';
import { ChatBackground } from '@/features/settings/ui/ChatBackground';
import { useChatBackground } from '@/features/settings/data/chatBackgroundStore';
import { chatBackgroundOpacity } from '@/features/settings/model/chatBackground';
import { HERO_BACKGROUND_HEIGHT } from '@/shared/ui/backgroundGeometry';

type ThreadDraft={messages:ChatMessage[];prompt:string;modelIndex:number;mode:ComposerMode};
// Preview state survives back navigation, but is not persisted or sent to a host.
const drafts=new Map<string,ThreadDraft>();
export function ThreadChatScreen() {
  const {sessionId}=useLocalSearchParams<{sessionId:string}>();
  const session=sessionFixtures.find(item=>item.id===sessionId);
  const t=useAppTheme();
  if(!session)return <View style={{flex:1,backgroundColor:t.canvas,justifyContent:'center',padding:20}}>
    <Stack.Screen options={{title:'Thread unavailable',headerLargeTitleEnabled:false}}/>
    <Text style={{color:t.secondaryText}}>This sample thread is no longer available. Go back to choose another thread.</Text>
  </View>;
  return <ThreadConversation key={session.id} session={session}/>;
}
function ThreadConversation({session}:{session:SessionSummary}) {
  const t=useAppTheme();
  const insets=useSafeAreaInsets();
  const background=useChatBackground();
  const offset=useRef(new Animated.Value(0)).current;
  const [draft,setDraft]=useState<ThreadDraft>(()=>drafts.get(session.id) ?? {
    messages:createThreadFixture(session),prompt:'',modelIndex:Math.max(0,composerModels.findIndex(model=>model.provider===session.provider)),mode:'build',
  });
  useEffect(()=>{drafts.set(session.id,draft);},[session.id,draft]);
  const [worktree,setWorktree]=useState(false);
  const [permissionIndex,setPermissionIndex]=useState(0);
  const [usageOpen,setUsageOpen]=useState(false);
  const [terminalOpen,setTerminalOpen]=useState(false);
  const [showDown,setShowDown]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(true);
  useEffect(()=>{
    let mounted=true;
    AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(mounted)setReduceMotion(value);});
    const subscription=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduceMotion);
    return()=>{mounted=false;subscription.remove();};
  },[]);
  const scroll=useRef<ScrollView>(null);
  const metrics=useRef({contentHeight:0,viewportHeight:0,offsetY:0});
  const stickToBottom=useRef(true);
  const initialized=useRef(false);
  const localSequence=useRef(0);
  const syncArrow=()=>setShowDown(initialized.current&&hasMoreChatBelow(metrics.current.contentHeight,metrics.current.viewportHeight,metrics.current.offsetY));
  const jumpToLatest=(animated=true)=>{
    if(metrics.current.viewportHeight<=0||metrics.current.contentHeight<=0)return;
    stickToBottom.current=true;initialized.current=true;
    metrics.current.offsetY=Math.max(0,metrics.current.contentHeight-metrics.current.viewportHeight);
    scroll.current?.scrollToEnd({animated:animated&&!reduceMotion});syncArrow();
  };
  const layoutChanged=()=>{
    if(stickToBottom.current)jumpToLatest(false);
    else syncArrow();
  };
  const sendPreview=()=>{
    const text=draft.prompt.trim();if(!text)return;
    const message:ChatMessage={id:'local-'+Date.now()+'-'+localSequence.current++,role:'user',text,time:'Just now',local:true};
    stickToBottom.current=true;Keyboard.dismiss();
    setDraft(value=>({...value,prompt:'',messages:[...value.messages,message]}));
  };
  return <>
    {/* Keep the shared native soft edge, but chat always uses the compact title. */}
    <Stack.Screen options={{title:session.title,headerLargeTitleEnabled:false,headerTransparent:true,headerTitleAlign:'center',headerTitleStyle:{color:t.text,fontSize:17,fontWeight:'600'},headerBackButtonDisplayMode:'minimal',scrollEdgeEffects:{top:'soft'},headerShadowVisible:false,
      headerTitle:()=> <View style={{maxWidth:230,alignItems:'center',justifyContent:'center',gap:3}}>
        <Text numberOfLines={1} style={{color:t.text,fontSize:17,fontWeight:'600'}}>{session.title}</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
          <ProjectMascot project={session.project} name={session.projectMascot} color={session.projectColor} size={12}/>
          <Text numberOfLines={1} style={{color:t.secondaryText,fontSize:11,flexShrink:1}}>{session.project} · {session.branch}</Text>
        </View>
      </View>,
    }}/>
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel="Thread actions">
        <Stack.Toolbar.MenuAction icon="info.circle" onPress={()=>Alert.alert('Sample thread',session.project+' / '+session.branch+'\n'+session.model+'\nNo host connected. Messages and activity are fixtures.')}>Thread details</Stack.Toolbar.MenuAction>
        <Stack.Toolbar.MenuAction icon="terminal" onPress={()=>setTerminalOpen(true)}>Terminal preview</Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
      {/* Same direct native ScrollView hierarchy as Notes/Sessions. Keyboard
          avoidance belongs to the footer, not around UIKit's tracked scroll view. */}
        <Animated.ScrollView ref={scroll} style={{flex:1,backgroundColor:t.canvas}} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" scrollEventThrottle={16}
          onLayout={event=>{metrics.current.viewportHeight=event.nativeEvent.layout.height;layoutChanged();}}
          onContentSizeChange={(_,height)=>{metrics.current.contentHeight=height;layoutChanged();}}
          onScroll={Animated.event([{nativeEvent:{contentOffset:{y:offset}}}],{useNativeDriver:true,listener:(event:any)=>{metrics.current.offsetY=event.nativeEvent.contentOffset.y;
            stickToBottom.current=!hasMoreChatBelow(metrics.current.contentHeight,metrics.current.viewportHeight,metrics.current.offsetY);syncArrow();}})}
          contentContainerStyle={{paddingHorizontal:18,paddingTop:12,paddingBottom:24}}>
          <Animated.View pointerEvents="none" accessibilityElementsHidden style={[StyleSheet.absoluteFill,{height:HERO_BACKGROUND_HEIGHT,bottom:undefined,transform:[{translateY:offset}]}]}>
            {chatBackgroundOpacity(background,false)>0&&<ChatBackground/>}
          </Animated.View>
          <Text style={{color:t.tertiaryText,fontSize:11,textAlign:'center',marginBottom:16}}>Sample conversation · No host connected</Text>
          {draft.messages.map(message=><ChatMessageBlock key={message.id} message={message} session={session} onPrepare={(prompt,modelIndex)=>setDraft(value=>({...value,prompt,modelIndex:modelIndex??value.modelIndex}))}/>)}
          {session.state==='working'&&<View style={{flexDirection:'row',alignItems:'center',gap:8,minHeight:36}}><WorkingPixels/><Text style={{color:t.secondaryText,fontSize:12}}>Working state · Fixture preview</Text></View>}
        </Animated.ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : undefined} style={{backgroundColor:t.canvas}}>
      <View style={{paddingTop:8,paddingBottom:Math.max(10,insets.bottom),backgroundColor:t.canvas}}>
        {showDown&&<View pointerEvents="box-none" style={{position:'absolute',top:-56,left:0,right:0,alignItems:'center'}}><GlassIconButton symbol="chevron.down" label="Scroll to latest message" onPress={()=>jumpToLatest()}/></View>}
        {session.state==='working'&&<ComposerRunner session={session}/>}
        <SessionComposer compact prompt={draft.prompt} onPromptChange={prompt=>setDraft(value=>({...value,prompt}))}
          modelIndex={draft.modelIndex} onModelChange={modelIndex=>setDraft(value=>({...value,modelIndex}))}
          mode={draft.mode} onModeChange={mode=>setDraft(value=>({...value,mode}))}
          initialBranch={session.branch} workspaceLabel={session.workspace.kind==='worktree' ? 'Current worktree' : undefined}
          worktree={worktree} onWorktreeChange={setWorktree} permissionIndex={permissionIndex} onPermissionChange={setPermissionIndex}
          onFocus={()=>{}} onBlur={()=>{}} onSend={sendPreview}
          onUsage={()=>{Keyboard.dismiss();setUsageOpen(true);}} onTerminal={()=>{Keyboard.dismiss();setTerminalOpen(true);}}/>
      </View>
      </KeyboardAvoidingView>
      <UsageSheet visible={usageOpen} onClose={()=>setUsageOpen(false)}/>
      <TerminalSheet visible={terminalOpen} onClose={()=>setTerminalOpen(false)} project={session.project} branch={session.branch}/>
  </>;
}
