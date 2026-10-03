import { Pressable, StyleSheet } from "react-native";

import { useAppTheme } from "@/shared/theme/useAppTheme";
import { AppSymbol } from "./AppSymbol";

type Props = {
  onShowWorking: () => void;
  onShowAll: () => void;
};

export function OverflowMenu({ onShowWorking }: Props) {
  const theme = useAppTheme();
  return (
    <Pressable
      accessibilityLabel="Session options"
      onPress={onShowWorking}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.surface, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <AppSymbol
        name={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
        tintColor={theme.text}
      />
      <AppSymbol
        name={{ ios: "line.3.horizontal.decrease.circle", android: "more_horiz", web: "more_horiz" }}
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
