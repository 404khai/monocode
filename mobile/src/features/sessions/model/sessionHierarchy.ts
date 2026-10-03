import type { SessionSummary } from './sessionSummary';

export type ThreadGroup = {id:string;name:string;sessions:SessionSummary[]};
export type WorkspaceThreads = {
  id:string;workspace:SessionSummary['workspace'];groups:ThreadGroup[];pinned:SessionSummary[];sessions:SessionSummary[];count:number;
};
export type ProjectThreads = {id:string;name:string;mascot?:string;color:string;workspaces:WorkspaceThreads[];count:number};

/** Project/workspace boundaries are identities, not branch names or folder labels. */
export function groupSessionsByWorkspace(sessions:SessionSummary[]):ProjectThreads[] {
  const projects:ProjectThreads[]=[];
  for(const session of sessions) {
    let project=projects.find(p=>p.id===session.project);
    if(!project) {
      project={id:session.project,name:session.project,mascot:session.projectMascot,color:session.projectColor,workspaces:[],count:0};
      projects.push(project);
    }
    let workspace=project.workspaces.find(w=>w.workspace.id===session.workspace.id);
    if(!workspace) {
      workspace={id:JSON.stringify([project.id,session.workspace.id]),workspace:session.workspace,groups:[],pinned:[],sessions:[],count:0};
      project.workspaces.push(workspace);
    }
    project.count++;workspace.count++;
    if(session.threadGroup) {
      const id=JSON.stringify([project.id,session.workspace.id,session.threadGroup.id]);
      let group=workspace.groups.find(g=>g.id===id);
      if(!group) {group={id,name:session.threadGroup.name,sessions:[]};workspace.groups.push(group);}
      group.sessions.push(session);
    } else if(session.pinned) workspace.pinned.push(session);
    else workspace.sessions.push(session);
  }
  return projects;
}
