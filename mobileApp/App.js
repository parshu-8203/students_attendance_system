import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './navigation/Navigation';
import { Provider as PaperProvider } from 'react-native-paper';
export default function App() {
  return (
    <PaperProvider>
      < Navigation />
    </PaperProvider>
  );
}
