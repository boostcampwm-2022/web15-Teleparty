import {
  PlayerListLayout,
  PersonnelCountParagraph,
  PlayerItemList,
} from "./PlayerList.styles";
import PlayerListItem from "./PlayerListItem/PlayerListItem.component";

import { GamePlayer } from "../../types/game";

interface PlayerListProps {
  sizeType: "medium" | "large";
  players: GamePlayer[];
  maxPlayer: number;
}

const PlayerList = ({ sizeType, players, maxPlayer }: PlayerListProps) => {
  return (
    <PlayerListLayout sizeType={sizeType}>
      <PersonnelCountParagraph>{`${players.length}/${maxPlayer}`}</PersonnelCountParagraph>
      <PlayerItemList>
        {players.map((player) => (
          <PlayerListItem
            key={player.peerId}
            sizeType={sizeType}
            player={player}
          />
        ))}
      </PlayerItemList>
    </PlayerListLayout>
  );
};

export default PlayerList;
