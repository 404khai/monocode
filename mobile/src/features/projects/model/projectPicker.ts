export type PickerProject={id:string;name:string;parentPath:string;branch:string;mascot?:string;color?:string};
export function filterPickerProjects(projects:PickerProject[],query:string,selectedId:string):PickerProject[] {
  const needle=query.trim().toLowerCase();
  const matches=projects.filter(project=>(project.name+' '+project.parentPath).toLowerCase().includes(needle));
  return [...matches.filter(project=>project.id===selectedId),...matches.filter(project=>project.id!==selectedId)];
}
