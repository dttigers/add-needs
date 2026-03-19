import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { addCustomMapping, updateCustomMapping } from '../src/storage/customMappings';
import { useThemeColors } from '../src/theme';

export default function AddMappingScreen() {
  const colors = useThemeColors();

  const params = useLocalSearchParams<{
    id?: string;
    label?: string;
    emoji?: string;
    need?: string;
    suggestion1?: string;
    suggestion2?: string;
  }>();

  const isEdit = !!params.id;

  const [emoji, setEmoji] = useState(params.emoji ?? '');
  const [label, setLabel] = useState(params.label ?? '');
  const [need, setNeed] = useState(params.need ?? '');
  const [suggestion1, setSuggestion1] = useState(params.suggestion1 ?? '');
  const [suggestion2, setSuggestion2] = useState(params.suggestion2 ?? '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!emoji.trim() || !label.trim() || !need.trim() || !suggestion1.trim() || !suggestion2.trim()) {
      setError('All fields are required.');
      return;
    }
    setError('');
    const data = {
      emoji: emoji.trim(),
      label: label.trim(),
      need: need.trim(),
      suggestion1: suggestion1.trim(),
      suggestion2: suggestion2.trim(),
    };
    if (isEdit) {
      updateCustomMapping(Number(params.id), data);
    } else {
      addCustomMapping(data);
    }
    router.back();
  };

  const inputStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
  } as const;

  const labelStyle = {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase' as const,
    marginBottom: 6,
    letterSpacing: 0.8,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar hidden />
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: colors.accent, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>
          {isEdit ? 'Edit Mapping' : 'Add Mapping'}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Emoji */}
        <Text style={labelStyle}>Emoji</Text>
        <TextInput
          style={[inputStyle, { fontSize: 32, textAlign: 'center', paddingVertical: 10 }]}
          value={emoji}
          onChangeText={setEmoji}
          maxLength={2}
          placeholder="😤"
          placeholderTextColor={colors.textMuted}
        />

        {/* Label */}
        <Text style={labelStyle}>Craving Label</Text>
        <TextInput
          style={inputStyle}
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Comfort snacking"
          placeholderTextColor={colors.textMuted}
        />

        {/* Need */}
        <Text style={labelStyle}>Real Need</Text>
        <TextInput
          style={inputStyle}
          value={need}
          onChangeText={setNeed}
          placeholder="e.g. Emotional soothing"
          placeholderTextColor={colors.textMuted}
        />

        {/* Suggestion 1 */}
        <Text style={labelStyle}>Suggestion 1</Text>
        <TextInput
          style={inputStyle}
          value={suggestion1}
          onChangeText={setSuggestion1}
          placeholder="e.g. Hold something warm"
          placeholderTextColor={colors.textMuted}
        />

        {/* Suggestion 2 */}
        <Text style={labelStyle}>Suggestion 2</Text>
        <TextInput
          style={inputStyle}
          value={suggestion2}
          onChangeText={setSuggestion2}
          placeholder="e.g. Write down what you're feeling"
          placeholderTextColor={colors.textMuted}
        />

        {/* Inline error */}
        {error ? (
          <Text style={{ color: colors.destructive, fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
            {error}
          </Text>
        ) : null}

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: colors.accent,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
