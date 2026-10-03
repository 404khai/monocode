import { Alert, Pressable, Text } from 'react-native';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import type { SessionProvider } from '../model/sessionSummary';
export type ComposerMenuProps={
  label:string;accessibilityLabel:string;choices:string[];onSelect:(index:number)=>void;
  provider?:SessionProvider;symbol?:'folder'|'point.topleft.down.curvedto.point.bottomright.up'|'shield.lefthalf.filled';width:number;glass?:boolean;compact?:boolean;trailingShield?:boolean;
};
export function ComposerMenu({label,accessibilityLabel,choices,onSelect,provider,width,glass=true,compact=false,trailingShield=false}:ComposerMenuProps) {
  const t=useAppTheme();
  return <Pressable accessibilityLabel={accessibilityLabel} onPress={()=>Alert.alert(accessibilityLabel,undefined,
    choices.map((text,index)=>({text,onPress:()=>onSelect(index)})))}
    style={{...(compact ? {maxWidth:width} : {width}),height:44,borderRadius:10,paddingHorizontal:8,backgroundColor:glass ? t.elevated : 'transparent',flexDirection:'row',gap:6,alignItems:'center'}}>
    {provider && <ProviderIcon provider={provider} color={t.text} size={20}/>}
    <Text numberOfLines={1} style={{color:t.text,fontSize:12,...(compact ? {flexShrink:1} : {flex:1})}}>{label}</Text>
    {trailingShield && <AppSymbol name="shield.lefthalf.filled" size={13} tintColor="#D9A321"/>}
  </Pressable>;
}
