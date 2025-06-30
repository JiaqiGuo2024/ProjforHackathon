import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, User } from 'lucide-react';

interface PeerVideoProps {
  peerId: string;
  stream?: MediaStream;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  userName?: string;
}

const PeerVideo: React.FC<PeerVideoProps> = ({
  peerId,
  stream,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  userName = 'Participant'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-white text-sm">{userName}</p>
          </div>
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
          {isLocal ? 'You' : userName}
        </span>
        
        <div className="flex items-center space-x-1">
          {isMuted && (
            <div className="bg-red-600 p-1 rounded">
              <MicOff className="h-3 w-3 text-white" />
            </div>
          )}
          {isVideoOff && (
            <div className="bg-red-600 p-1 rounded">
              <VideoOff className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PeerVideoGridProps {
  localStream?: MediaStream;
  peers: Array<{
    id: string;
    stream?: MediaStream;
    userName?: string;
  }>;
  isLocalMuted: boolean;
  isLocalVideoOff: boolean;
}

export const PeerVideoGrid: React.FC<PeerVideoGridProps> = ({
  localStream,
  peers,
  isLocalMuted,
  isLocalVideoOff
}) => {
  const totalParticipants = peers.length + (localStream ? 1 : 0);
  
  const getGridClass = () => {
    if (totalParticipants <= 1) return 'grid-cols-1';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={`grid gap-4 h-full ${getGridClass()}`}>
      {/* Local Video */}
      {localStream && (
        <PeerVideo
          peerId="local"
          stream={localStream}
          isLocal={true}
          isMuted={isLocalMuted}
          isVideoOff={isLocalVideoOff}
          userName="You"
        />
      )}
      
      {/* Remote Videos */}
      {peers.map(peer => (
        <PeerVideo
          key={peer.id}
          peerId={peer.id}
          stream={peer.stream}
          userName={peer.userName}
        />
      ))}
      
      {/* Empty slots for better grid layout */}
      {totalParticipants === 0 && (
        <div className="flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Waiting for participants...</p>
          </div>
        </div>
      )}
    </div>
  );
};