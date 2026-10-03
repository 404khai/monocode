import { sessionFixtures } from './sessions';
import type { PickerProject } from '../features/projects/model/projectPicker';
// Reference project names plus current session projects; all host locations are fixtures.
const names=[...new Set(['monocode','aster','roadrunner','Keihatsu','campuscoin','wisp','test','t3code',...sessionFixtures.map(session=>session.project)])];
export const projectFixtures:PickerProject[]=names.map(name=>{
  const session=sessionFixtures.find(item=>item.project===name);
  return {id:name,name,parentPath:'~/Developer',branch:session?.branch ?? 'main',mascot:session?.projectMascot,color:session?.projectColor};
});
