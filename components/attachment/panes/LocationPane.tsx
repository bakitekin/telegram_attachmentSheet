import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView, type SFSymbol } from 'expo-symbols';

import { colors, menuBar } from '../theme';

type Row = {
  symbol: SFSymbol;
  tint: string;
  title: string;
  subtitle: string;
};

const ACTIONS: Row[] = [
  {
    symbol: 'location.fill',
    tint: colors.accent,
    title: 'Send My Current Location',
    subtitle: 'Accurate to 5.1 miles',
  },
  {
    symbol: 'antenna.radiowaves.left.and.right',
    tint: '#4CB050',
    title: 'Share My Live Location for…',
    subtitle: 'Updated in real time as you move',
  },
];

/** Stand-in nearby places for the demo — swap in a real places provider. */
const PLACES = [
  { title: 'Riverside Flower Market', subtitle: 'Kingsway, Old Town' },
  { title: 'Central Station', subtitle: 'Line 3 · Market Square' },
  { title: 'Kingsway Park', subtitle: 'Riverside Drive' },
];

export const LocationPane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.map}>
      <LinearGradient colors={['#E9E6DE', '#DFE7DA']} style={StyleSheet.absoluteFill} />
      <View style={styles.road} />
      <View style={[styles.road, styles.roadCross]} />
      <View style={styles.pin}>
        <SymbolView name="mappin.circle.fill" size={34} tintColor={colors.accent} type="monochrome" />
      </View>
    </View>

    <View style={styles.card}>
      {ACTIONS.map((row, index) => (
        <Fragment key={row.title}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <View style={[styles.badge, { backgroundColor: row.tint }]}>
              <SymbolView name={row.symbol} size={17} tintColor="#FFFFFF" type="monochrome" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {row.title}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {row.subtitle}
              </Text>
            </View>
          </Pressable>
        </Fragment>
      ))}
    </View>

    <Text style={styles.sectionTitle}>OR CHOOSE A PLACE</Text>

    <View style={styles.card}>
      {PLACES.map((place, index) => (
        <Fragment key={place.title}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <View style={[styles.badge, styles.placeBadge]}>
              <SymbolView name="leaf.fill" size={16} tintColor="#FFFFFF" type="monochrome" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {place.title}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {place.subtitle}
              </Text>
            </View>
          </Pressable>
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
    paddingTop: 8,
    paddingBottom: menuBar.height + menuBar.bottomInset + 8,
  },
  map: {
    height: 150,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  road: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: '42%',
    height: 14,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
    transform: [{ rotate: '-6deg' }],
  },
  roadCross: {
    top: 0,
    bottom: 0,
    left: '62%',
    right: undefined,
    width: 11,
    height: undefined,
    transform: [{ rotate: '8deg' }],
  },
  pin: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  row: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  badge: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  placeBadge: {
    backgroundColor: '#E8A33D',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    letterSpacing: -0.3,
    color: colors.label,
  },
  rowSubtitle: {
    fontSize: 13,
    letterSpacing: -0.1,
    color: colors.tertiaryLabel,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 60,
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
});
