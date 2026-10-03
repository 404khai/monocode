import { Button, Host, HStack, Image, Menu, RNHostView, Text } from '@expo/ui/swift-ui';
import { accessibilityLabel, buttonStyle, font, frame, glassEffect, lineLimit, padding, tint } from '@expo/ui/swift-ui/modifiers';
import { View } from 'react-native';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import type { SessionProvider } from '../model/sessionSummary';
export type ComposerMenuProps={
  label:string;accessibilityLabel:string;choices:string[];onSelect:(index:number)=>void;
  provider?:SessionProvider;symbol?:'folder'|'point.topleft.down.curvedto.point.bottomright.up'|'shield.lefthalf.filled';width:number;glass?:boolean;compact?:boolean;trailingShield?:boolean;
};
export function ComposerMenu({label,accessibilityLabel:spoken,choices,onSelect,provider,symbol,width,glass=true,compact=false,trailingShield=false}:ComposerMenuProps) {
  const t=useAppTheme();
  return <Host matchContents={compact ? {horizontal:true} : false} style={{...(compact ? {maxWidth:width} : {width}),height:44}}>
    <Menu label={<HStack spacing={6}>
      {provider && <RNHostView matchContents><View style={{width:20,height:20}}><ProviderIcon provider={provider} color={t.text} size={20}/></View></RNHostView>}
      {symbol && <Image systemName={symbol} size={15} color={symbol==='shield.lefthalf.filled' ? '#D9A321' : t.secondaryText}/>}
      <Text modifiers={[font({size:12,weight:'medium'}),lineLimit(1),...(!compact ? [frame({maxWidth:Infinity,alignment:'leading'})] : [])]}>{label}</Text>
      {trailingShield && <Image systemName="shield.lefthalf.filled" size={13} color="#D9A321"/>}
      <Image systemName="chevron.down" size={10} color={t.secondaryText}/>
    </HStack>} modifiers={[
      buttonStyle('plain'),...(compact ? [padding({horizontal:8}),frame({height:40})] : [frame({width,height:40})]),
      ...(glass ? [glassEffect({shape:'roundedRectangle',cornerRadius:10,glass:{variant:'regular',interactive:true}})] : []),
      tint(t.text),accessibilityLabel(spoken),
    ]}>
      {choices.map((choice,index)=><Button key={choice} label={choice} onPress={()=>onSelect(index)}/>)}
    </Menu>
  </Host>;
}
