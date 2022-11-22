export const isIncludesSpecialCharacter = (str: string) => {
  return /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
};
