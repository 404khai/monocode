import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { NativeSheet } from '@/shared/ui/NativeSheet';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { filterPickerProjects, type PickerProject } from '../model/projectPicker';
import { ProjectMascot } from './ProjectMascot';
export type ProjectPickerProps={visible:boolean;selectedId:string;projects:PickerProject[];onSelect:(project:PickerProject)=>void;onClose:()=>void};
export function ProjectPickerSheet({visible,selectedId,projects,onSelect,onClose}:ProjectPickerProps) {
  const t=useAppTheme();
  const [query,setQuery]=useState('');
  useEffect(()=>{if(!visible)setQuery('');},[visible]);
  const filtered=filterPickerProjects(projects,query,selectedId);
  return <NativeSheet visible={visible} onClose={onClose} detents={['medium','large']}>
    <View style={{flex:1,backgroundColor:t.canvas,padding:20}}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{color:t.text,fontSize:19,fontWeight:'600'}}>Projects</Text><GlassIconButton symbol="xmark" label="Close project picker" onPress={onClose}/></View>
      <TextInput accessibilityLabel="Search projects" placeholder="Search projects…" placeholderTextColor={t.tertiaryText} autoCapitalize="none" autoCorrect={false} value={query} onChangeText={setQuery} style={{height:48,color:t.text,fontSize:16}}/>
      <ScrollView keyboardShouldPersistTaps="handled">
        {filtered.map(project=><Pressable key={project.id} accessibilityRole="button" accessibilityState={{selected:project.id===selectedId}}
          onPress={()=>{onSelect(project);onClose();}} style={{flexDirection:'row',alignItems:'center',gap:12,padding:12,minHeight:64,borderRadius:12,backgroundColor:project.id===selectedId ? t.elevated : 'transparent'}}>
          {project.id===selectedId ? <AppSymbol name="checkmark" size={24} tintColor={t.text}/> : <ProjectMascot project={project.name} name={project.mascot} color={project.color} size={24}/>}
          <View style={{flex:1}}><Text numberOfLines={1} style={{color:t.text,fontSize:17,fontWeight:'600'}}>{project.name}</Text><Text style={{color:t.secondaryText,fontSize:12,marginTop:4}}>{project.parentPath}</Text></View>
        </Pressable>)}
        {!filtered.length&&<Text style={{color:t.secondaryText,paddingVertical:20}}>No projects match your search.</Text>}
      </ScrollView>
      <Pressable accessibilityRole="button" onPress={()=>Alert.alert('New project','Connect a host to choose or create a project.')} style={{minHeight:48,flexDirection:'row',alignItems:'center',gap:10}}><AppSymbol name="plus" tintColor={t.text}/><Text style={{color:t.text,fontSize:16}}>New project</Text></Pressable>
      <Text style={{color:t.tertiaryText,fontSize:11}}>Preview projects · No host connected</Text>
    </View>
  </NativeSheet>;
}
