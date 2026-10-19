import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { MATCHES_URL } from '../config';
import type { Match, MatchesFilter, MatchesResponse } from '../types';
import { filterMatches, sortMatches } from '../utils/matches';

type LoadState = 'loading' | 'error' | 'ready';

export function MatchesScreen() {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<MatchesFilter>('all');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) {
      setRefreshing(true);
      setRefreshError(false);
    } else {
      setLoadState('loading');
    }

    try {
      const response = await fetch(MATCHES_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: MatchesResponse = await response.json();
      setMatches(sortMatches(data.matches));
      setLoadState('ready');
      setLastUpdatedAt(new Date());
    } catch {
      if (isRefresh) {
        setRefreshError(true);
      } else {
        setLoadState('error');
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const visibleMatches = filterMatches(matches, filter);

  if (loadState === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ef3124" />
      </View>
    );
  }

  if (loadState === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Не удалось загрузить матчи</Text>
        <Pressable style={styles.retryButton} onPress={() => load(false)}>
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи тура</Text>
        <FilterTabs value={filter} onChange={setFilter} />
      </View>

      <FlatList
        style={styles.list}
        data={visibleMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.updatedRow}>
              {lastUpdatedAt && <UpdatedAgo since={lastUpdatedAt} />}
              <Pressable onPress={() => load(true)}>
                <Text style={styles.refreshLink}>Обновить</Text>
              </Pressable>
            </View>
            {refreshError && <Text style={styles.refreshError}>Не удалось обновить</Text>}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {filter === 'all' ? 'Матчей пока нет' : 'Нет матчей по выбранному фильтру'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
  },
  list: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  refreshLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef3124',
  },
  refreshError: {
    fontSize: 12,
    color: '#ef3124',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ef3124',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
