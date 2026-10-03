export const noteFixtures=[
  {id:'mobile-plan',title:'Mobile companion plan',project:'monocode',updated:'2h ago',tags:['mobile','design'],body:'Keep agents on the desktop host.\n\nThe phone should let us follow threads, answer approvals, review issues, and send a quick follow-up. Preserve project and branch context.'},
  {id:'release-checklist',title:'Release checklist',project:'atlas',updated:'Yesterday',tags:['release'],body:'Review recent changes.\nCheck the indexing regression tests.\nVerify the release notes and provider compatibility.'},
];
// Names and schedule vocabulary follow desktop automationTemplates.ts.
export const automationFixtures=[
  {id:'find-critical-bugs',name:'Find critical bugs',project:'monocode',schedule:'Weekdays at 09:00',description:'Review recent commits for high-severity correctness bugs and safe fixes.'},
  {id:'scan-vulnerabilities',name:'Scan codebase for vulnerabilities',project:'atlas',schedule:'Monday at 10:00',description:'Inspect dependencies and recent changes for security risks.'},
];
