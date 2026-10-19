import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types';
import { formatKickoff, formatScore, statusLabel } from '../utils/matches';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.meta}>{formatKickoff(match.startsAt)}</Text>
        <Text style={styles.status}>{statusLabel(match.status, match.minute)}</Text>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.team}>
          <Text style={styles.teamName} numberOfLines={1}>
            {match.home.name}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {match.home.city}
          </Text>
        </View>

        <Text style={styles.score}>{formatScore(match.score)}</Text>

        <View style={[styles.team, styles.teamRight]}>
          <Text style={styles.teamName} numberOfLines={1}>
            {match.away.name}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {match.away.city}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef3124',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  team: {
    flex: 1,
  },
  teamRight: {
    alignItems: 'flex-end',
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
  },
  city: {
    fontSize: 12,
    color: '#9ca3af',
  },
  score: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 12,
  },
});
