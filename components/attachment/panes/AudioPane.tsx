import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { colors, menuBar } from '../theme';

type Track = {
  title: string;
  artist: string;
  duration: string;
};

const TRACKS: Track[] = [
  { title: 'Nocturne in E-flat', artist: 'Chopin', duration: '4:32' },
  { title: 'Clair de Lune', artist: 'Debussy', duration: '5:08' },
  { title: 'Gymnopédie No. 1', artist: 'Satie', duration: '3:21' },
  { title: 'The Blue Danube', artist: 'Strauss II', duration: '9:47' },
  { title: 'Für Elise', artist: 'Beethoven', duration: '2:55' },
  { title: 'Prelude in C', artist: 'Bach', duration: '2:12' },
];

export const AudioPane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.card}>
      {TRACKS.map((track, index) => (
        <Fragment key={track.title}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <View style={styles.artwork}>
              <SymbolView
                name="music.note"
                size={19}
                tintColor="#FFFFFF"
                type="monochrome"
                weight="medium"
              />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.title} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {track.artist}
              </Text>
            </View>
            <Text style={styles.duration}>{track.duration}</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  row: {
    height: 62,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  artwork: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '500',
    letterSpacing: -0.3,
    color: colors.label,
  },
  artist: {
    fontSize: 13.5,
    letterSpacing: -0.1,
    color: colors.tertiaryLabel,
  },
  duration: {
    fontSize: 13.5,
    color: colors.tertiaryLabel,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 69,
    backgroundColor: colors.separator,
  },
});
