import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '../attachment/Glass';

export const ChatHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 7 }]} pointerEvents="box-none">
      <View style={styles.row}>
        <Glass style={styles.circle} glassEffectStyle="regular" borderRadius={18}>
          <SymbolView
            name="chevron.backward"
            size={18}
            tintColor="#1E1E1E"
            type="monochrome"
            weight="semibold"
          />
        </Glass>

        <Glass style={styles.titlePill} glassEffectStyle="regular" borderRadius={19.5}>
          <Text style={styles.title}>Tekin's Group</Text>
          <Text style={styles.subtitle}>1 member</Text>
        </Glass>

        <LinearGradient colors={['#63d9f6', '#2ecbe3']} style={styles.avatar}>
          <Text style={styles.avatarLabel}>TG</Text>
        </LinearGradient>
      </View>
<TouchableOpacity>

      <Glass style={styles.banner} glassEffectStyle="regular" borderRadius={18.5}>
        <Text style={styles.bannerLabel}>Add Members</Text>
        <SymbolView
          name="xmark.circle.fill"
          size={20}
          tintColor="rgba(30, 30, 30, 0.28)"
          type="monochrome"
          style={styles.bannerDismiss}
          />
      </Glass>
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    gap: 15,
  },
  row: {
    height: 39,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    transform: [{ translateX: -88 }],
    width: 176,
    height: 39,
    borderRadius: 19.5,
    borderCurve: 'continuous',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: '#1E1E1E',
  },
  subtitle: {
    marginTop: 1,
    fontSize: 12,
    letterSpacing: -0.1,
    color: 'rgba(30, 30, 30, 0.5)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  banner: {
    height: 37,
    borderRadius: 18.5,
    borderCurve: 'continuous',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerLabel: {
    fontSize: 15.5,
    letterSpacing: -0.3,
    color: '#2A7BAE',
  },
  bannerDismiss: {
    position: 'absolute',
    right: 11,
    width: 20,
    height: 20,
  },
});
