import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, menuBar } from '../theme';

const OPTION_PLACEHOLDERS = ['Add an Option', 'Add an Option', 'Add an Option'];

export const PollPane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <Text style={styles.sectionTitle}>QUESTION</Text>
    <View style={styles.card}>
      <TextInput
        style={[styles.input, styles.question]}
        placeholder="Ask a Question"
        placeholderTextColor={colors.fieldPlaceholder}
        multiline
      />
    </View>

    <Text style={styles.sectionTitle}>POLL OPTIONS</Text>
    <View style={styles.card}>
      {OPTION_PLACEHOLDERS.map((placeholder, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.fieldPlaceholder}
          />
        </Fragment>
      ))}
    </View>
    <Text style={styles.footnote}>You can add up to 10 options.</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: menuBar.height + menuBar.bottomInset + 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  input: {
    minHeight: 51,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 17,
    letterSpacing: -0.4,
    color: colors.label,
  },
  question: {
    minHeight: 88,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 14,
    backgroundColor: colors.separator,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    letterSpacing: 0.1,
    color: colors.tertiaryLabel,
  },
  footnote: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 13,
    letterSpacing: -0.1,
    color: colors.tertiaryLabel,
  },
});
