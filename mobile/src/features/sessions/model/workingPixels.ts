// Desktop TerminalSpinner.tsx's exact sequence and cadence.
export const WORKING_FRAMES=['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
export const WORKING_FRAME_MS=80;
const DOTS:[number,number][]=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[0,3],[1,3]];
export function workingCells(frame:number):[number,number][] {
  const bits=WORKING_FRAMES[frame%WORKING_FRAMES.length].charCodeAt(0)-0x2800;
  return DOTS.filter((_,index)=>(bits&(1<<index))!==0);
}
