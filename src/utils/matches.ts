import type { Match, MatchesFilter, MatchStatus, Score } from '../types';

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Скоро',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

export function statusLabel(status: MatchStatus, minute?: number): string {
  const known = STATUS_LABELS[status];
  if (known) {
    return status === 'live' && typeof minute === 'number' ? `${known} · ${minute}` : known;
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatKickoff(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата уточняется';
  }
  const date = new Date(startsAt);
  const datePart = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  const timePart = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

export function formatScore(score: Score | null): string {
  if (!score) {
    return '— : —';
  }
  return `${score.home} : ${score.away}`;
}

export function isFinished(status: MatchStatus): boolean {
  return status === 'finished';
}

export function sortMatches(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    if (!a.startsAt && !b.startsAt) return 0;
    if (!a.startsAt) return 1;
    if (!b.startsAt) return -1;
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

export function filterMatches(matches: Match[], filter: MatchesFilter): Match[] {
  if (filter === 'all') return matches;
  if (filter === 'finished') return matches.filter((m) => isFinished(m.status));
  return matches.filter((m) => !isFinished(m.status));
}
