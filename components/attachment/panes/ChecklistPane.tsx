import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { colors, menuBar } from '../theme';

const TASKS = ['Add a Task', 'Add a Task', 'Add a Task'];

export const ChecklistPane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <Text style={styles.sectionTitle}>CHECKLIST TITLE</Text>
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={colors.fieldPlaceholder}
      />
    </View>

    <Text style={styles.sectionTitle}>TASKS</Text>
    <View style={styles.card}>
      {TASKS.map((placeholder, index) => (
        <Fragment key={index}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <View style={styles.taskRow}>
            <SymbolView
              name="circle"
              size={22}
              tintColor={colors.tertiaryLabel}
              type="monochrome"
              style={styles.taskIcon}
            />
            <TextInput
              style={[styles.input, styles.taskInput]}
              placeholder={placeholder}
              placeholderTextColor={colors.fieldPlaceholder}
            />
          </View>
        </Fragment>
      ))}
    </View>
    <Text style={styles.footnote}>Anyone in this chat can tick items off the list.</Text>
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
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    width: 22,
    height: 22,
    marginLeft: 14,
  },
  taskInput: {
    flex: 1,
    paddingLeft: 11,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 47,
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
