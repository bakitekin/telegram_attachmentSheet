import { useCallback } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';

import SegmentedControl, {
  isSegmentedControlAvailable,
  type SegmentedControlSelectEvent,
} from '../../modules/segmented-control';
import { Glass } from './Glass';
import { SEGMENTS } from './segments';
import { colors, menuBar } from './theme';

const SEGMENT_ITEMS = SEGMENTS.map(({ title, systemImage }) => ({ title, systemImage }));

type MenuBarProps = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  /**
   * A `UIVisualEffectView` renders nothing while it — or any ancestor — sits at zero opacity,
   * and `GlassView` installs its effect exactly once, on its first layout pass. The bar first
   * lays out while the sheet is still collapsed and faded out, so that one shot is wasted and
   * the glass stays blank forever. Changing this key remounts the glass layer once the sheet
   * has settled open, which is the only way to get a second layout pass.
   */
  glassKey: string;
  /** Animated, and overrides the bar's own side insets — see `AttachmentSheet`. */
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
};

/**
 * The floating bar at the bottom of the sheet: an `expo-glass-effect` capsule with a real
 * `UISegmentedControl` inside it, so the selection indicator and its transition come from UIKit.
 *
 * There are more segments than fit, and the native module scrolls them itself — a React Native
 * `ScrollView` cannot, because the control consumes the drag before the scroll view sees it.
 */
export const MenuBar = ({ selectedIndex, onSelect, glassKey, style }: MenuBarProps) => {
  const handleSelect = useCallback(
    (event: SegmentedControlSelectEvent) => {
      const next = event.nativeEvent.index;
      if (next !== selectedIndex) {
        Haptics.selectionAsync();
        onSelect(next);
      }
    },
    [onSelect, selectedIndex]
  );

  return (
    <Animated.View style={[styles.bar, style]}>
      <Glass
        key={glassKey}
        style={StyleSheet.absoluteFill}
        glassEffectStyle="regular"
        borderRadius={menuBar.radius}
      />
      {isSegmentedControlAvailable ? (
        <SegmentedControl
          style={StyleSheet.absoluteFill}
          segments={SEGMENT_ITEMS}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          selectedContentColor={colors.accent}
          contentColor={colors.menuBarContent}
          iconSize={menuBar.iconSize}
          fontSize={menuBar.fontSize}
          iconSpacing={menuBar.iconSpacing}
          contentPadding={menuBar.contentPadding}
          verticalInset={menuBar.verticalInset}
          indicatorColor={colors.menuBarIndicator}
          iconWeight="medium"
          fontWeight="regular"
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: menuBar.sideInset,
    right: menuBar.sideInset,
    bottom: menuBar.bottomInset,
    height: menuBar.height,
    borderRadius: menuBar.radius,
    borderCurve: 'continuous',
    // The corner the sheet's expansion is counter-scaled around — see `AttachmentSheet`.
    // Anchoring anywhere else would drift the bar off the sheet's bottom edge as it grows.
    transformOrigin: 'bottom left',
    overflow: 'hidden',
    // Glass alone lets far too much of the photo grid through for the bar to read as the
    // near-white capsule it should be, so a white wash sits underneath it — which also
    // carries the bar through the open transition, and stands in for the glass entirely
    // when liquid glass is unavailable.
    backgroundColor: isLiquidGlassAvailable() ? colors.menuBar : 'rgba(255, 255, 255, 0.95)',
  },
});
