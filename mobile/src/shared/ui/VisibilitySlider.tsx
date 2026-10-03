import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/useAppTheme';
export function VisibilitySlider({label,value,onChange:onValueChange,onComplete}:{label:string;value:number;onChange:(value:number)=>void;onComplete:(value:number)=>void}) {
  const t=useAppTheme();
  const onChange=(value:number)=>{onValueChange(value);onComplete(value);};
  return <View accessibilityLabel={label} style={{flexDirection:'row',alignItems:'center',gap:16}}>
    <Pressable accessibilityLabel={'Decrease '+label} onPress={()=>onChange(Math.max(5,value-5))} style={{minHeight:44,width:44,justifyContent:'center',alignItems:'center'}}><Text style={{color:t.text}}>−</Text></Pressable>
    <Text style={{color:t.text}}>{Math.round(value)}%</Text>
    <Pressable accessibilityLabel={'Increase '+label} onPress={()=>onChange(Math.min(65,value+5))} style={{minHeight:44,width:44,justifyContent:'center',alignItems:'center'}}><Text style={{color:t.text}}>+</Text></Pressable>
  </View>;
}
