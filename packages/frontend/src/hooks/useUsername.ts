import { useAtomValue } from "jotai";

import { playersAtom } from "../store/players";

const useGetUsername = () => {
  const players = useAtomValue(playersAtom);
  const getUserNameById = (id: string) => {
    return players.find(({ peerId }) => peerId === id)?.userName ?? "";
  };
  return getUserNameById;
};

export default useGetUsername;
