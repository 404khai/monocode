import { requireOptionalNativeModule } from 'expo-modules-core';

export const NATIVE_REBUILD_MESSAGE='Rebuild the iOS development app to enable photos, saved backgrounds, and clipboard actions. Run npx expo prebuild --platform ios, then npm run ios with your device ID. A Metro reload cannot add native modules.';
export function chatNativeCapabilities() {
  return {photos:!!requireOptionalNativeModule('ExponentImagePicker'),clipboard:!!requireOptionalNativeModule('ExpoClipboard'),files:!!requireOptionalNativeModule('FileSystem')};
}
// Keep optional SDK imports off the route-loading path. Old development builds
// can render every screen instead of failing Expo Router's module evaluation.
export function getImagePicker():typeof import('expo-image-picker') {
  if(!chatNativeCapabilities().photos)throw new Error(NATIVE_REBUILD_MESSAGE);
  return require('expo-image-picker');
}
export function getBackgroundFileSystem():typeof import('expo-file-system') {
  if(!chatNativeCapabilities().files)throw new Error(NATIVE_REBUILD_MESSAGE);
  return require('expo-file-system');
}
export async function copyChatText(text:string) {
  if(!chatNativeCapabilities().clipboard)throw new Error(NATIVE_REBUILD_MESSAGE);
  const clipboard:typeof import('expo-clipboard')=require('expo-clipboard');
  return clipboard.setStringAsync(text);
}
