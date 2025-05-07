import { useEffect, useCallback, useState } from 'react';
import Peer from 'peerjs';

export const usePeerSync = (initialData = []) => {
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [syncLog, setSyncLog] = useState([]);
  const [localData, setLocalData] = useState(initialData);

  // 初始化Peer实例
  useEffect(() => {
    const newPeer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/myapp'
    });

    newPeer.on('open', (id) => {
      setPeerId(id);
      setSyncLog(prev => [...prev, `本地节点ID: ${id}`]);
    });

    newPeer.on('connection', (connection) => {
      connection.on('open', () => {
        setConn(connection);
        setSyncLog(prev => [...prev, `已连接: ${connection.peer}`]);
        // 请求全量数据
        connection.send({ type: 'SYNC_REQUEST' });
      });

      connection.on('data', handleData);
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const handleData = useCallback((data) => {
    switch(data.type) {
      case 'FULL_SYNC':
        setLocalData(data.payload);
        setSyncLog(prev => [...prev, '收到全量数据同步']);
        break;
      case 'INCREMENTAL_SYNC':
        setLocalData(prev => [...prev, ...data.payload]);
        setSyncLog(prev => [...prev, `收到增量更新: ${data.payload.length}条`]);
        break;
      case 'SYNC_REQUEST':
        conn.send({
          type: 'FULL_SYNC',
          payload: localData
        });
        break;
      default:
        console.log('未知数据类型:', data);
    }
  }, [conn, localData]);

  const connectToPeer = useCallback((remoteId) => {
    if (!peer) return;

    const connection = peer.connect(remoteId);
    connection.on('open', () => {
      setConn(connection);
      setRemotePeerId(remoteId);
      setSyncLog(prev => [...prev, `已连接到: ${remoteId}`]);
      // 请求初始数据
      connection.send({ type: 'SYNC_REQUEST' });
    });
    connection.on('data', handleData);
  }, [peer, handleData]);

  const sendDataUpdate = useCallback((newRecords) => {
    if (!conn) return;
    
    conn.send({
      type: 'INCREMENTAL_SYNC',
      payload: newRecords
    });
    setLocalData(prev => [...prev, ...newRecords]);
  }, [conn]);

  return {
    peerId,
    remotePeerId,
    syncLog,
    localData,
    connectToPeer,
    sendDataUpdate
  };
};