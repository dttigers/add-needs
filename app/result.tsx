import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CRAVINGS, MAPPINGS } from '../src/data/mappings';
import { logEvent, setFeedback, setChosenSuggestion, getCravingFeedbackSummary } from '../src/storage/events';
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
  const [adaptiveNote, setAdaptiveNote] = useState<string | null>(null);

  useEffect(() => {
    if (craving && result && cravingId) {
      const id = logEvent(cravingId, craving.label, result.need);
      setEventId(id);

      const summary = getCravingFeedbackSummary(cravingId);
      const ratedTotal = summary.yes + summary.no;
      if (ratedTotal >= 3 && (summary.yes / ratedTotal) >= 0.6) {
        setAdaptiveNote('This suggestion has helped you before — give it a try!');
      } else if (ratedTotal >= 5 && (summary.yes / ratedTotal) < 0.3) {
        setAdaptiveNote('This one hasn\'t clicked yet — maybe try something different after.');
      }
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
            What will you try?
          </Text>
          {result.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                if (eventId !== null) setChosenSuggestion(eventId, suggestion);
                router.replace('/');
              }}
              style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 22, flex: 1 }}>
                <Text style={{ color: colors.accent }}>{index + 1}. </Text>
                {suggestion}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 16, marginLeft: 8 }}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Other option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (eventId !== null) setFeedback(eventId, 'other');
              router.replace('/');
            }}
            style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginTop: 4, alignItems: 'center' }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 15, fontWeight: '500' }}>Other / none of these</Text>
          </TouchableOpacity>
        </View>

        {/* Adaptive note */}
        {adaptiveNote && (
          <View style={{ marginTop: 20, backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderLeftWidth: 3, borderLeftColor: colors.accent }}>
            <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Based on your history
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 15, lineHeight: 21 }}>
              {adaptiveNote}
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
