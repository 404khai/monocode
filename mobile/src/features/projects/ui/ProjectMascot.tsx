import Svg, { Path } from 'react-native-svg';
import { MASCOT_GRID, projectMascot } from '@/features/arcade/model/projectMascots';
import { projectColor } from '../model/projectAppearance';
export function ProjectMascot({project,name,color,size=15}:{project:string;name?:string;color?:string;size?:number}) {
  const mascot=projectMascot(project,name);
  return <Svg width={size} height={size} viewBox={'0 0 '+MASCOT_GRID+' '+MASCOT_GRID} accessibilityElementsHidden>
    <Path d={mascot.restPath} fill={color ?? projectColor(project)}/>
  </Svg>;
}
