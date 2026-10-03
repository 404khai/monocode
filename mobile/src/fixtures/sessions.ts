import { projectColor } from '../features/projects/model/projectAppearance';
import type { SessionSummary } from '@/features/sessions/model/sessionSummary';

export const sessionFixtures:SessionSummary[]=[
  {id:'session-ios-home',title:'Design iOS Session Homepage',project:'monocode',projectColor:projectColor('monocode'),
    branch:'feat/mobile-app',workspace:{id:'mobile',name:'Mobile app',kind:'worktree'},threadGroup:{id:'mobile-design',name:'Mobile'},
    provider:'claude',model:'Claude Sonnet 5',state:'idle',updatedLabel:'1m'},
  {id:'session-mobile-foundation',title:'Establish Monocode Mobile Foundation',project:'monocode',projectColor:projectColor('monocode'),
    branch:'feat/mobile-app',workspace:{id:'mobile',name:'Mobile app',kind:'worktree'},threadGroup:{id:'mobile-design',name:'Mobile'},
    provider:'codex',model:'GPT-6.1-Sol',state:'idle',updatedLabel:'12h 13m'},
  {id:'session-issue-674',title:'Work on Issue 674',project:'monocode',projectColor:projectColor('monocode'),
    branch:'feat/mobile-app',workspace:{id:'mobile',name:'Mobile app',kind:'worktree'},pinned:true,
    provider:'codex',model:'GPT-6.1-Sol',state:'idle',updatedLabel:'12h 16m',linkedPullRequest:674},
  {id:'session-mcp-server',title:'Provider-wide MCP Settings',project:'monocode',projectColor:projectColor('monocode'),
    branch:'feat/mcp-server',workspace:{id:'checkout',name:'Current checkout',kind:'checkout'},
    provider:'opencode',model:'GLM 5',state:'idle',updatedLabel:'3h',linkedPullRequest:204},
  {
    id: 'session-index-cache', title: 'Make file indexing incremental', project: 'atlas', projectColor: projectColor('atlas'),
    branch:'perf/index-cache',workspace:{id:'indexing',name:'Indexing',kind:'worktree'},
    provider:'codex',model:'GPT-6.1-Sol',state:'working',updatedLabel:'8m',linkedPullRequest:86},
  {id:'session-search',title:'Improve repository search',project:'atlas',projectColor:projectColor('atlas'),
    branch:'main',workspace:{id:'checkout',name:'Current checkout',kind:'checkout'},
    provider:'claude',model:'Claude Sonnet 5',state:'idle',updatedLabel:'2h'},
  {id:'session-flaky-test',title:'Trace the flaky sync test',project:'roadrunner',projectColor:projectColor('relay'),
    branch:'fix/sync-race',workspace:{id:'checkout',name:'Current checkout',kind:'checkout'},
    provider:'cursor',model:'Composer 2.5',state:'working',updatedLabel:'14m'},
  {id:'session-command-palette',title:'Polish command palette navigation',project:'canvas',projectColor:projectColor('canvas'),
    branch:'ui/command-palette',workspace:{id:'checkout',name:'Current checkout',kind:'checkout'},
    provider:'opencode',model:'GLM 5',state:'idle',updatedLabel:'3h',linkedPullRequest:204},
];
