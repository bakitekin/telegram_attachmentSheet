import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '../attachment/Glass';
import { inputBar } from '../attachment/theme';

/**
 * The paperclip itself is not rendered here — it lives in the overlay that morphs into the
 * attachment sheet, so this row only reserves the space it occupies.
 */
export const InputBar = () => {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom - inputBar.homeIndicatorOverlap, inputBar.minBottomInset);

  return (
    <View style={[styles.container, { paddingBottom: bottom }]} pointerEvents="box-none">
      <View style={styles.attachSlot} />

      <Glass style={styles.field} glassEffectStyle="regular" borderRadius={20}>
        <Text style={styles.placeholder}>Message</Text>
        <SymbolView
          name="clock"
          size={21}
          tintColor="rgba(30, 30, 30, 0.45)"
          type="monochrome"
          style={styles.fieldAction}
        />
      </Glass>

      <Glass style={styles.circle} glassEffectStyle="regular" borderRadius={20}>
        <SymbolView name="mic" size={21} tintColor="#1E1E1E" type="monochrome" />
      </Glass>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: inputBar.sideInset,
    gap: inputBar.gap,
  },
  attachSlot: {
    width: inputBar.buttonSize,
    height: inputBar.buttonSize,
  },
  field: {
    flex: 1,
    height: inputBar.buttonSize,
    borderRadius: inputBar.buttonSize / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 40,
  },
  placeholder: {
    fontSize: 17,
    letterSpacing: -0.4,
    color: 'rgba(30, 30, 30, 0.42)',
  },
  fieldAction: {
    position: 'absolute',
    right: 11,
    width: 21,
    height: 21,
  },
  circle: {
    width: inputBar.buttonSize,
    height: inputBar.buttonSize,
    borderRadius: inputBar.buttonSize / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
