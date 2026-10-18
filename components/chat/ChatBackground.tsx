import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Approximates the Telegram wallpaper in the reference recording. Sampling the video's
 * four corners showed the hue shift is almost entirely horizontal — teal on the left,
 * cornflower blue on the right, tilting ~7° downward — with a separate blue wash over
 * the top that the base gradient alone cannot express.
 */
export const ChatBackground = () => (
  <>
    <LinearGradient
      colors={['#93CDCD', '#6EABCF', '#6DA8F2']}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0.47 }}
      end={{ x: 1, y: 0.53 }}
      style={StyleSheet.absoluteFill}
    />
    <LinearGradient
      colors={['rgba(120, 160, 225, 0.42)', 'rgba(120, 160, 225, 0)']}
      locations={[0, 0.42]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  </>
);
