import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { WORKING_FRAMES, WORKING_FRAME_MS, workingCells } from '../model/workingPixels';

// Desktop TerminalSpinner.tsx: same ten frames and 80ms cadence, drawn as pixel cells.
export function WorkingPixels() {
  const t=useAppTheme();
  const [frame,setFrame]=useState(0);
  const [focused,setFocused]=useState(false);
  const [active,setActive]=useState(AppState.currentState==='active');
  const [reduceMotion,setReduceMotion]=useState(true);
  useFocusEffect(useCallback(()=>{setFocused(true);return()=>setFocused(false);},[]));
  useEffect(()=>{
    let mounted=true;
    AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(mounted)setReduceMotion(value);});
    const motion=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduceMotion);
    const lifecycle=AppState.addEventListener('change',state=>setActive(state==='active'));
    return()=>{mounted=false;motion.remove();lifecycle.remove();};
  },[]);
  useEffect(()=>{
    if(!focused||!active||reduceMotion)return;
    const timer=setInterval(()=>setFrame(value=>(value+1)%WORKING_FRAMES.length),WORKING_FRAME_MS);
    return()=>clearInterval(timer);
  },[focused,active,reduceMotion]);
  return <Svg width={12} height={16} viewBox="0 0 8 14" accessibilityElementsHidden>
    {workingCells(frame).map(([x,y])=><Rect key={x+','+y} x={x*4} y={y*3.5} width={2.5} height={2.5} fill={t.accent}/>)}
  </Svg>;
}
