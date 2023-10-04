export const delay = async (ms, result) => {
  return new Promise(resolve => setTimeout(() => resolve(result), ms));
};
