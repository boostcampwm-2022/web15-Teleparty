import { atom } from "jotai";

/**
 * string -> invite 쿼리가 있는 경우
 *
 * null -> invite 쿼리가 없는 경우
 *
 * undefined -> 초기값 (새로고침, 비정상적 접근 체크)
 */
export const roomIdAtom = atom<string | null | undefined>(undefined);
