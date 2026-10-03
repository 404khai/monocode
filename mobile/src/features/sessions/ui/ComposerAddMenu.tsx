import { Alert } from 'react-native';
import { GlassIconButton } from '@/shared/ui/GlassIconButton';
import { COMPOSER_ADD_ACTIONS, type ComposerAddAction, type ComposerMode } from '../model/composerAdd';
export function ComposerAddMenu({mode,onSelect}:{mode:ComposerMode;onSelect:(action:ComposerAddAction)=>void}) {
  return <GlassIconButton square symbol="plus" label="Add to message" onPress={()=>Alert.alert('Add to message',undefined,
    COMPOSER_ADD_ACTIONS.map(action=>({text:(mode===action.id ? '✓ ' : '')+action.title+'\n'+action.description,onPress:()=>onSelect(action.id)})))}/>;
}
