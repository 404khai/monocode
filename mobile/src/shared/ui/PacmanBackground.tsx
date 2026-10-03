import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useAppTheme } from '@/shared/theme/useAppTheme';

// Desktop TerminalGridBackground geometry: 6px cells, 1px gaps, monochrome sprites.
const ghost = ['..####..','.######.','##.##.##','########','########','########','########','#.##.##.'];
export function PacmanBackground() {
  const { width } = useWindowDimensions();
  const theme = useAppTheme();
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg width={width} height={330}>
      {Array.from({length: 46}, (_, row) => Array.from({length: Math.ceil(width / 7)}, (_, col) =>
        <Rect key={row + ':' + col} x={col * 7} y={row * 7} width={6} height={6} rx={1}
          fill={theme.text} opacity={0.045 * (1 - row / 46)} />))}
      <Path d="M 282 105 L 308 87 A 32 32 0 1 0 308 123 Z" fill={theme.text} opacity={0.13}/>
      {[335,356,377].map(x => <Circle key={x} cx={x} cy={105} r={2} fill={theme.text} opacity={0.18}/>)}
      {ghost.map((row,y) => row.split('').map((cell,x) => cell === '#' ?
        <Rect key={y + ':' + x} x={54+x*4} y={53+y*4} width={3.4} height={3.4} fill={theme.text} opacity={0.1}/> : null))}
    </Svg>
  </View>;
}
