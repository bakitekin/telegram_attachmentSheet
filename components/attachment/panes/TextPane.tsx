import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../theme';

export const TextPane = () => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Type something..."
      placeholderTextColor={colors.fieldPlaceholder}
      multiline
      textAlignVertical="top"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.4,
    color: colors.label,
    backgroundColor: '#F0F0F0'
  },
});
