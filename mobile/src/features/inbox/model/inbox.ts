export type IssueLabel={name:string;color:string};
export type IssueComment={id:string;author:string;time:string;body:string;quote?:string};
export type InboxIssue={
  id:string;number:number;title:string;repo:string;project:string;state:'open'|'closed';
  author:string;created:string;updated:string;labels:IssueLabel[];
  sections:{title:string;body:string}[];comments:IssueComment[];
};
export type InboxFilter='all'|'open'|'closed'|'bug'|'enhancement'|'unread';
// Desktop labels retain repository hex colors; mobile explicitly standardizes these two kinds.
export function issueLabelColor(label:IssueLabel):string {
  if(label.name.toLowerCase()==='bug')return '#D73A4A';
  if(label.name.toLowerCase()==='enhancement')return '#459BF7';
  const hex=label.color.trim().replace(/^#/,'');
  return /^[0-9a-fA-F]{6}$/.test(hex) ? '#'+hex : '#737373';
}
export function filterInbox(issues:InboxIssue[],query:string,filter:InboxFilter,readIds:string[]):InboxIssue[] {
  const needle=query.trim().toLowerCase();
  return issues.filter(issue=>
    (!needle||[issue.title,issue.repo,issue.author,String(issue.number),...issue.labels.map(label=>label.name)].join(' ').toLowerCase().includes(needle)) &&
    (filter==='all'||(filter==='unread' ? !readIds.includes(issue.id) : filter==='open'||filter==='closed' ? issue.state===filter : issue.labels.some(label=>label.name.toLowerCase()===filter))));
}
