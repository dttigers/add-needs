import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CRAVINGS, CravingItem } from '../src/data/mappings';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: CravingItem }) => (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/result', params: { cravingId: item.id } })}
    >
      <Text style={styles.tileEmoji}>{item.emoji}</Text>
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/stats')}
        style={{ position: 'absolute', top: 64, right: 24, zIndex: 10 }}
      >
        <Text style={{ color: '#444444', fontSize: 13 }}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/history')}
        style={{ position: 'absolute', top: 64, right: 72, zIndex: 10 }}
      >
        <Text style={{ color: '#444444', fontSize: 13 }}>History</Text>
      </TouchableOpacity>
      <StatusBar hidden />
      <Text style={styles.headline}>What are you{'\n'}craving?</Text>
      <Text style={styles.subtitle}>Tap one — we'll find the real need behind it</Text>
      <FlatList
        data={CRAVINGS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 8,
    lineHeight: 46,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  columnWrapper: {
    gap: 10,
  },
  tile: {
    flex: 1,
    height: 90,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'flex-start',
  },
  tileEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  tileLabel: {
    fontSize: 13,
    color: '#cccccc',
    fontWeight: '500',
  },
});
