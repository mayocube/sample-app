export const delay = async (ms, result) => {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
};

export const timezones = ['America/Chicago', 'America/New_York', 'America/Denver', 'America/Los_Angeles'];