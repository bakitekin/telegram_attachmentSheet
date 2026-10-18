import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Container } from './components/Container';

// Legend List sizes its container pool from a heuristic that runs a little short for a
// three-column grid and asks for a handful of extras on first paint. The large version of
// this — hundreds of containers, because the sheet measures itself mid-morph while scaled
// down — is handled in GalleryPane; what is left is a few containers and not worth a toast.
LogBox.ignoreLogs([/^\[legend-list\] No unused container available/]);

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Container />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
