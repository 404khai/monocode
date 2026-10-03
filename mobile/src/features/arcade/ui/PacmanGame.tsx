import { useCallback, useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, AppState, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { createPacmanArcade } from "../model/pacmanArcade";
import { PROJECT_MASCOTS } from "../model/projectMascots";
import type { ArcadeSprite, GridArcade } from "../model/gridArcade";
import { useAppTheme } from "@/shared/theme/useAppTheme";
import { ProviderIcon } from "@/shared/ui/ProviderIcon";

const CELL = 6,
  PITCH = 7;
function snapshot(game: GridArcade, cols: number, rows: number) {
  const grid = new Float32Array(cols * rows);
  game.stamp(grid, cols, rows);
  // Bucket cell opacity into eight paths instead of mounting thousands of SVG rectangles.
  const paths = Array<string>(8).fill("");
  grid.forEach((value, index) => {
    const bucket = Math.min(7, Math.floor(value * 7));
    const x = (index % cols) * PITCH,
      y = Math.floor(index / cols) * PITCH;
    paths[bucket] += "M" + x + " " + y + "h6v6h-6z";
  });
  return {
    paths,
    sprites: game.sprites(),
    logo: game.logoPickup(),
    speech: game.speechBubble(),
  };
}
function Pacman({ sprite: s, color }: { sprite: ArcadeSprite; color: string }) {
  const x = s.cx * PITCH + CELL / 2,
    y = s.cy * PITCH + CELL / 2,
    r = (s.size * PITCH * 0.8) / 2;
  if (s.mouth >= 0.999) return null;
  if (s.mouth <= 0.01)
    return <Circle cx={x} cy={y} r={r} fill={color} opacity={s.alpha * 0.92} />;
  const facing = Math.atan2(s.dy, s.dx),
    mouth = s.mouth * Math.PI;
  const start = facing + mouth,
    end = facing - mouth + Math.PI * 2;
  const path =
    "M" +
    x +
    " " +
    y +
    "L" +
    (x + r * Math.cos(start)) +
    " " +
    (y + r * Math.sin(start)) +
    "A" +
    r +
    " " +
    r +
    " 0 " +
    (end - start > Math.PI ? 1 : 0) +
    " 1 " +
    (x + r * Math.cos(end)) +
    " " +
    (y + r * Math.sin(end)) +
    "Z";
  return <Path d={path} fill={color} opacity={s.alpha * 0.92} />;
}
function Ghost({ sprite: s, color }: { sprite: ArcadeSprite; color: string }) {
  const span = s.size * PITCH * 0.8,
    unit = span / 8;
  const left = s.cx * PITCH + CELL / 2 - span / 2,
    top = s.cy * PITCH + CELL / 2 - span / 2;
  const art = PROJECT_MASCOTS.find((m) => m.name === s.mascot);
  return (
    <G
      transform={"translate(" + left + " " + top + ") scale(" + unit + ")"}
      fill={color}
      opacity={s.alpha * 0.8}
    >
      {s.eyes
        ? [2, 5].map((x) => (
            <Rect
              key={x}
              x={x + Math.sign(s.dx) * 0.6}
              y={3 + Math.sign(s.dy) * 0.6}
              width={1}
              height={1.5}
            />
          ))
        : art && <Path d={s.frame === "talk" ? art.talkPath : art.restPath} />}
    </G>
  );
}

/** The desktop empty-session engine, drawn natively rather than through its DOM canvas. */
export function PacmanGame({
  height = 400,
  opacity = 0.2,
  fadeBottom = false,
}: {
  height?: number;
  opacity?: number;
  fadeBottom?: boolean;
}) {
  const t = useAppTheme();
  const [width, setWidth] = useState(0);
  const [game] = useState(createPacmanArcade);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(AppState.currentState === "active");
  const [reduceMotion, setReduceMotion] = useState(true);
  const cols = Math.ceil(width / PITCH),
    rows = Math.ceil(height / PITCH);
  const [frame, setFrame] = useState(() => snapshot(game, 0, 0));
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    const motion = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    const lifecycle = AppState.addEventListener("change", (state) =>
      setActive(state === "active"),
    );
    return () => {
      mounted = false;
      motion.remove();
      lifecycle.remove();
    };
  }, []);
  useEffect(() => {
    if (!cols || !rows) return;
    game.resize(cols, rows);
    game.step(420);
    setFrame(snapshot(game, cols, rows));
  }, [game, cols, rows]);
  useEffect(() => {
    if (!cols || !focused || !active || reduceMotion) return;
    let previous = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      game.step(Math.min(100, now - previous));
      previous = now;
      setFrame(snapshot(game, cols, rows));
    }, 50);
    return () => clearInterval(timer);
  }, [game, cols, rows, focused, active, reduceMotion]);
  const logo = frame.logo;
  const logoStyle = useMemo(
    () =>
      logo
        ? {
            position: "absolute" as const,
            left: logo.x * PITCH,
            top: logo.y * PITCH,
            opacity:
              logo.alpha *
              0.7 *
              (fadeBottom
                ? Math.max(
                    0,
                    Math.min(1, (height - logo.y * PITCH) / (height * 0.55)),
                  )
                : 1),
          }
        : undefined,
    [logo, fadeBottom, height],
  );
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: "100%", height, opacity, overflow: "hidden" }}
    >
      <Svg width={width} height={height}>
        {fadeBottom && (
          <Defs>
            <LinearGradient id="arcadeFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="white" stopOpacity={1} />
              <Stop offset="0.45" stopColor="white" stopOpacity={1} />
              <Stop offset="1" stopColor="white" stopOpacity={0} />
            </LinearGradient>
            <Mask id="arcadeMask" x={0} y={0} width={width} height={height}>
              <Rect width={width} height={height} fill="url(#arcadeFade)" />
            </Mask>
          </Defs>
        )}
        <G mask={fadeBottom ? "url(#arcadeMask)" : undefined}>
          {frame.paths.map((path, bucket) => (
            <Path
              key={bucket}
              d={path}
              fill={t.text}
              opacity={0.06 + (bucket / 7) * 0.66}
            />
          ))}
          {frame.sprites.map((sprite, index) =>
            sprite.kind === "pacman" ? (
              <Pacman key={index} sprite={sprite} color={t.text} />
            ) : (
              <Ghost key={index} sprite={sprite} color={t.text} />
            ),
          )}
          {frame.speech && (
            <SvgText
              x={Math.max(60, Math.min(width - 60, frame.speech.x * PITCH))}
              y={Math.max(12, frame.speech.y * PITCH - 14)}
              fontSize={8}
              fontFamily="Menlo"
              textAnchor="middle"
              fill={t.text}
              opacity={frame.speech.alpha}
            >
              {frame.speech.text}
            </SvgText>
          )}
        </G>
      </Svg>
      {logo && (
        <View style={logoStyle}>
          <ProviderIcon
            provider={logo.harness}
            color={t.text}
            size={logo.cells * PITCH}
          />
        </View>
      )}
    </View>
  );
}
