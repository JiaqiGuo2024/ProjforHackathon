import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

interface YjsConnection {
  doc: Y.Doc;
  provider: WebrtcProvider;
  disconnect: () => void;
}

export const createYjsConnection = (roomId: string, userId: string): YjsConnection => {
  const doc = new Y.Doc();
  
  const provider = new WebrtcProvider(roomId, doc, {
    signaling: ['wss://signaling.yjs.dev'],
  });

  // Set user awareness
  provider.awareness.setLocalStateField('user', {
    id: userId,
    name: `User ${userId.slice(0, 8)}`,
    color: getRandomColor(),
  });

  const disconnect = () => {
    provider.destroy();
    doc.destroy();
  };

  return { doc, provider, disconnect };
};

export const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const syncArray = <T>(doc: Y.Doc, arrayName: string): Y.Array<T> => {
  return doc.getArray<T>(arrayName);
};

export const syncMap = <T>(doc: Y.Doc, mapName: string): Y.Map<T> => {
  return doc.getMap<T>(mapName);
};

export const syncText = (doc: Y.Doc, textName: string): Y.Text => {
  return doc.getText(textName);
};