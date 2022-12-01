export const GAME_MODE_LIST = ["CatchMind", "Garticphone"] as const;

type GameModeTuple = typeof GAME_MODE_LIST;

export type GameMode = GameModeTuple[number];

type GameModeStringMap = {
  [K in GameMode]: string;
};

export const GAME_MODE_TITLE_MAP: GameModeStringMap = {
  CatchMind: "캐치마인드",
  Garticphone: "갈틱폰",
};

export const GAME_MODE_DESCRIPTION_MAP: GameModeStringMap = {
  CatchMind:
    "한명은 입력한 제시어에 맞춰 그림을 그리고, 나머지는 그림을 보고 제시어를 맞춰야합니다!",
  Garticphone:
    "마지막 턴이 될 때까지 제시어를 보고 그림을 그리고, 주어진 그림이 무엇인지 유추하세요!",
};
