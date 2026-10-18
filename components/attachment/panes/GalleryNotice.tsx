import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

/**
 * The "limited photo access" banner Telegram pins above the grid. It is part of the
 * fixed header rather than the scrolling list, matching the recording.
 */
export const GalleryNotice = () => (
  <View style={styles.container}>
    <Text style={styles.text}>You have limited Telegram from{'\n'}accessing your photos.</Text>
    <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.buttonLabel}>MANAGE</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 71,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flexShrink: 1,
    fontSize: 15.5,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.label,
  },
  button: {
    height: 25,
    minWidth: 80,
    paddingHorizontal: 12,
    borderRadius: 12.5,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#FFFFFF',
  },
});
