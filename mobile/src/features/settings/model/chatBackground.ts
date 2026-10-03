export const BACKGROUND_EFFECTS=['none','dither','ascii','halftone','scanlines','gradient-blur'] as const;
export type BackgroundEffect=typeof BACKGROUND_EFFECTS[number];
export type ChatBackgroundSettings={imageUri:string|null;effect:BackgroundEffect;scope:'empty'|'all';emptyOpacity:number;sessionOpacity:number};
export const DEFAULT_CHAT_BACKGROUND:ChatBackgroundSettings={imageUri:null,effect:'none',scope:'all',emptyOpacity:0.24,sessionOpacity:0.24};
export const BACKGROUND_EFFECT_LABELS:Record<BackgroundEffect,string>={none:'None',dither:'Dither',ascii:'ASCII',halftone:'Halftone',scanlines:'Scanlines','gradient-blur':'Haze'};
export function normalizeChatBackground(input:unknown):ChatBackgroundSettings {
  const value=(input&&typeof input==='object'?input:{}) as Partial<ChatBackgroundSettings>;
  const clamp=(number:unknown)=>typeof number==='number'&&Number.isFinite(number) ? Math.min(0.65,Math.max(0.05,number)) : 0.24;
  return {imageUri:typeof value.imageUri==='string'&&value.imageUri.startsWith('file://') ? value.imageUri : null,
    effect:BACKGROUND_EFFECTS.includes(value.effect as BackgroundEffect) ? value.effect! : 'none',scope:value.scope==='empty' ? 'empty' : 'all',
    emptyOpacity:clamp(value.emptyOpacity),sessionOpacity:clamp(value.sessionOpacity)};
}
export function chatBackgroundOpacity(settings:ChatBackgroundSettings,empty:boolean):number {
  if(!settings.imageUri||(!empty&&settings.scope==='empty'))return 0;
  return empty ? settings.emptyOpacity : settings.sessionOpacity;
}
