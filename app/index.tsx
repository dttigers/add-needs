import { View, Text, FlatList, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CRAVINGS, CravingItem } from '../src/data/mappings';
import { getCustomMappings } from '../src/storage/customMappings';
import { useThemeColors } from '../src/theme';

export default function HomeScreen() {
  const colors = useThemeColors();

  const customCravings: CravingItem[] = getCustomMappings().map(m => ({
    id: String(m.id),
    label: m.label,
    emoji: m.emoji,
  }));
  const allCravings = [...CRAVINGS, ...customCravings];

  const renderItem = ({ item }: { item: CravingItem }) => (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/result', params: { cravingId: item.id } })}
    >
      <Text style={styles.tileEmoji}>{item.emoji}</Text>
      <Text style={[styles.tileLabel, { color: colors.textSecondary }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        onPress={() => router.push('/stats')}
        style={{ position: 'absolute', top: 64, right: 24, zIndex: 10 }}
      >
        <Text style={{ color: colors.navText, fontSize: 13 }}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/history')}
        style={{ position: 'absolute', top: 64, left: 24, zIndex: 10 }}
      >
        <Text style={{ color: colors.navText, fontSize: 13 }}>History</Text>
      </TouchableOpacity>
      <StatusBar hidden />
      <Text style={[styles.headline, { color: colors.text }]}>What are you{'\n'}craving?</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Tap one — we'll find the real need behind it</Text>
      <TouchableOpacity
        onPress={() => router.push('/manage' as never)}
        style={{ position: 'absolute', bottom: 32, right: 24, zIndex: 10 }}
      >
        <Text style={{ color: colors.navText, fontSize: 13 }}>Manage</Text>
      </TouchableOpacity>
      <FlatList
        data={allCravings}
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
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 8,
    lineHeight: 46,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
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
    fontWeight: '500',
  },
});
