import { Pressable } from 'react-native';
import { AppSymbol } from './AppSymbol';
import { useAppTheme } from '@/shared/theme/useAppTheme';
type Props={symbol:'xmark'|'plus'|'arrow.up'|'arrow.clockwise'|'chevron.down';label:string;onPress:()=>void;disabled?:boolean;square?:boolean;white?:boolean};
export function GlassIconButton({symbol,label,onPress,disabled=false,square=false,white=false}:Props) {
  const t=useAppTheme();
  return <Pressable accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={{height:44,width:44,borderRadius:square ? 11 : 22,backgroundColor:white ? '#FFFFFF' : t.elevated,alignItems:'center',justifyContent:'center',opacity:disabled ? 0.4 : 1}}>
    <AppSymbol name={symbol} tintColor={white ? '#171717' : t.text} size={20}/>
  </Pressable>;
}
