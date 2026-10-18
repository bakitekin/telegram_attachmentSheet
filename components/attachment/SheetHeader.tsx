import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SymbolView, type SFSymbol, type SymbolWeight } from 'expo-symbols';

import { Glass } from './Glass';
import { colors, paneTransition, sheet } from './theme';

type CircleButtonProps = {
  symbol: SFSymbol;
  onPress?: () => void;
  size?: number;
  weight?: SymbolWeight;
  /** See `MenuBar`'s `glassKey` — the glass needs a layout pass after the sheet settles. */
  glassKey: string;
};

export const CircleButton = ({
  symbol,
  onPress,
  size = 19,
  weight = 'semibold',
  glassKey,
}: CircleButtonProps) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    style={({ pressed }) => [styles.circle, pressed && styles.circlePressed]}
  >
    {/* Not `isInteractive`: an interactive UIGlassEffect captures touches to run its own
        response, and they never reach the Pressable — the button stops firing. */}
    <Glass
      key={glassKey}
      style={StyleSheet.absoluteFill}
      glassEffectStyle="regular"
      borderRadius={sheet.closeButton.size / 2}
    />
    <SymbolView name={symbol} size={size} tintColor={colors.label} type="monochrome" weight={weight} />
  </Pressable>
);

type SheetHeaderProps = {
  title: string;
  glassKey: string;
  /** Renders the small chevron next to the title, as the gallery's album picker does. */
  withDisclosure?: boolean;
  onClose: () => void;
  trailing?: ReactNode;
};

export const SheetHeader = ({
  title,
  glassKey,
  withDisclosure,
  onClose,
  trailing,
}: SheetHeaderProps) => (
  <View style={styles.container} pointerEvents="box-none">
    <View style={styles.grabber} />
    <View style={styles.row}>
      <CircleButton symbol="xmark" onPress={onClose} size={20} weight="semibold" glassKey={glassKey} />
      {/* Keyed on the title so the outgoing and incoming labels overlap and cross-fade,
          the way the pane beneath them does. */}
      <Animated.View
        key={title}
        style={styles.titleWrapper}
        pointerEvents="none"
        entering={FadeIn.duration(paneTransition.fadeDuration)}
        exiting={FadeOut.duration(paneTransition.fadeDuration)}
      >
        <Animated.Text style={styles.title} numberOfLines={1}>
          {title}
        </Animated.Text>
        {withDisclosure ? (
          <SymbolView
            name="chevron.down"
            size={12}
            tintColor={colors.label}
            type="monochrome"
            weight="bold"
            style={styles.disclosure}
          />
        ) : null}
      </Animated.View>
      <View style={styles.trailing}>{trailing}</View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: sheet.grabber.top,
  },
  grabber: {
    alignSelf: 'center',
    width: sheet.grabber.width,
    height: sheet.grabber.height,
    borderRadius: sheet.grabber.radius,
    backgroundColor: colors.grabber,
  },
  row: {
    height: sheet.closeButton.size,
    marginTop: sheet.closeButton.inset - sheet.grabber.top - sheet.grabber.height,
    marginHorizontal: sheet.closeButton.inset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: sheet.closeButton.size,
    height: sheet.closeButton.size,
    borderRadius: sheet.closeButton.size / 2,
    borderCurve: 'continuous',
    overflow: 'hidden',
    // Sits under the glass, and stands in for it where liquid glass is unavailable.
    backgroundColor: colors.closeButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePressed: {
    opacity: 0.65,
  },
  titleWrapper: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: sheet.titleSize,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: colors.label,
  },
  disclosure: {
    marginLeft: 5,
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
