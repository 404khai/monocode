import { Image, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Image as SvgImage, LinearGradient, Mask, Pattern, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { chatBackgroundOpacity, type ChatBackgroundSettings } from '../model/chatBackground';
import { useChatBackground } from '../data/chatBackgroundStore';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { HERO_BACKGROUND_HEIGHT, BACKGROUND_FADE_START } from '@/shared/ui/backgroundGeometry';
export function ChatBackground({empty=false,settings:override,height=HERO_BACKGROUND_HEIGHT}:{empty?:boolean;settings?:ChatBackgroundSettings;height?:number}) {
  const stored=useChatBackground();
  const t=useAppTheme();
  const settings=override ?? stored;
  const opacity=chatBackgroundOpacity(settings,empty);
  if(!settings.imageUri||!opacity)return null;
  const textured=['dither','ascii','halftone','scanlines'].includes(settings.effect);
  return <View pointerEvents="none" accessibilityElementsHidden style={[StyleSheet.absoluteFill,{opacity,height,bottom:undefined,overflow:'hidden'}]}>
    {textured ? <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="backgroundTexture" width={settings.effect==='ascii' ? 32 : settings.effect==='scanlines' ? 2 : 6}
          height={settings.effect==='ascii' ? 20 : settings.effect==='scanlines' ? 4 : 6} patternUnits="userSpaceOnUse">
          {settings.effect==='ascii' ? <><SvgText x={0} y={9} fill="white" fontSize={9} fontFamily="Menlo">@+#.</SvgText><SvgText x={0} y={19} fill="white" fontSize={9} fontFamily="Menlo">.*#@</SvgText></> :
            settings.effect==='halftone' ? <Circle cx={3} cy={3} r={2.4} fill="white"/> :
            settings.effect==='scanlines' ? <Rect width={2} height={2.5} fill="white"/> :
            <><Rect x={0} y={0} width={3} height={3} fill="white"/><Rect x={3} y={3} width={3} height={3} fill="white"/></>}
        </Pattern>
        <Mask id="backgroundMask"><Rect width="100%" height="100%" fill="url(#backgroundTexture)"/></Mask>
      </Defs>
      <Rect width="100%" height="100%" fill="#000000"/>
      <SvgImage href={{uri:settings.imageUri}} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask="url(#backgroundMask)"/>
    </Svg> : settings.effect==='gradient-blur' ? <>
      <Image source={{uri:settings.imageUri}} resizeMode="cover" blurRadius={16} style={StyleSheet.absoluteFill}/>
      <Svg width="100%" height="100%"><Defs><LinearGradient id="hazeFade" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={t.canvas} stopOpacity={0}/><Stop offset="1" stopColor={t.canvas}/></LinearGradient></Defs><Rect width="100%" height="100%" fill="url(#hazeFade)"/></Svg>
    </> : <Image source={{uri:settings.imageUri}} resizeMode="cover" style={StyleSheet.absoluteFill}/>}
    {/* Same fade envelope as the game, regardless of the chosen image effect. */}
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      <Defs><LinearGradient id="photoBottomFade" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={t.canvas} stopOpacity={0}/>
        <Stop offset={BACKGROUND_FADE_START} stopColor={t.canvas} stopOpacity={0}/>
        <Stop offset="1" stopColor={t.canvas} stopOpacity={1}/>
      </LinearGradient></Defs>
      <Rect width="100%" height="100%" fill="url(#photoBottomFade)"/>
    </Svg>
  </View>;
}
