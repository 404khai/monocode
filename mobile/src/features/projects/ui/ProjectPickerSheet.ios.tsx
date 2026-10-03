import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Host, HStack, Image, List, RNHostView, Text, TextField, VStack } from '@expo/ui/swift-ui';
import { accessibilityLabel, background, buttonStyle, font, foregroundColor, frame, glassEffect, lineLimit, listRowBackground, listRowSeparator, listStyle, padding, scrollContentBackground, scrollEdgeEffectStyle, textInputAutocapitalization, autocorrectionDisabled, tint } from '@expo/ui/swift-ui/modifiers';
import { NativeSheet } from '@/shared/ui/NativeSheet';
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
    <View style={{flex:1,backgroundColor:t.canvas}}>
      <Host style={{flex:1}}>
        <VStack spacing={0} modifiers={[frame({maxWidth:Infinity,maxHeight:Infinity}),tint(t.text)]}>
          <HStack spacing={12} modifiers={[padding({horizontal:20,top:18,bottom:8})]}>
            <Text modifiers={[font({size:19,weight:'semibold'}),foregroundColor(t.text),frame({maxWidth:Infinity,alignment:'leading'})]}>Projects</Text>
            <Button onPress={onClose} modifiers={[buttonStyle('plain'),frame({width:44,height:44}),glassEffect({shape:'circle',glass:{variant:'regular',interactive:true}}),accessibilityLabel('Close project picker')]}>
              <Image systemName="xmark" size={18} color={t.text}/>
            </Button>
          </HStack>
          <HStack spacing={10} modifiers={[padding({horizontal:20,bottom:12}),frame({minHeight:44})]}>
            <Image systemName="magnifyingglass" size={18} color={t.secondaryText}/>
            <TextField key={visible ? 'open' : 'closed'} placeholder="Search projects…" onTextChange={setQuery}
              modifiers={[textInputAutocapitalization('never'),autocorrectionDisabled(),foregroundColor(t.text),accessibilityLabel('Search projects')]}/>
          </HStack>
          <List modifiers={[listStyle('plain'),scrollContentBackground('hidden'),background(t.canvas),scrollEdgeEffectStyle('soft','top')]}>
            {filtered.map(project=><Button key={project.id} onPress={()=>{onSelect(project);onClose();}} modifiers={[
              buttonStyle('plain'),listRowSeparator('hidden'),listRowBackground(project.id===selectedId ? t.elevated : t.canvas),
              accessibilityLabel(project.name+(project.id===selectedId ? ', selected' : '')+', '+project.parentPath),
            ]}>
              <HStack spacing={12} modifiers={[frame({minHeight:48,maxWidth:Infinity,alignment:'leading'})]}>
                {project.id===selectedId ? <Image systemName="checkmark" size={20} color={t.text}/> :
                  <RNHostView matchContents><View style={{width:24,height:24}}><ProjectMascot project={project.name} name={project.mascot} color={project.color} size={24}/></View></RNHostView>}
                <VStack alignment="leading" spacing={4} modifiers={[frame({maxWidth:Infinity,alignment:'leading'})]}>
                  <Text modifiers={[font({size:17,weight:'semibold'}),foregroundColor(t.text),lineLimit(1)]}>{project.name}</Text>
                  <Text modifiers={[font({size:12}),foregroundColor(t.secondaryText),lineLimit(1)]}>{project.parentPath}</Text>
                </VStack>
              </HStack>
            </Button>)}
            {!filtered.length&&<Text modifiers={[foregroundColor(t.secondaryText),padding({vertical:20}),listRowSeparator('hidden')]}>No projects match your search.</Text>}
          </List>
          <Button systemImage="plus" label="New project" onPress={()=>Alert.alert('New project','Connect a MonoCode host to choose or create a project. The projects shown here are sample host folders.')}
            modifiers={[buttonStyle('plain'),frame({minHeight:48,maxWidth:Infinity,alignment:'leading'}),padding({horizontal:20}),accessibilityLabel('New project')]}/>
          <Text modifiers={[font({size:11}),foregroundColor(t.secondaryText),padding({horizontal:20,bottom:16})]}>Preview projects · No host connected</Text>
        </VStack>
      </Host>
    </View>
  </NativeSheet>;
}
