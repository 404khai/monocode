import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { copyChatText } from '@/platform/chatNativeCapabilities';
import { addNote } from '@/features/notes/model/noteStore';
import { composerModels } from '@/fixtures/composer';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import type { SessionSummary } from '../model/sessionSummary';
import type { ChatActivity, ChatMessage } from '../model/threadChat';

function ActivityRow({activity}:{activity:ChatActivity}) {
  const t=useAppTheme();
  const [open,setOpen]=useState(false);
  return <View style={{paddingVertical:5}}>
    <Pressable accessibilityRole="button" accessibilityState={{expanded:open}} accessibilityLabel={activity.kind+': '+activity.label}
      onPress={()=>setOpen(value=>!value)} style={{flexDirection:'row',alignItems:'center',gap:8,minHeight:44}}>
      <AppSymbol name={activity.kind==='run' ? 'terminal' : activity.kind==='edit' ? 'square.and.pencil' : 'doc.text'} size={16} tintColor={t.secondaryText}/>
      <Text style={{color:t.secondaryText,fontSize:12}}>{activity.kind==='run' ? 'Run' : activity.kind==='edit' ? 'Edit' : 'Read'}</Text>
      <Text numberOfLines={1} style={{flex:1,color:t.secondaryText,fontSize:13,fontFamily:activity.kind==='run' ? 'Menlo' : undefined}}>{activity.label}</Text>
      <AppSymbol name={open ? 'chevron.down' : 'chevron.right'} size={10} tintColor={t.tertiaryText}/>
    </Pressable>
    {open&&<Text selectable style={{color:t.secondaryText,fontSize:12,lineHeight:19,fontFamily:activity.kind==='run' ? 'Menlo' : undefined,
      padding:12,borderRadius:9,backgroundColor:t.surface}}>{activity.detail}</Text>}
  </View>;
}
export function ChatMessageBlock({message,session,onPrepare}:{message:ChatMessage;session:SessionSummary;onPrepare:(text:string,modelIndex?:number)=>void}) {
  const t=useAppTheme();
  const [workOpen,setWorkOpen]=useState(message.id==='result');
  const [copied,setCopied]=useState(false);
  const actions=<View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}>
    <MessageAction name={copied?'checkmark':'doc.on.doc'} label={copied?'Copied':'Copy message'} onPress={()=>{void copyChatText(message.text).then(()=>setCopied(true)).catch(error=>Alert.alert('Could not copy message',error instanceof Error?error.message:'Please try again.'));}}/>
    <MessageAction name="doc.badge.plus" label="Save message to Notes" onPress={()=>{addNote(session.project,session.title,message.text);Alert.alert('Saved to Notes','Saved in this preview. Notes remain in memory until the app closes.');}}/>
    {message.role==='assistant'&&<>
      <MessageAction name="arrow.triangle.branch" label="Handoff to another model" onPress={()=>chooseModel('Handoff',message,session,onPrepare)}/>
      <MessageAction name="bubble.left.and.bubble.right" label="Get a second opinion" onPress={()=>chooseModel('Second opinion',message,session,onPrepare)}/>
      <MessageAction name="chart.bar.xaxis" label="Turn metrics" onPress={()=>Alert.alert('Turn metrics','Sample conversation · '+(message.activity?.length??0)+' activity steps\nLive duration, token usage, and costs are unavailable without a host.')}/>
    </>}
    <Text style={{color:t.tertiaryText,fontSize:11,marginLeft:6}}>{message.local?'Not sent · ':''}{message.time}</Text>
  </View>;
  if(message.role==='user') return <View style={styles.userTurn}>
    <View style={[styles.userBubble,{backgroundColor:t.elevated}]}><Text selectable style={[styles.prose,{color:t.text}]}>{message.text}</Text></View>
    {actions}
  </View>;
  return <View style={styles.agentTurn}>
    <View style={{flexDirection:'row',alignItems:'center',gap:7,marginBottom:12}}>
      <ProviderIcon provider={session.provider} color={t.text} size={16}/>
      <Text style={{color:t.secondaryText,fontSize:12}}>{session.model}</Text>
    </View>
    <Text selectable style={[styles.prose,{color:t.text}]}>{message.text}</Text>
    {!!message.activity?.length&&<View style={{marginTop:14}}>
      <Pressable accessibilityRole="button" accessibilityState={{expanded:workOpen}} accessibilityLabel={message.summary}
        onPress={()=>setWorkOpen(value=>!value)} style={{flexDirection:'row',alignItems:'center',gap:8,minHeight:44}}>
        <AppSymbol name={workOpen ? 'chevron.down' : 'chevron.right'} size={12} tintColor={t.secondaryText}/>
        <Text style={{flex:1,color:t.secondaryText,fontSize:13,lineHeight:20}}>{message.summary}</Text>
      </Pressable>
      {workOpen&&<View style={{borderLeftWidth:StyleSheet.hairlineWidth,borderColor:t.line,paddingLeft:14,marginLeft:6}}>
        {message.activity.map(activity=><ActivityRow key={activity.id} activity={activity}/>)}
      </View>}
    </View>}
    {actions}
  </View>;
}
function MessageAction({name,label,onPress}:{name:React.ComponentProps<typeof AppSymbol>['name'];label:string;onPress:()=>void}) {
  const t=useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed})=>({width:44,height:44,justifyContent:'center',alignItems:'center',opacity:pressed?0.5:1})}><AppSymbol name={name} size={16} tintColor={t.tertiaryText}/></Pressable>;
}
function chooseModel(action:'Handoff'|'Second opinion',message:ChatMessage,session:SessionSummary,onPrepare:(text:string,index?:number)=>void) {
  Alert.alert(action,'Choose a model to prepare a draft. Nothing is sent without a connected host.',[
    ...composerModels.filter((model,index,models)=>(action==='Second opinion'||model.provider!==session.provider)&&models.findIndex(item=>item.provider===model.provider)===index).slice(0,3).map(model=>({text:model.label,onPress:()=>onPrepare((action==='Handoff'?'Continue this work using the following context:':'Give a second opinion on this response:')+'\n\n'+message.text,composerModels.indexOf(model))})),
    {text:'Cancel',style:'cancel' as const},
  ]);
}
const styles=StyleSheet.create({
  prose:{fontSize:16,lineHeight:26},userTurn:{alignItems:'flex-end',marginTop:16,marginBottom:24},
  userBubble:{maxWidth:'92%',borderRadius:14,paddingHorizontal:14,paddingVertical:12},agentTurn:{marginBottom:24},
});
