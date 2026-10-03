import type { SessionProvider } from '@/features/sessions/model/sessionSummary';
export const composerModels: {label:string;provider:SessionProvider;effort:string}[]=[
  {label:'GPT-6.1-Sol',provider:'codex',effort:'Low'},
  {label:'GPT-6.1-Sol',provider:'codex',effort:'Medium'},
  {label:'GPT-6.1-Sol',provider:'codex',effort:'High'},
  {label:'Claude Sonnet 5',provider:'claude',effort:'Default'},
  {label:'Composer 2.5',provider:'cursor',effort:'Default'},
  {label:'GLM 5',provider:'opencode',effort:'Default'},
];
export const usageFixture={
  provider:'codex' as const,updated:'19m ago',account:'Default account · Plus · preview@monocode.dev',
  windows:[
    {id:'five-hour',title:'5-hour limit',used:5,reset:'4h 11m',compactReset:'4h 12m'},
    {id:'weekly',title:'Weekly limit',used:11,reset:'6d 14h',compactReset:'6d 14h'},
  ],
  bankedResets:2,resetTitle:'Full reset (Weekly + 5 hr)',resetExpires:'19d 12h',
};
export const terminalFixture=[
  '$ pwd','/workspace/monocode','',
  '$ git status --short --branch','## feat/mobile-app','',
  'Preview terminal · No host connected.',
  'Commands are shown as sample output, not executed on this device.',
];
