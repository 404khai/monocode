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
} finally {
  Math.random=random;
}
