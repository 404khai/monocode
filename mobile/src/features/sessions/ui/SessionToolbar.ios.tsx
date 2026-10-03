import { View } from 'react-native';
import { Button, Host, Image, Menu } from '@expo/ui/swift-ui';
import { accessibilityLabel, buttonStyle, frame, glassEffect, tint } from '@expo/ui/swift-ui/modifiers';
import { useAppTheme } from '@/shared/theme/useAppTheme';
export type SessionFilter = 'all' | 'working' | 'needs-input' | 'done';

export function SessionToolbar({onInbox,onFilter}:{onInbox:()=>void;onFilter:(filter:SessionFilter)=>void}) {
  const t=useAppTheme();
  // Each control has its own 44pt host. Glass is applied AFTER sizing, without
  // SwiftUI's padded glass button style expanding an HStack's proposed width.
  const chrome=[buttonStyle('plain'),frame({width:44,height:44}),
    glassEffect({shape:'circle',glass:{variant:'regular',interactive:true}}),tint(t.text)];
  return <View style={{flexDirection:'row',gap:12,width:100,height:44}}>
    <Host style={{width:44,height:44}}>
      <Button onPress={onInbox} modifiers={[...chrome,accessibilityLabel('Inbox')]}>
        <Image systemName="tray" size={20}/>
      </Button>
    </Host>
    <Host style={{width:44,height:44}}>
      <Menu label={<Image systemName="line.3.horizontal.decrease.circle" size={22}/>}
        modifiers={[...chrome,accessibilityLabel('Filter sessions')]}>
        <Button label="All sessions" systemImage="rectangle.stack" onPress={()=>onFilter('all')}/>
        <Button label="Working" systemImage="bolt" onPress={()=>onFilter('working')}/>
        <Button label="Needs input" systemImage="hand.raised" onPress={()=>onFilter('needs-input')}/>
        <Button label="Completed" systemImage="checkmark.circle" onPress={()=>onFilter('done')}/>
      </Menu>
    </Host>
  </View>;
}
