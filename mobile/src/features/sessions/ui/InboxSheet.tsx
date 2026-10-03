import { NativeSheet } from '@/shared/ui/NativeSheet';
import { InboxPanel } from '@/features/inbox/ui/InboxPanel';
export function InboxSheet({visible,onClose}:{visible:boolean;onClose:()=>void}) {
  return <NativeSheet visible={visible} onClose={onClose}>
    <InboxPanel visible={visible} onClose={onClose}/>
  </NativeSheet>;
}
