import { type ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { paneTransition } from './theme';

/**
 * Panes are stacked and cross-faded rather than swapped, so switching segments never
 * resizes the sheet and each pane keeps its scroll position and text.
 *
 * The pane only fades. The movement that reads alongside it belongs to the sheet, which
 * dips and springs back as a whole — see `AttachmentSheet`.
 */
export const PaneLayer = ({ active, children }: { active: boolean; children: ReactNode }) => {
  // Always starts hidden, even when this pane mounts already active — which is what happens
  // the first time a segment is visited, and where the fade would otherwise be skipped
  // because there is nothing to animate away from.
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0, { duration: paneTransition.fadeDuration });
  }, [active, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, style]}
      pointerEvents={active ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};
