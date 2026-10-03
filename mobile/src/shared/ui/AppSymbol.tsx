import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = Pick<SymbolViewProps, 'name' | 'size' | 'tintColor' | 'type' | 'weight'> & {
  style?: StyleProp<ViewStyle>;
};

export function AppSymbol({ size = 18, weight = 'medium', ...props }: Props) {
  return <SymbolView {...props} size={size} weight={weight} />;
}
