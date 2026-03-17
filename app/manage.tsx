import { View, Text, FlatList, TouchableOpacity, StatusBar, ListRenderItem } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { getCustomMappings, deleteCustomMapping, CustomMapping } from '../src/storage/customMappings';

export default function ManageScreen() {
  const [mappings, setMappings] = useState<CustomMapping[]>([]);

  useFocusEffect(useCallback(() => {
    setMappings(getCustomMappings());
  }, []));

  const handleDelete = (id: number) => {
    deleteCustomMapping(id);
    setMappings(getCustomMappings());
  };

  const renderItem: ListRenderItem<CustomMapping> = ({ item }) => (
    <TouchableOpacity
      style={{ backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' }}
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/add-mapping',
        params: {
          id: String(item.id),
          label: item.label,
          emoji: item.emoji,
          need: item.need,
          suggestion1: item.suggestion1,
          suggestion2: item.suggestion2,
        },
      } as never)}
    >
      <Text style={{ fontSize: 28, marginRight: 12 }}>{item.emoji}</Text>
      <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600', flex: 1 }}>{item.label}</Text>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ color: '#ff6b6b', fontSize: 18, fontWeight: '700' }}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <StatusBar hidden />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: '#6366f1', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>Custom Mappings</Text>
      </View>
      {/* List or empty state */}
      {mappings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#666666', fontSize: 16, textAlign: 'center' }}>
            No custom mappings yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={mappings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderItem}
        />
      )}
      {/* Add button */}
      <TouchableOpacity
        onPress={() => router.push('/add-mapping' as never)}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          backgroundColor: '#6366f1',
          borderRadius: 24,
          width: 48,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700', lineHeight: 28 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
