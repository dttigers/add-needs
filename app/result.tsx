import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CRAVINGS, MAPPINGS } from '../src/data/mappings';
import { logEvent, setFeedback } from '../src/storage/events';
import { getCustomMappings } from '../src/storage/customMappings';
import { useThemeColors } from '../src/theme';

export default function ResultScreen() {
  const colors = useThemeColors();

  const { cravingId } = useLocalSearchParams<{ cravingId: string }>();

  const customMappings = getCustomMappings();
  const customMapping = customMappings.find(m => String(m.id) === cravingId);
  const craving =
    CRAVINGS.find(c => c.id === cravingId) ??
    (customMapping
      ? { id: String(customMapping.id), label: customMapping.label, emoji: customMapping.emoji }
      : undefined);
  const result = cravingId
    ? (MAPPINGS[cravingId] ??
       (customMapping
         ? { need: customMapping.need, suggestions: [customMapping.suggestion1, customMapping.suggestion2] as [string, string] }
         : undefined))
    : undefined;

  const [eventId, setEventId] = useState<number | null>(null);

  useEffect(() => {
    if (craving && result && cravingId) {
      const id = logEvent(cravingId, craving.label, result.need);
      setEventId(id);
    }
  }, []);

  if (!cravingId || !craving || !result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, paddingHorizontal: 24 }}>
        <StatusBar hidden />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Something went wrong</Text>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}>
        {/* Top section */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
            Your craving
          </Text>
          <Text style={{ color: colors.textSubtle, fontSize: 20, marginTop: 4 }}>
            {craving.emoji} {craving.label}
          </Text>

          <Text style={{ color: colors.accent, fontSize: 24, marginVertical: 20 }}>↓</Text>

          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
            Real need
          </Text>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: '700', textAlign: 'center', marginTop: 4 }}>
            {result.need}
          </Text>
        </View>

        {/* Suggestions section */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Try this
          </Text>
          {result.suggestions.map((suggestion, index) => (
            <View
              key={index}
              style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10 }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 22 }}>
                <Text style={{ color: colors.accent }}>{index + 1}. </Text>
                {suggestion}
              </Text>
            </View>
          ))}
        </View>

        {/* Feedback section */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 16 }}>
            Did that help?
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => { if (eventId !== null) setFeedback(eventId, 'yes'); router.replace('/'); }}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>✓ Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => { if (eventId !== null) setFeedback(eventId, 'no'); router.replace('/'); }}
            >
              <Text style={{ color: colors.destructive, fontSize: 16, fontWeight: '700' }}>✗ No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
              onPress={() => { if (eventId !== null) setFeedback(eventId, 'skip'); router.replace('/'); }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: '600' }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
