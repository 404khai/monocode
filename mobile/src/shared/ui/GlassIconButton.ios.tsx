import { Button, Host, Image } from '@expo/ui/swift-ui';
import { accessibilityLabel, buttonStyle, disabled as disabledModifier, frame, glassEffect, tint } from '@expo/ui/swift-ui/modifiers';
import { useAppTheme } from '@/shared/theme/useAppTheme';
type Props={symbol:'xmark'|'plus'|'arrow.up'|'arrow.clockwise'|'chevron.down';label:string;onPress:()=>void;disabled?:boolean;square?:boolean;white?:boolean};
export function GlassIconButton({symbol,label,onPress,disabled=false,square=false,white=false}:Props) {
  const t=useAppTheme();
  return <Host style={{width:44,height:44}}>
    <Button onPress={onPress} modifiers={[buttonStyle('plain'),frame({width:44,height:44}),
      glassEffect({shape:square ? 'roundedRectangle' : 'circle',cornerRadius:square ? 11 : undefined,glass:{variant:'regular',interactive:true,...(white ? {tint:'#FFFFFF'} : {})}}),
      tint(white ? '#171717' : t.text),disabledModifier(disabled),accessibilityLabel(label)]}>
      <Image systemName={symbol} size={20} color={white ? '#171717' : t.text}/>
    </Button>
  </Host>;
}
