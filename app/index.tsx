import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.headline}>What are you{'\n'}craving?</Text>
      <TouchableOpacity
        style={styles.cta}
        onPress={() => router.push('/result')}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaText}>I'm craving...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 46,
  },
  cta: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
});
