import type { SessionSummary } from './sessionSummary';
export type ChatActivity={id:string;kind:'run'|'read'|'edit';label:string;detail:string};
export type ChatMessage={id:string;role:'user'|'assistant';text:string;time:string;local?:boolean;activity?:ChatActivity[];summary?:string};
export function hasMoreChatBelow(contentHeight:number,viewportHeight:number,offsetY:number):boolean {
  if(viewportHeight<=0||contentHeight<=viewportHeight)return false;
  return contentHeight-viewportHeight-Math.max(0,offsetY)>24;
}
export function createThreadFixture(session:SessionSummary):ChatMessage[] {
  return [
    {id:'request',role:'user',text:session.title+'. Keep the existing MonoCode design language and project context.',time:'12:28'},
    {id:'review',role:'assistant',text:'I’ll review the current implementation in '+session.project+', identify the relevant pieces, and keep the changes scoped to '+session.branch+'.',time:'12:29',summary:'Reviewed the project · Ran 2 commands',activity:[
      {id:'status',kind:'run',label:'git status --short --branch',detail:'## '+session.branch+'\nSample command output · Not executed'},
      {id:'files',kind:'read',label:'mobile/AGENTS.md',detail:'Sample file read\nFeature-owned screens, native iOS controls, and fixture-backed interactions.'},
    ]},
    {id:'followup',role:'user',text:'Keep the existing controls and spacing. Show the working state, and make the details easy to review without losing the thread.',time:'12:30'},
    {id:'progress',role:'assistant',text:'The layout keeps the main conversation readable, with the supporting work tucked into expandable activity rows. Project and branch context remain visible, and controls stay within reach.\n\nI’m checking the interaction states next: opening details, returning to the thread, and keeping the draft intact.',time:'12:31',summary:'Ran 2 commands · Edited NewSessionSheet.tsx · Read reference',activity:[
      {id:'diff',kind:'run',label:'git status --short; cat mobile/src/features/sessions/ui/NewSessionSheet.tsx; git diff -- mobile/src/fixtures/sessions.ts',detail:'Sample command output · Not executed\n M mobile/src/features/sessions/ui/NewSessionSheet.tsx\n\nconst heroHeight = 400;\nconst questionSize = 30;'},
      {id:'welcome',kind:'edit',label:'mobile/src/features/sessions/ui/NewSessionSheet.tsx',detail:'Sample patch · Not applied\n- fontSize: 26\n+ fontSize: 30\n\nWelcome text sits below the game; the composer remains at the bottom.'},
      {id:'checks',kind:'run',label:'npm run typecheck && npm run test:models && git diff --check',detail:'Sample command output · Not executed\nTypeScript check completed.\nPortable model checks passed.\nNo whitespace errors.'},
      {id:'reference',kind:'read',label:'reference/session_chat.png',detail:'Sample reference read\nmobile/assets/reference/session_chat.png\n\nCompact message actions, command activity rails, and a fixed composer.'},
    ]},
    {id:'refinement',role:'user',text:'The composer should remain at the bottom. Only show the down arrow when there is more conversation below where I am reading.',time:'12:32'},
    {id:'result',role:'assistant',text:'The composer stays anchored below the conversation. Activity groups can be opened inline, and the down-arrow control appears only when newer content is below the visible area.\n\nTapping the arrow returns to the latest message. It disappears at the bottom and stays hidden when the conversation fits on screen.\n\nThis is a sample transcript. No commands shown here were executed, and no agent is connected.',time:'12:33',summary:'Edited README.md · Ran 2 commands',activity:[
      {id:'layout',kind:'edit',label:'mobile/design/README.md',detail:'Sample edit · Not applied\nDocument native soft scroll edges, compact action rows, and local background preferences.'},
      {id:'verify',kind:'run',label:'git diff --check && git add mobile/src mobile/README.md && git commit -m "Polish mobile chat" && git push origin feat/mobile-app',detail:'Sample command output · Not executed\nThis preview does not stage, commit, or push any files.'},
      {id:'status-final',kind:'run',label:'git status --short',detail:'Sample command output · Not executed\nNo remote repository is connected to this preview.'},
    ]},
  ];
}
