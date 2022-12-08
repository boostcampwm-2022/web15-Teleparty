const START_STR_FOR_PEERJS_ID = "Teleparty";
const END_STR_FOR_PEERJS_ID = "A";

// PeerJs 아이디 규칙에 맞는 문자열로 변환해 반환
// https://peerjs.com/docs/#api
export const createPeerId = (id: string) => {
  return `${START_STR_FOR_PEERJS_ID}${id
    .split("")
    .join("A")}${END_STR_FOR_PEERJS_ID}`;
};

export const restoreIdFromPeerId = (id: string) => {
  if (id.slice(0, START_STR_FOR_PEERJS_ID.length) !== START_STR_FOR_PEERJS_ID)
    return id;
  if (
    id.slice(id.length - END_STR_FOR_PEERJS_ID.length, id.length) !==
    END_STR_FOR_PEERJS_ID
  )
    return id;

  return id
    .slice(
      START_STR_FOR_PEERJS_ID.length,
      id.length - END_STR_FOR_PEERJS_ID.length
    )
    .split("")
    .filter((char, index) => index % 2 === 0)
    .join("");
};
