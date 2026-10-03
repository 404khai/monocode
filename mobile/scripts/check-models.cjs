// Development-only smoke checks; never imported by the mobile runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports:{}};
  cache.set(file, module);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText;
  const run = vm.runInThisContext('(function(exports,require,module){'+compiled+'\n})', {filename:file});
  run(module.exports, name => {
    assert.ok(name.startsWith('.'), 'Only portable relative imports belong in these models');
    return load(path.resolve(path.dirname(file), name));
  }, module);
  return module.exports;
}
let seed=0x5eed;
const random=Math.random;
Math.random=()=> {
  seed=(seed+0x6d2b79f5)|0;
  let n=Math.imul(seed^(seed>>>15),1|seed);
  n=(n+Math.imul(n^(n>>>7),61|n))^n;
  return ((n^(n>>>14))>>>0)/4294967296;
};
try {
  const {createPacmanArcade}=load(path.join(root,'src/features/arcade/model/pacmanArcade.ts'));
  for(const [cols,rows] of [[58,47],[58,33],[46,24]]) {
    const game=createPacmanArcade();
    game.resize(cols,rows);
    const buffer=new Float32Array(cols*rows);
    const first=game.sprites()[0];
    let moved=false,peakScore=0,hadPickup=false,hadSpeech=false;
    for(let i=0;i<2400;i++) {
      game.step(50);
      buffer.fill(0);
      game.stamp(buffer,cols,rows);
      assert.ok(buffer.every(value=>Number.isFinite(value)&&value>=0&&value<=1));
      const pac=game.sprites().find(sprite=>sprite.kind==='pacman');
      assert.ok(pac && Number.isFinite(pac.cx)&&Number.isFinite(pac.cy));
      moved ||= pac.cx!==first.cx || pac.cy!==first.cy;
      peakScore=Math.max(peakScore,game.score());
      hadPickup ||= !!game.logoPickup();
      hadSpeech ||= !!game.speechBubble();
    }
    assert.ok(moved,'Autoplay must move Pacman');
    assert.ok(peakScore>0,'Pacman must eat pellets and score');
    assert.ok(hadPickup,'Desktop provider pickups must spawn');
    assert.ok(hadSpeech,'Desktop speech events must remain active');
    game.takeControl();assert.equal(game.controlled(),true);
    game.steer(1,0);game.step(50);
    game.releaseControl();assert.equal(game.controlled(),false);
    console.log('Pacman passed: '+cols+'x'+rows+', peak score '+peakScore);
  }
  const desktop=fs.readFileSync(path.join(root,'../src/features/terminal/arcade/pacmanArcade.ts'),'utf8')
    .replace('"../../projects/model/projectMascots"','"./projectMascots"')
    .replace('"../../sessions/model/session"','"./harnesses"');
  assert.equal(fs.readFileSync(path.join(root,'src/features/arcade/model/pacmanArcade.ts'),'utf8').trim(),desktop.trim(),
    'Mobile engine must match desktop apart from portable imports');
  const settings=load(path.join(root,'src/features/settings/model/settingsCatalog.ts'));
  assert.equal(settings.SETTINGS_SECTIONS.length,11);
  assert.equal(settings.SETTINGS_INDEX.length,44);
  assert.equal(settings.KEYBINDINGS.length,46);
  assert.equal(new Set(settings.SETTINGS_INDEX.map(row=>row.id)).size,44);
  for(const row of settings.SETTINGS_INDEX) assert.ok(settings.SETTINGS_SECTIONS.some(section=>section.id===row.section));
  console.log('Settings passed: 11 sections, 44 controls, 46 desktop shortcut references');
  const {projectMascot,PROJECT_MASCOTS}=load(path.join(root,'src/features/arcade/model/projectMascots.ts'));
  const {projectColor,PROJECT_COLORS}=load(path.join(root,'src/features/projects/model/projectAppearance.ts'));
  for(const project of ['monocode','atlas','relay','canvas']) {
    assert.equal(projectMascot(project).name,projectMascot(project).name);
    assert.ok(PROJECT_MASCOTS.some(mascot=>mascot.name===projectMascot(project).name));
    assert.ok(PROJECT_COLORS.includes(projectColor(project)));
  }
  assert.equal(projectMascot('monocode','ghost').name,'ghost');
  const providerSource=fs.readFileSync(path.join(root,'src/shared/ui/ProviderIcon.tsx'),'utf8');
  const logos=JSON.parse(providerSource.match(/const logos = ([\s\S]*?);\nexport/)[1]);
  assert.equal(logos.codex.trim(),fs.readFileSync(path.join(root,'../src/assets/providers/codex.svg'),'utf8').trim());
  console.log('Project mascot assignments and original desktop Codex SVG passed');
  const {sessionFixtures}=load(path.join(root,'src/fixtures/sessions.ts'));
  const {groupSessionsByWorkspace}=load(path.join(root,'src/features/sessions/model/sessionHierarchy.ts'));
  const hierarchy=groupSessionsByWorkspace(sessionFixtures);
  assert.equal(hierarchy.length,4);
  assert.equal(hierarchy.reduce((total,project)=>total+project.count,0),sessionFixtures.length);
  const groupedIds=[];
  for(const project of hierarchy) for(const workspace of project.workspaces) {
    for(const session of [...workspace.sessions,...workspace.pinned,...workspace.groups.flatMap(group=>group.sessions)]) {
      assert.equal(session.project,project.id);
      assert.equal(session.workspace.id,workspace.workspace.id);
      groupedIds.push(session.id);
    }
  }
  assert.equal(new Set(groupedIds).size,sessionFixtures.length);
  const mobileWorkspace=hierarchy.find(project=>project.id==='monocode').workspaces.find(workspace=>workspace.workspace.id==='mobile');
  assert.equal(mobileWorkspace.groups[0].name,'Mobile');
  assert.equal(mobileWorkspace.groups[0].sessions.length,2);
  const monocode=hierarchy.find(project=>project.id==='monocode');
  assert.equal(monocode.count,3);
  assert.equal(monocode.workspaces.flatMap(workspace=>workspace.groups).length,1);
  assert.equal(monocode.workspaces.flatMap(workspace=>workspace.pinned).length,1);
  assert.equal(monocode.workspaces.flatMap(workspace=>workspace.sessions).length,0);
  for(const project of hierarchy.filter(project=>project.id!=='monocode')) {
    assert.ok(project.count>=1&&project.count<=2);
    assert.equal(project.workspaces.flatMap(workspace=>workspace.groups).length,0);
    assert.equal(project.workspaces.flatMap(workspace=>workspace.pinned).length,0);
  }
  assert.ok(new Set(sessionFixtures.map(session=>session.provider)).size>=4);
  const sample=sessionFixtures[0];
  const collisions=groupSessionsByWorkspace([
    {...sample,id:'a',workspace:{id:'same',name:'Same',kind:'worktree'},threadGroup:{id:'group',name:'Same'}},
    {...sample,id:'b',workspace:{id:'other',name:'Same',kind:'worktree'},threadGroup:{id:'group',name:'Same'}},
    {...sample,id:'c',project:'other',workspace:{id:'same',name:'Same',kind:'worktree'},threadGroup:{id:'group',name:'Same'}},
  ]);
  assert.equal(new Set(collisions.flatMap(project=>project.workspaces.flatMap(workspace=>workspace.groups.map(group=>group.id)))).size,3);
  assert.deepEqual(groupSessionsByWorkspace([]),[]);
  const pixels=load(path.join(root,'src/features/sessions/model/workingPixels.ts'));
  const desktopSpinner=fs.readFileSync(path.join(root,'../src/features/sessions/ui/TerminalSpinner.tsx'),'utf8');
  const desktopFrames=[...desktopSpinner.match(/const FRAMES = \[([\s\S]*?)\]/)[1].matchAll(/"([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(pixels.WORKING_FRAMES,desktopFrames);
  assert.equal(pixels.WORKING_FRAME_MS,80);
  assert.deepEqual(pixels.workingCells(0),pixels.workingCells(10));
  for(let frame=0;frame<10;frame++) assert.ok(pixels.workingCells(frame).length>=2);
  console.log('Session project/workspace/group boundaries and desktop working animation passed');
  const composer=load(path.join(root,'src/fixtures/composer.ts'));
  assert.equal(composer.composerModels[0].provider,'codex');
  assert.ok(composer.composerModels.some(model=>model.effort==='Medium'));
  assert.ok(composer.composerModels.some(model=>model.effort==='High'));
  for(const window of composer.usageFixture.windows) {
    assert.ok(window.used>=0&&window.used<=100);
    assert.ok(window.reset.length>0&&window.compactReset.length>0);
  }
  assert.deepEqual(composer.usageFixture.windows.map(window=>100-window.used),[95,89]);
  assert.equal(composer.usageFixture.bankedResets,2);
  assert.ok(composer.terminalFixture.some(line=>line.includes('not executed')));
  console.log('Composer choices, usage windows, banked resets, and terminal fixtures passed');
} finally {
  Math.random=random;
}
