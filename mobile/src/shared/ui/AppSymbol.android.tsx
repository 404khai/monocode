import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = Pick<SymbolViewProps, 'name' | 'size' | 'tintColor' | 'type' | 'weight'> & { style?: StyleProp<ViewStyle> };
type AndroidSymbol = NonNullable<Exclude<SymbolViewProps['name'], string>['android']>;
const symbols: Record<string, AndroidSymbol> = {
  'bubble.left.and.bubble.right': 'forum', 'note.text': 'description', bolt: 'bolt', gearshape: 'settings',
  'square.and.pencil': 'edit_square', 'line.3.horizontal.decrease': 'filter_alt', magnifyingglass: 'search', tray: 'inbox', pin: 'push_pin', folder: 'folder',
  'chevron.down': 'expand_more', 'chevron.right': 'chevron_right', 'chevron.up': 'expand_less',
  'chevron.left': 'chevron_left', plus: 'add', xmark: 'close', checkmark: 'check',
  'arrow.up': 'arrow_upward', 'arrow.down': 'arrow_downward', 'arrow.left': 'arrow_back',
  'arrow.triangle.pull': 'merge', 'point.topleft.down.curvedto.point.bottomright.up': 'fork_right',
  'line.3.horizontal.decrease.circle': 'filter_list', 'ellipsis': 'more_horiz',
  'terminal': 'terminal', 'square.and.arrow.up': 'ios_share', 'doc.on.doc': 'content_copy',
  'photo': 'image', 'trash': 'delete', 'hand.raised': 'pan_tool', 'checkmark.circle': 'check_circle',
};
export function AppSymbol({ name, size = 18, weight, ...props }: Props) {
  const android = typeof name === 'object' ? name.android : symbols[name] ?? 'circle';
  return <SymbolView {...props} name={{ android }} size={size}/>;
}
