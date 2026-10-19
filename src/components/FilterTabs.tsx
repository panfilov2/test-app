import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import type { MatchesFilter } from '../types';

const OPTIONS: { value: MatchesFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

type Props = {
  value: MatchesFilter;
  onChange: (value: MatchesFilter) => void;
};

export function FilterTabs({ value, onChange }: Props) {
  const anims = useRef(
    Object.fromEntries(
      OPTIONS.map((option) => [option.value, new Animated.Value(option.value === value ? 1 : 0)])
    ) as Record<MatchesFilter, Animated.Value>
  ).current;

  useEffect(() => {
    OPTIONS.forEach((option) => {
      Animated.timing(anims[option.value], {
        toValue: option.value === value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [value, anims]);

  return (
    <Animated.View style={styles.row}>
      {OPTIONS.map((option) => {
        const anim = anims[option.value];
        const backgroundColor = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['#f3f4f6', '#ffffff'],
        });
        const color = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['#6b7280', '#111827'],
        });
        return (
          <Pressable key={option.value} onPress={() => onChange(option.value)} style={styles.tabWrapper}>
            <Animated.View style={[styles.tab, { backgroundColor }]}>
              <Animated.Text style={[styles.label, { color }]}>{option.label}</Animated.Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tabWrapper: {
    flex: 1,
  },
  tab: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
