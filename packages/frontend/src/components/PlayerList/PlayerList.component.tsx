import { useAtomValue } from "jotai";

import {
  PlayerListLayout,
  PersonnelCountParagraph,
  PlayerItemList,
} from "./PlayerList.styles";
import PlayerListItem from "./PlayerListItem/PlayerListItem.component";

import { playersAtom } from "../../store/players";
import { socketAtom } from "../../store/socket";

interface PlayerListProps {
  sizeType: "medium" | "large";
  maxPlayer: number;
}

const PlayerList = ({ sizeType, maxPlayer }: PlayerListProps) => {
  const socket = useAtomValue(socketAtom);
  const players = useAtomValue(playersAtom);

  return (
    <PlayerListLayout sizeType={sizeType}>
      <PersonnelCountParagraph>{`${players.length}/${maxPlayer}`}</PersonnelCountParagraph>
      <PlayerItemList>
        {players.map((player) => (
          <PlayerListItem
            key={player.peerId}
            sizeType={sizeType}
            player={player}
            isMine={player.peerId === socket.id}
          />
        ))}
      </PlayerItemList>
    </PlayerListLayout>
  );
};

export default PlayerList;
