type DiceBearApiSprite =
  | "adventurer"
  | "adventurer-neutral"
  | "avataaars"
  | "big-ears"
  | "big-ears-neutral"
  | "big-smile"
  | "bottts"
  | "croodles"
  | "croodles-neutral"
  | "identicon"
  | "initials"
  | "micah"
  | "miniavs"
  | "open-peeps"
  | "personas"
  | "pixel-art"
  | "pixel-art-neutral";

export const createDiceBearApiUrl = (
  sprite: DiceBearApiSprite,
  seed: string
) => {
  return `https://avatars.dicebear.com/api/${sprite}/${seed}.svg`;
};
