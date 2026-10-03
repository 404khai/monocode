import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, AppState, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { MASCOT_GRID, projectMascot } from '@/features/arcade/model/projectMascots';
import type { SessionSummary } from '../model/sessionSummary';
import { COIN_FACE_PATH, COIN_EDGE_PATH, COIN_HOVER, COIN_SIZE, COLLECT_POP_MS, COLLECT_POP_PX, RUNNER_SIZE, coinCollected, nextCoinDelay, pickCoinX, poseAt, stepAlong, type Coin } from '../model/composerRunner';

// Desktop runner physics and two-frame project sprites; native layout replaces DOM portals.
export function ComposerRunner({session}:{session:SessionSummary}) {
  const [width,setWidth]=useState(0),[focused,setFocused]=useState(false),[active,setActive]=useState(AppState.currentState==='active'),[reduced,setReduced]=useState(true);
  const [frame,setFrame]=useState({x:10,y:0,facing:1,talk:false,coin:null as null|{x:number;y:number;opacity:number;edge:boolean}});
  useFocusEffect(useCallback(()=>{setFocused(true);return()=>setFocused(false);},[]));
  useEffect(()=>{
    let live=true;AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(live)setReduced(value);});
    const motion=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced),lifecycle=AppState.addEventListener('change',state=>setActive(state==='active'));
    return()=>{live=false;motion.remove();lifecycle.remove();};
  },[]);
  useEffect(()=>{
    if(!width||!focused||!active||reduced)return;
    let along=0,facing:1|-1=1,last=Date.now(),next=last+nextCoinDelay(true),coin:(Coin&{collectedAt?:number})|null=null;
    const timer=setInterval(()=>{
      const now=Date.now(),dt=Math.min(48,now-last);last=now;
      ({along,facing}=stepAlong(along,facing,dt,Math.max(0,width-20)));
      let pose=poseAt(along,facing,width,null,coin?[coin]:[]);
      if(!coin&&now>=next){const x=pickCoinX(width,pose.x,null);if(x!==null)coin={id:now,x,height:COIN_HOVER};else next=now+2000;}
      pose=poseAt(along,facing,width,null,coin?[coin]:[]);
      if(coin&&coin.collectedAt===undefined&&coinCollected(pose,coin)){coin.collectedAt=now;next=now+nextCoinDelay(false);}
      const pop=coin?.collectedAt===undefined?0:Math.min(1,(now-coin.collectedAt)/COLLECT_POP_MS);
      setFrame({x:pose.x,y:pose.y,facing:pose.facing,talk:Math.floor(now/230)%2===1,coin:coin?{x:coin.x,y:coin.height+Math.sin(now/180)*2+COLLECT_POP_PX*pop,opacity:1-pop,edge:Math.floor(now/160)%2===1}:null});
      if(coin&&pop>=1&&!pose.airborne)coin=null;
    },32);
    return()=>clearInterval(timer);
  },[width,focused,active,reduced]);
  const mascot=projectMascot(session.project,session.projectMascot);
  const moving=!reduced&&focused&&active;
  return <View pointerEvents="none" accessibilityElementsHidden onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={{height:58,marginHorizontal:14}}>
    {moving&&frame.coin&&<View style={{position:'absolute',left:frame.coin.x-COIN_SIZE/2,bottom:frame.coin.y-COIN_SIZE/2,opacity:frame.coin.opacity}}><Svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 8 8"><Path d={frame.coin.edge?COIN_EDGE_PATH:COIN_FACE_PATH} fill="#E9B949"/></Svg></View>}
    <View style={{position:'absolute',left:(moving?frame.x:10)-RUNNER_SIZE/2,bottom:moving?frame.y+(frame.talk?1:0):0,transform:[{scaleX:moving?frame.facing:1}]}}>
      <Svg width={RUNNER_SIZE} height={RUNNER_SIZE} viewBox={'0 0 '+MASCOT_GRID+' '+MASCOT_GRID}><Path d={moving&&frame.talk?mascot.talkPath:mascot.restPath} fill={session.projectColor}/></Svg>
    </View>
  </View>;
}
