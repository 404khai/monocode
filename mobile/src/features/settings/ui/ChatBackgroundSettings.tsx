import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { chatNativeCapabilities, getImagePicker, NATIVE_REBUILD_MESSAGE } from '@/platform/chatNativeCapabilities';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { VisibilitySlider } from '@/shared/ui/VisibilitySlider';
import { BACKGROUND_EFFECTS, BACKGROUND_EFFECT_LABELS, type ChatBackgroundSettings as Settings } from '../model/chatBackground';
import { importChatBackground, removeChatBackground, saveChatBackground, useChatBackground } from '../data/chatBackgroundStore';
import { ChatBackground } from './ChatBackground';

export function ChatBackgroundSettings({query}:{query:string}) {
  const t=useAppTheme(), settings=useChatBackground();
  const [busy,setBusy]=useState(false);
  const [preview,setPreview]=useState<Partial<Settings>>({});
  const capabilities=chatNativeCapabilities();
  const update=(patch:Partial<Settings>)=>{
    try {saveChatBackground(patch);setPreview({});} catch(error) {Alert.alert('Could not save background',error instanceof Error?error.message:'Please try again.');}
  };
  const pick=async()=>{
    setBusy(true);
    try {
      const ImagePicker=getImagePicker();
      const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:1});
      if(!result.canceled&&result.assets[0])importChatBackground(result.assets[0].uri);
    } catch(error) {Alert.alert('Could not load photo',error instanceof Error?error.message:'Please choose another photo.');} finally {setBusy(false);}
  };
  if(query&&!('chat background image choose change delete remove effects none dither ascii halftone scanlines haze empty chat visibility session visibility show all sessions'.includes(query.toLowerCase())))return <Text style={{color:t.secondaryText,marginTop:20}}>No settings match your search.</Text>;
  const choice=(label:string,active:boolean,onPress:()=>void)=><Pressable key={label} accessibilityRole="button" accessibilityState={{selected:active,disabled:busy}} disabled={busy} onPress={onPress}
    style={{minHeight:44,paddingHorizontal:14,justifyContent:'center',borderRadius:10,backgroundColor:active?t.elevated:t.surface,borderWidth:1,borderColor:active?t.accent:t.line}}>
    <Text style={{color:active?t.text:t.secondaryText,fontSize:14}}>{label}</Text></Pressable>;
  return <View style={{gap:20,marginTop:16}}>
    <Text style={{color:t.text,fontSize:18,fontWeight:'600'}}>Chat background</Text>
    {(!capabilities.photos||!capabilities.files)&&<Text style={{color:t.secondaryText,fontSize:13,lineHeight:20}}>{NATIVE_REBUILD_MESSAGE}</Text>}
    <View style={{height:180,backgroundColor:t.canvas,borderRadius:14,overflow:'hidden',borderWidth:1,borderColor:t.line}}>
      <ChatBackground empty height={180} settings={{...settings,...preview}}/>
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{color:t.text,fontSize:18,fontWeight:'600'}}>What should we work on?</Text><Text style={{color:t.secondaryText,fontSize:12,marginTop:8}}>{settings.imageUri?'Background preview':'No background image'}</Text></View>
    </View>
    <View style={{flexDirection:'row',gap:10}}>{choice(busy?'Opening Photos…':settings.imageUri?'Change image':'Choose image',false,()=>{void pick();})}
      {settings.imageUri&&choice('Delete',false,()=>Alert.alert('Delete chat background?','Only the app’s copy is deleted. Your original photo stays in Photos.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{try {removeChatBackground();} catch {Alert.alert('Could not delete background');}}}]))}</View>
    <View><Text style={{color:t.secondaryText,fontSize:13,marginBottom:10}}>Background effect</Text><View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>{BACKGROUND_EFFECTS.map(effect=>choice(BACKGROUND_EFFECT_LABELS[effect],settings.effect===effect,()=>update({effect})))}</View></View>
    <View><Text style={{color:t.secondaryText,fontSize:13,marginBottom:10}}>Show on</Text><View style={{flexDirection:'row',gap:8}}>{choice('Empty chats only',settings.scope==='empty',()=>update({scope:'empty'}))}{choice('All sessions',settings.scope==='all',()=>update({scope:'all'}))}</View></View>
    {(['emptyOpacity','sessionOpacity'] as const).map(key=>{
      const label=key==='emptyOpacity'?'Empty chat visibility':'Session visibility';
      const value=(preview[key]??settings[key])*100;
      return <View key={key}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:t.text,fontSize:14}}>{label}</Text><Text style={{color:t.secondaryText,fontSize:13}}>{Math.round(value)}%</Text></View>
        <VisibilitySlider label={label} value={value} onChange={value=>setPreview(previous=>({...previous,[key]:value/100}))} onComplete={value=>update({[key]:value/100})}/></View>;
    })}
  </View>;
}
