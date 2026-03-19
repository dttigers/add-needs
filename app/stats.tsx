import { View, Text, ScrollView, TouchableOpacity, StatusBar, DimensionValue } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { getTopCravings, getFeedbackStats, TopCraving, FeedbackStat } from '../src/storage/events';
import { CRAVINGS } from '../src/data/mappings';
import { useThemeColors } from '../src/theme';

export default function StatsScreen() {
  const colors = useThemeColors();
  const [topCravings, setTopCravings] = useState<TopCraving[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStat[]>([]);

  useEffect(() => {
    setTopCravings(getTopCravings(10));
    setFeedbackStats(getFeedbackStats());
  }, []);

  const maxCount = topCravings[0]?.count ?? 1;
  const filteredFeedback = feedbackStats.filter(
    (s) => s.total >= 1 && (s.yes > 0 || s.no > 0)
  );
  const isEmpty = topCravings.length === 0 && filteredFeedback.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar hidden />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: colors.accent, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>Stats</Text>
      </View>

      {isEmpty ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: colors.navText, fontSize: 16, textAlign: 'center' }}>
            {'No data yet.\nStart a few redirects to see patterns.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          {/* Section 1: Top Cravings */}
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 }}>
            Top Cravings
          </Text>
          {topCravings.map((item) => {
            const cravingEntry = CRAVINGS.find((c) => c.id === item.craving_id);
            const emoji = cravingEntry?.emoji ?? '❓';
            const barWidth: DimensionValue = `${Math.round((item.count / maxCount) * 100)}%`;
            return (
              <View key={item.craving_id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 24, marginRight: 8 }}>{emoji}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, width: 120 }} numberOfLines={1}>
                  {item.craving_label}
                </Text>
                <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 4, height: 14, marginHorizontal: 8, overflow: 'hidden' }}>
                  <View style={{ height: 14, borderRadius: 4, backgroundColor: colors.accent, width: barWidth }} />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, width: 24, textAlign: 'right' }}>{item.count}</Text>
              </View>
            );
          })}

          {/* Section 2: What Helped */}
          {filteredFeedback.length > 0 && (
            <>
              <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 28 }}>
                What Helped
              </Text>
              {filteredFeedback.map((stat) => {
                const cravingEntry = CRAVINGS.find((c) => c.id === stat.craving_id);
                const emoji = cravingEntry?.emoji ?? '❓';
                const yesRate = stat.total > 0 ? Math.round((stat.yes / stat.total) * 100) : 0;
                const barColor = yesRate >= 50 ? '#22c55e' : colors.destructive;
                return (
                  <View key={stat.craving_id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 24, marginRight: 8 }}>{emoji}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, width: 120 }} numberOfLines={1}>
                      {stat.craving_label}
                    </Text>
                    <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 4, height: 10, marginHorizontal: 8, overflow: 'hidden' }}>
                      <View style={{ height: 10, borderRadius: 4, backgroundColor: barColor, width: `${yesRate}%` as DimensionValue }} />
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 12, width: 36, textAlign: 'right' }}>{yesRate}%</Text>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
