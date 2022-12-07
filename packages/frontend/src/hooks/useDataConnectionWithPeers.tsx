import { useEffect, useCallback, useRef } from "react";

import { useSetAtom } from "jotai";
import Peer, { DataConnection } from "peerjs";

import { dataConnectionMapAtom } from "../store/dataConnectionMap";
import { createPeerId } from "../utils/peer";

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

  const connectDataChannelWithPeers = useCallback(() => {
    const newDataConnectionMap = new Map<string, DataConnection>();
    for (const peerId of peerIdList) {
      const dataConnection = peer.connect(createPeerId(peerId));
      newDataConnectionMap.set(peerId, dataConnection);
    }

    dataConnectionsRef.current = [...newDataConnectionMap.values()];
    setDataConnectionMap(newDataConnectionMap);
    console.log(dataConnectionsRef.current);
  }, [peer, peerIdList, setDataConnectionMap]);

  const closeAllDataChannel = useCallback(() => {
    for (const dataConnection of dataConnectionsRef.current) {
      dataConnection.close();
    }
    setDataConnectionMap(new Map());
  }, [setDataConnectionMap]);

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

  // 마운트시 피어들과 데이터 채널 연결
  useEffect(() => {
    connectDataChannelWithPeers();
    return closeAllDataChannel;
  }, [connectDataChannelWithPeers, closeAllDataChannel]);

  // peerIdList에서 사라진 peer와의 dataConnection 제거
  useEffect(() => {
    syncDataChannelWithPeerIdList();
  }, [syncDataChannelWithPeerIdList]);
};
