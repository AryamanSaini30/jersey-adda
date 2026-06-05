export const clubFilters = [
  {
    id: 'BARCELONA',
    label: 'FC Barcelona',
    shortLabel: 'Barca',
    keywords: ['barca', 'barcelona', 'fcb'],
  },
  {
    id: 'REAL_MADRID',
    label: 'Real Madrid',
    shortLabel: 'Madrid',
    keywords: ['madrid', 'realmadrid', 'real madrid'],
  },
  {
    id: 'MAN_UNITED',
    label: 'Manchester United',
    shortLabel: 'United',
    keywords: ['united', 'manutd', 'man united', 'mufc'],
  },
  {
    id: 'AC_MILAN',
    label: 'AC Milan',
    shortLabel: 'Milan',
    keywords: ['milan', 'acm', 'ac milan'],
  },
];

export function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function matchesClubFilter(jersey, clubId) {
  if (!clubId || clubId === 'All') {
    return true;
  }

  const club = clubFilters.find((entry) => entry.id === clubId);
  if (!club) {
    return false;
  }

  if (jersey.featured_club === club.id) {
    return true;
  }

  const haystack = normalizeText([
    jersey.name,
    jersey.team_name,
    jersey.league_name,
    jersey.description,
    jersey.featured_club,
  ].filter(Boolean).join(' '));

  return club.keywords.some((keyword) => haystack.includes(normalizeText(keyword)));
}
