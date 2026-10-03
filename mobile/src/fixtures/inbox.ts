import type { InboxIssue } from '../features/inbox/model/inbox';
const repo='hardbeat920/monocode';
export const inboxFixtures:InboxIssue[]=[
  {id:'issue-674',number:674,title:'[Feature]: Show the Claude weekly limit in the usage panel',repo,project:'monocode',state:'open',author:'preview-contributor',created:'16 hours ago',updated:'16h',
    labels:[{name:'enhancement',color:'a2eeef'}],sections:[{title:'Why',body:'Keep the weekly limit visible beside the current usage window, so it is easier to plan a long agent session.'}],
    comments:[{id:'674-1',author:'preview-maintainer',time:'15h ago',body:'The compact usage strip can show both windows. We should also keep the expanded breakdown.'}]},
  {id:'issue-673',number:673,title:'bug: Pi agent not detected when installed via npm',repo,project:'monocode',state:'open',author:'preview-contributor',created:'17 hours ago',updated:'17h',
    labels:[{name:'bug',color:'d73a4a'}],sections:[{title:'Description',body:'The provider picker does not detect an npm-installed Pi agent after restarting the desktop app.'},{title:'Steps to reproduce',body:'1. Install the provider through npm.\n2. Restart MonoCode.\n3. Open the provider picker.'}],comments:[]},
  {id:'issue-668',number:668,title:'White screen on Arch + Wayland (AppImage v0.6.0)',repo,project:'monocode',state:'open',author:'preview-contributor',created:'18 hours ago',updated:'18h',
    labels:[{name:'bug',color:'d73a4a'}],sections:[{title:'Description',body:'The application window stays blank on launch in a Wayland session.'},{title:'Environment',body:'Arch Linux · Wayland · AppImage v0.6.0'}],comments:[]},
  {id:'issue-671',number:671,title:'[Feature]: Add calling ability to MonoCode',repo,project:'monocode',state:'open',author:'preview-contributor',created:'19 hours ago',updated:'19h',
    labels:[{name:'enhancement',color:'a2eeef'},{name:'discussion',color:'D4C5F9'}],sections:[{title:'Proposal',body:'Explore a voice-first way to ask questions and follow an agent while working away from the keyboard.'}],comments:[]},
  {id:'issue-611',number:611,title:'[Bug]: Code block shows the text of an earlier, similar response',repo,project:'monocode',state:'closed',author:'preview-contributor',created:'2 days ago',updated:'19h',
    labels:[{name:'bug',color:'d73a4a'}],sections:[{title:'Description',body:'A code block occasionally retains text from an earlier response.'}],
    comments:[{id:'611-1',author:'preview-maintainer',time:'19h ago',body:'The rendering regression is covered by a test in this fixture preview.'}]},
  {id:'issue-612',number:612,title:'(Mobile app support) PWA and/or iPhone / iOS support (companion client)',repo,project:'monocode',state:'open',author:'preview-contributor',created:'2 days ago',updated:'13h',
    labels:[{name:'enhancement',color:'a2eeef'},{name:'documentation',color:'0075ca'}],
    sections:[{title:'Why',body:'Agent runs are long. Being able to check on them, answer a permission prompt, or send a quick follow-up from a phone would make MonoCode much more useful away from the desk.'},{title:'Notes',body:'A companion client should keep project and workspace context, rather than starting a separate agent on the phone.'}],
    comments:[
      {id:'612-1',author:'preview-contributor',time:'2d ago',body:'Another option is a web companion served by the remote host. It could share the same connection and keep access to the desktop workspace.'},
      {id:'612-2',author:'preview-maintainer',time:'1d ago',body:'A native mobile client is worth exploring. The host should still own the agent process, approvals, and provider credentials.'},
      {id:'612-3',author:'preview-contributor',time:'13h ago',quote:'The host should still own the agent process, approvals, and provider credentials.',body:'That makes sense. Could a web companion use the same transport later?'},
      {id:'612-4',author:'preview-maintainer',time:'13h ago',quote:'Could a web companion use the same transport later?',body:'The current prototype focuses on native iOS screens. The connection boundary stays separate so we can evaluate other clients later.'},
    ]},
];
