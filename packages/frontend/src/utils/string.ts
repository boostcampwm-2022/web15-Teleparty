export const isIncludesSpecialCharacter = (str: string) => {
  return /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(str);
};

export const isIncludesLetter = (str: string) => {
  return /[a-z]/i.test(str);
};

export const isIncludesDigit = (str: string) => {
  return !isNaN(Number(str));
};
