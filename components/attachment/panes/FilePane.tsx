import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SymbolView, type SFSymbol } from 'expo-symbols';

import { colors, menuBar } from '../theme';

const ACTIONS: { symbol: SFSymbol; label: string }[] = [
  { symbol: 'photo', label: 'Select from Gallery' },
  { symbol: 'cloud', label: 'Select from Files' },
  { symbol: 'doc.viewfinder', label: 'Scan Document' },
];

/** Stand-ins for the "recently sent" rows until a real file provider is wired up. */
const RECENT_PLACEHOLDERS = [0, 1, 2, 3, 4];

export const FilePane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.card}>
      {ACTIONS.map((action, index) => (
        <Fragment key={action.label}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <SymbolView
              name={action.symbol}
              size={24}
              tintColor={colors.accent}
              type="monochrome"
              style={styles.rowIcon}
            />
            <Text style={styles.rowLabel}>{action.label}</Text>
          </Pressable>
        </Fragment>
      ))}
    </View>

    <Text style={styles.sectionTitle}>RECENTLY SENT FILES</Text>

    <View style={styles.card}>
      {RECENT_PLACEHOLDERS.map((item, index) => (
        <Fragment key={item}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <View style={styles.fileRow}>
            <View style={styles.fileThumb} />
            <View style={styles.fileMeta}>
              <View style={[styles.bar, styles.barWide]} />
              <View style={[styles.bar, styles.barNarrow]} />
            </View>
          </View>
        </Fragment>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: menuBar.height + menuBar.bottomInset + 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  row: {
    height: 51,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  rowIcon: {
    width: 26,
    height: 26,
    marginRight: 14,
  },
  rowLabel: {
    fontSize: 17,
    letterSpacing: -0.4,
    color: colors.accent,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 54,
    backgroundColor: colors.separator,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
    letterSpacing: 0.1,
    color: colors.tertiaryLabel,
  },
  fileRow: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: '#ECECF0',
    marginRight: 14,
  },
  fileMeta: {
    flex: 1,
    gap: 8,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECECF0',
  },
  barWide: {
    width: '62%',
  },
  barNarrow: {
    width: '34%',
  },
});
