import { View, Text, FlatList, TouchableOpacity, StatusBar, ListRenderItem } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getHistory, RedirectEvent } from '../src/storage/events';
import { CRAVINGS } from '../src/data/mappings';

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function feedbackBadge(feedback: RedirectEvent['feedback']): { label: string; color: string } {
  if (feedback === 'yes') return { label: '✓', color: '#6366f1' };
  if (feedback === 'no') return { label: '✗', color: '#ff6b6b' };
  if (feedback === 'skip') return { label: '–', color: '#666666' };
  return { label: '?', color: '#444444' };
}

export default function HistoryScreen() {
  const [events, setEvents] = useState<RedirectEvent[]>([]);

  useEffect(() => {
    setEvents(getHistory());
  }, []);

  const renderItem: ListRenderItem<RedirectEvent> = ({ item }) => {
    const cravingEntry = CRAVINGS.find(c => c.id === item.craving_id);
    const emoji = cravingEntry?.emoji ?? '❓';
    const badge = feedbackBadge(item.feedback);
    return (
      <View style={{ backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, marginRight: 12 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{item.craving_label}</Text>
          <Text style={{ color: '#888888', fontSize: 13, marginTop: 2 }}>→ {item.need_name}</Text>
          <Text style={{ color: '#444444', fontSize: 12, marginTop: 4 }}>{relativeTime(item.timestamp)}</Text>
        </View>
        <Text style={{ color: badge.color, fontSize: 20, fontWeight: '700', marginLeft: 8 }}>{badge.label}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <StatusBar hidden />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: '#6366f1', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '700' }}>History</Text>
      </View>
      {/* List or empty state */}
      {events.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#444444', fontSize: 16, textAlign: 'center' }}>
            No redirects yet.{'\n'}Tap a craving to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
