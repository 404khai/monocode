import { Button, Host, Menu } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, frame, tint } from '@expo/ui/swift-ui/modifiers';

type Props = {
  onShowWorking: () => void;
  onShowAll: () => void;
};

export function OverflowMenu({ onShowWorking, onShowAll }: Props) {
  return (
    <Host style={{ width: 44, height: 44 }} seedColor="#459BF7">
      <Menu
        label="Session options"
        systemImage="ellipsis"
        modifiers={[
          buttonStyle('glass'),
          controlSize('large'),
          tint('#737373'),
          frame({ width: 44, height: 44 }),
        ]}>
        <Button label="Show all sessions" systemImage="rectangle.stack" onPress={onShowAll} />
        <Button label="Show working only" systemImage="bolt" onPress={onShowWorking} />
      </Menu>
    </Host>
  );
}
