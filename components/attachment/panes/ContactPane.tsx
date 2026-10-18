import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, menuBar } from '../theme';

type Contact = {
  name: string;
  status: string;
  colors: [string, string];
};

/** Stand-in contacts for the demo — swap in a real address book provider. */
const CONTACTS: Contact[] = [
  { name: 'Amelia Clarke', status: 'last seen recently', colors: ['#F6BC63', '#E39C2E'] },
  { name: 'Daniel Reed', status: 'last seen 2 hours ago', colors: ['#7FC8F0', '#3A88B0'] },
  { name: 'Elena K.', status: 'online', colors: ['#9BD48F', '#4CB050'] },
  { name: 'Marcus L.', status: 'last seen yesterday', colors: ['#F0A0B4', '#D9647E'] },
  { name: 'Nadia', status: 'last seen recently', colors: ['#B6A5F0', '#7A63D9'] },
  { name: 'Oliver Grant', status: 'last seen a long time ago', colors: ['#F0B48A', '#D97B45'] },
  { name: 'Priya S.', status: 'online', colors: ['#8FD6CF', '#3FA898'] },
];

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

export const ContactPane = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.card}>
      {CONTACTS.map((contact, index) => (
        <Fragment key={contact.name}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <LinearGradient colors={contact.colors} style={styles.avatar}>
              <Text style={styles.avatarLabel}>{initials(contact.name)}</Text>
            </LinearGradient>
            <View style={styles.rowText}>
              <Text style={styles.name} numberOfLines={1}>
                {contact.name}
              </Text>
              <Text style={styles.status} numberOfLines={1}>
                {contact.status}
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16.5,
    fontWeight: '500',
    letterSpacing: -0.3,
    color: colors.label,
  },
  status: {
    fontSize: 13.5,
    letterSpacing: -0.1,
    color: colors.tertiaryLabel,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 69,
    backgroundColor: colors.separator,
  },
});
