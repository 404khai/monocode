import { Host, Slider } from '@expo/ui/swift-ui';
import { accessibilityLabel, tint } from '@expo/ui/swift-ui/modifiers';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { useRef } from 'react';
export function VisibilitySlider({label,value,onChange,onComplete}:{label:string;value:number;onChange:(value:number)=>void;onComplete:(value:number)=>void}) {
  const t=useAppTheme();
  const latest=useRef(value);latest.current=value;
  return <Host style={{height:44}}><Slider value={value} min={5} max={65} step={1} onValueChange={value=>{latest.current=value;onChange(value);}} onEditingChanged={editing=>{if(!editing)onComplete(latest.current);}} modifiers={[tint(t.accent),accessibilityLabel(label)]}/></Host>;
}
