import { useEffect, useCallback, useRef } from "react";

import { useSetAtom } from "jotai";
import Peer, { DataConnection } from "peerjs";

import { dataConnectionMapAtom } from "../store/dataConnectionMap";
import { createPeerId, restoreIdFromPeerId } from "../utils/peer";

export const useDataConnectionWithPeers = (
  peer: Peer,
  peerIdList: string[]
) => {
  const setDataConnectionMap = useSetAtom(dataConnectionMapAtom);

  // 리렌더링을 막기 위해 dataConnection을 ref로 따로 관리
  const dataConnectionsRef = useRef<DataConnection[]>([]);

  if (!peer.id) {
    console.error(
      "useDataConnectionWithPeers에서 connection이 맺어지지 않은 peer를 전달받았습니다!"
    );
  }

  const connectDataChannelWithPeers = () => {
    const newDataConnectionMap = new Map<string, DataConnection>();
    for (const peerId of peerIdList) {
      const dataConnection = peer.connect(createPeerId(peerId));
      console.log(dataConnection);
      newDataConnectionMap.set(peerId, dataConnection);
    }

    dataConnectionsRef.current = [...newDataConnectionMap.values()];
    setDataConnectionMap(newDataConnectionMap);
    console.log(dataConnectionsRef.current);
  };

  const closeAllDataChannel = () => {
    for (const dataConnection of dataConnectionsRef.current) {
      dataConnection.close();
    }
    setDataConnectionMap(new Map());
  };

  const syncDataChannelWithPeerIdList = useCallback(() => {
    setDataConnectionMap((dataConnectionMap) => {
      for (const peerId of dataConnectionMap.keys()) {
        if (peerIdList.includes(peerId)) continue;
        const dataConnection = dataConnectionMap.get(peerId);
        dataConnection && dataConnection.close();
        dataConnectionMap.delete(peerId);
      }

      const newDataConnectionMap = new Map(dataConnectionMap);
      dataConnectionsRef.current = [...newDataConnectionMap.values()];
      return newDataConnectionMap;
    });
  }, [peerIdList, setDataConnectionMap]);

  const peerConnectionHandler = (connection: DataConnection) => {
    console.log("incomming connection!");
    dataConnectionsRef.current.push(connection);
    setDataConnectionMap((dataConnectionMap) => {
      dataConnectionMap.set(restoreIdFromPeerId(connection.peer), connection);
      return new Map(dataConnectionMap);
    });
  };

  const initPeerToAcceptConnection = () => {
    peer.on("connection", peerConnectionHandler);
  };

  const clearPeer = () => {
    peer.off("connection", peerConnectionHandler);
  };

  // 마운트시 피어들과 데이터 채널 연결
  useEffect(() => {
    initPeerToAcceptConnection();
    connectDataChannelWithPeers();

    return () => {
      clearPeer();
      // closeAllDataChannel();
    };
  }, []);

  // peerIdList에서 사라진 peer와의 dataConnection 제거
  useEffect(() => {
    syncDataChannelWithPeerIdList();
  }, [syncDataChannelWithPeerIdList]);
};
