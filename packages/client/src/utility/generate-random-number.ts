export const generateRandomNumber = (): number => {
  return crypto.getRandomValues(new Uint32Array(1))[0];
};

export default generateRandomNumber;
