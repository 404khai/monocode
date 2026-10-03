import type { ReactElement } from 'react';
import { BottomSheet, Group, Host, RNHostView } from '@expo/ui/swift-ui';
import { presentationBackground, presentationDetents, presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';
import { useAppTheme } from '@/shared/theme/useAppTheme';

export function NativeSheet({visible,onClose,children,detents=['large']}:{visible:boolean;onClose:()=>void;children:ReactElement;detents?:('medium'|'large')[]}) {
  const t=useAppTheme();
  return <Host style={{position:'absolute',width:0,height:0}} pointerEvents="box-none">
    <BottomSheet isPresented={visible} onIsPresentedChange={open=>{if(!open)onClose();}}>
      <Group modifiers={[presentationDetents(detents),presentationDragIndicator('visible'),presentationBackground(t.canvas)]}>
        <RNHostView>{children}</RNHostView>
      </Group>
    </BottomSheet>
  </Host>;
}
