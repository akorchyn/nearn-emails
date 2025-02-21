export const getListingTypeLabel = (type: string) => {
  if (type === 'project') return 'Project';
  if (type === 'hackathon') return 'Hackathon Track';
  if (type === 'sponsorship') return 'Sponsorship';
  return 'Bounty';
};
