import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CRAVINGS, MAPPINGS } from '../src/data/mappings';

export default function ResultScreen() {
  const { cravingId } = useLocalSearchParams<{ cravingId: string }>();

  const craving = CRAVINGS.find(c => c.id === cravingId);
  const result = cravingId ? MAPPINGS[cravingId] : undefined;

  if (!cravingId || !craving || !result) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', paddingHorizontal: 24 }}>
        <StatusBar hidden />
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Something went wrong</Text>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={{ backgroundColor: '#6366f1', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 }}
        >
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <StatusBar hidden />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 }}>
        {/* Top section */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#666666', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
            Your craving
          </Text>
          <Text style={{ color: '#888888', fontSize: 20, marginTop: 4 }}>
            {craving.emoji} {craving.label}
          </Text>

          <Text style={{ color: '#6366f1', fontSize: 24, marginVertical: 20 }}>↓</Text>

          <Text style={{ color: '#666666', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 }}>
            Real need
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '700', textAlign: 'center', marginTop: 4 }}>
            {result.need}
          </Text>
        </View>

        {/* Suggestions section */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: '#666666', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Try this
          </Text>
          {result.suggestions.map((suggestion, index) => (
            <View
              key={index}
              style={{ backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 10 }}
            >
              <Text style={{ color: '#cccccc', fontSize: 16, lineHeight: 22 }}>
                <Text style={{ color: '#6366f1' }}>{index + 1}. </Text>
                {suggestion}
              </Text>
            </View>
          ))}
        </View>

        {/* Done button */}
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={{
            backgroundColor: '#6366f1',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 32,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
