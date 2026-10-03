import { noteFixtures } from '../../../fixtures/productivity';
type Note=typeof noteFixtures[number];
let notes=noteFixtures;
const listeners=new Set<()=>void>();
export const getNotes=()=>notes;
export const subscribeNotes=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
const publish=()=>listeners.forEach(listener=>listener());
export function addNote(project:string,title='Untitled note',body='') {
  const id='note-'+Date.now()+'-'+notes.length;
  notes=[{id,title,project,body,updated:'Just now',tags:[]},...notes];publish();return id;
}
export function updateNote(id:string,patch:Partial<Note>) {
  notes=notes.map(note=>note.id===id?{...note,...patch,updated:'Just now'}:note);publish();
}
