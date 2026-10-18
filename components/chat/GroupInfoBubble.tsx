import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

const FACTS = [
  'Up to 200,000 members',
  'Persistent chat history',
  'Public links such as t.me/title',
  'Admins with different rights',
];

export const GroupInfoBubble = () => (
  <View style={styles.bubble}>
    <Text style={styles.heading}>You created a group</Text>
    <Text style={styles.lead}>Groups can have:</Text>
    {FACTS.map((fact) => (
      <View key={fact} style={styles.factRow}>
        <SymbolView
          name="checkmark"
          size={13}
          tintColor="#FFFFFF"
          type="monochrome"
          weight="semibold"
          style={styles.check}
        />
        <Text style={styles.fact}>{fact}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'center',
    maxWidth: 300,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0, 0, 0, 0.17)',
  },
  heading: {
    alignSelf: 'center',
    fontSize: 15.5,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lead: {
    fontSize: 14.5,
    color: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 6,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  check: {
    width: 14,
    height: 14,
    marginRight: 9,
  },
  fact: {
    fontSize: 14.5,
    color: '#FFFFFF',
  },
});
