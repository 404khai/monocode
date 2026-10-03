export type ComposerMode='build'|'plan'|'operator'|'orchestrator';
export const COMPOSER_ADD_ACTIONS=[
  {id:'upload',title:'Upload file',description:'Attach files or images',symbol:'doc.badge.plus',color:'#EBEBEB'},
  {id:'plan',title:'Plan mode',description:'Review a plan before building',symbol:'lightbulb',color:'#D9A321'},
  {id:'operator',title:'Operator',description:'Give this thread access to MonoCode',symbol:'cursorarrow.rays',color:'#459BF7'},
  {id:'orchestrator',title:'Orchestrator v1',description:'Plan and coordinate agent work',symbol:'point.3.connected.trianglepath.dotted',color:'#B17FC4'},
] as const;
export type ComposerAddAction=typeof COMPOSER_ADD_ACTIONS[number]['id'];
export function nextComposerMode(current:ComposerMode,action:Exclude<ComposerAddAction,'upload'>):ComposerMode {
  return current===action ? 'build' : action;
}
