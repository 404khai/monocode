import { useEffect, useSyncExternalStore } from 'react';
import { getBackgroundFileSystem } from '@/platform/chatNativeCapabilities';
import { DEFAULT_CHAT_BACKGROUND, normalizeChatBackground, type ChatBackgroundSettings } from '../model/chatBackground';
let settings=DEFAULT_CHAT_BACKGROUND;
let loaded=false;
const listeners=new Set<()=>void>();
const directory=()=>{const {Directory,Paths}=getBackgroundFileSystem();return new Directory(Paths.document,'chat-background');};
const ownedPrefix=()=>directory().uri.replace(/\/+$/,'')+'/background-';
const publish=()=>listeners.forEach(listener=>listener());
const subscribe=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
function load() {
  if(loaded)return;loaded=true;
  try {
    const {File}=getBackgroundFileSystem();
    const file=new File(directory(),'settings.json');
    if(file.exists) {
      const candidate=normalizeChatBackground(JSON.parse(file.textSync()));
      if(candidate.imageUri&&(!candidate.imageUri.startsWith(ownedPrefix())||!new File(candidate.imageUri).exists))candidate.imageUri=null;
      settings=candidate;publish();
    }
  } catch {settings=DEFAULT_CHAT_BACKGROUND;publish();}
}
export function useChatBackground() {
  useEffect(load,[]);
  return useSyncExternalStore(subscribe,()=>settings,()=>DEFAULT_CHAT_BACKGROUND);
}
export function saveChatBackground(patch:Partial<ChatBackgroundSettings>) {
  load();
  const {File}=getBackgroundFileSystem();
  const next=normalizeChatBackground({...settings,...patch});
  const folder=directory();folder.create({intermediates:true,idempotent:true});
  const file=new File(folder,'settings.json');file.write(JSON.stringify(next));
  settings=next;publish();
}
function removeOwnedCopy(uri:string|null) {
  if(!uri||!uri.startsWith(ownedPrefix()))return;
  const {File}=getBackgroundFileSystem();
  const copy=new File(uri);if(copy.exists)copy.delete();
}
export function importChatBackground(uri:string) {
  const {File}=getBackgroundFileSystem();
  load();const folder=directory();folder.create({intermediates:true,idempotent:true});
  const extension=uri.match(/\.(png|jpe?g|heic|webp)(?:\?|$)/i)?.[1] ?? 'jpg';
  const copy=new File(folder,'background-'+Date.now()+'.'+extension);
  new File(uri).copy(copy);
  const old=settings.imageUri;
  try {saveChatBackground({imageUri:copy.uri});} catch(error){removeOwnedCopy(copy.uri);throw error;}
  removeOwnedCopy(old);
}
export function removeChatBackground() {
  const old=settings.imageUri;saveChatBackground({imageUri:null});removeOwnedCopy(old);
}
