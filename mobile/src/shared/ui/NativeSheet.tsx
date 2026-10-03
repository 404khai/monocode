import type { ReactElement } from 'react';
import { Modal } from 'react-native';
export function NativeSheet({visible,onClose,children}:{visible:boolean;onClose:()=>void;children:ReactElement}) {
  return <Modal visible={visible} onRequestClose={onClose} animationType="slide" presentationStyle="pageSheet">{children}</Modal>;
}
