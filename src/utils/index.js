export const delay = async (ms, result) => {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
};

export const timezones = ['Chicago (GMT-5)', 'Denver (GMT-6)', 'Phoenix (GMT-7)', 'Los Angeles (GMT-7)', 'Anchorage (GMT-8)', 'Honolulu (GMT-10)'];