import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { noteFixtures } from '@/fixtures/productivity';
export function NotesScreen() {
  const t=useAppTheme();
  const [notes,setNotes]=useState(noteFixtures);
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<string>();
  const note=notes.find(item=>item.id===selected);
  const filtered=notes.filter(item=>(item.title+' '+item.body+' '+item.project+' '+item.tags.join(' ')).toLowerCase().includes(query.toLowerCase()));
  const update=(patch:Partial<typeof noteFixtures[number]>)=>setNotes(items=>items.map(item=>item.id===selected ? {...item,...patch,updated:'Just now'} : item));
  return <>
    <Stack.Toolbar placement="right"><Stack.Toolbar.Button icon="plus" accessibilityLabel="New preview note" onPress={()=>{
      const id='note-'+Date.now();setNotes(items=>[{id,title:'Untitled note',project:'monocode',updated:'Just now',tags:[],body:''},...items]);setSelected(id);
    }}/></Stack.Toolbar>
    <ScrollView style={{flex:1,backgroundColor:t.canvas}} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
      <TextInput accessibilityLabel="Search notes" placeholder="Search notes" placeholderTextColor={t.tertiaryText} value={query} onChangeText={setQuery} style={{height:44,color:t.text,fontSize:15,marginBottom:12}}/>
      {filtered.map(item=><Pressable key={item.id} accessibilityRole="button" onPress={()=>setSelected(item.id)} style={{paddingVertical:18,borderBottomWidth:0.5,borderColor:t.line}}>
        <View style={{flexDirection:'row',alignItems:'center',gap:7}}><ProjectMascot project={item.project}/><Text style={{flex:1,color:t.secondaryText,fontSize:12}}>{item.project}</Text><Text style={{color:t.tertiaryText,fontSize:11}}>{item.updated}</Text></View>
        <Text style={{color:t.text,fontSize:18,fontWeight:'600',marginTop:8}}>{item.title}</Text>
        <Text numberOfLines={2} style={{color:t.secondaryText,fontSize:14,lineHeight:21,marginTop:7}}>{item.body}</Text>
        {!!item.tags.length&&<Text style={{color:t.tertiaryText,fontSize:11,marginTop:8}}>{item.tags.map(tag=>'#'+tag).join('  ')}</Text>}
      </Pressable>)}
      {!filtered.length&&<Text style={{color:t.secondaryText,paddingVertical:20}}>No notes match your search.</Text>}
      <Text style={{color:t.tertiaryText,fontSize:11,marginTop:24}}>Preview notes · Edits stay in memory until the app closes</Text>
    </ScrollView>
    <NativeSheet visible={!!note} onClose={()=>setSelected(undefined)}>
      <KeyboardAvoidingView style={{flex:1,backgroundColor:t.canvas}} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}><Text style={{color:t.text,fontSize:17,fontWeight:'600'}}>Note</Text><GlassIconButton symbol="xmark" label="Close note" onPress={()=>setSelected(undefined)}/></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingHorizontal:20,paddingBottom:30}}>
          <TextInput accessibilityLabel="Note title" value={note?.title ?? ''} onChangeText={title=>update({title})} style={{color:t.text,fontSize:25,fontWeight:'600',marginBottom:20}}/>
          <TextInput accessibilityLabel="Note body" multiline value={note?.body ?? ''} onChangeText={body=>update({body})} placeholder="Write a note…" placeholderTextColor={t.tertiaryText} style={{color:t.text,fontSize:16,lineHeight:25,minHeight:300,textAlignVertical:'top'}}/>
          <Text style={{color:t.tertiaryText,fontSize:11}}>Local preview · Not synced to your desktop</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </NativeSheet>
  </>;
}
