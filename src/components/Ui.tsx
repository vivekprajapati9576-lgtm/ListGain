import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { palette } from '../constants/theme';

export function Screen({ children }: { children?: ReactNode }) {
  return (
    <LinearGradient colors={[palette.bg, '#071225', palette.bg]} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </LinearGradient>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children }: { children?: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Pill({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const backgroundColor =
    tone === 'success' ? 'rgba(34,197,94,0.18)' : tone === 'warning' ? 'rgba(245,158,11,0.18)' : tone === 'danger' ? 'rgba(251,113,133,0.18)' : 'rgba(56,189,248,0.18)';
  const color = tone === 'success' ? palette.success : tone === 'warning' ? palette.warning : tone === 'danger' ? palette.danger : palette.primary;

  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function SearchField({ value, onChangeText, placeholder }: { value: string; onChangeText: (text: string) => void; placeholder: string }) {
  return <TextInput placeholder={placeholder} placeholderTextColor={palette.muted} style={styles.input} value={value} onChangeText={onChangeText} autoCapitalize="characters" />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 18, paddingBottom: 140 },
  sectionHeader: { gap: 4 },
  sectionTitle: { color: palette.text, fontSize: 22, fontWeight: '700' },
  sectionSubtitle: { color: palette.muted, fontSize: 13 },
  card: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 12
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  pillText: { fontSize: 12, fontWeight: '700' },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: { color: palette.bg, fontWeight: '800', fontSize: 15 },
  input: {
    backgroundColor: palette.surfaceAlt,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 16,
    color: palette.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15
  }
});
