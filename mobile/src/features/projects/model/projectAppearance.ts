// Desktop tabGroups.ts palette and hash, converted to native-compatible hex colors.
export const PROJECT_COLORS = ["#8b949c","#459bf7","#ea603e","#f4c025","#39c66d","#e25a9e","#b069d3","#37beb2","#ef8539"] as const;
export function projectColor(project:string) {
  let hash=0;
  for(let i=0;i<project.length;i++)hash=(hash*31+project.charCodeAt(i))>>>0;
  return PROJECT_COLORS[(hash%(PROJECT_COLORS.length-1))+1];
}
