import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Users,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PeerVideoGrid } from '../components/PeerVideoGrid';
import { ScreenShareBtn } from '../components/ScreenShareBtn';
import { FileShareArea } from '../components/FileShareArea';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { RTCManager } from '../lib/rtc';
import { SharedFile, MeetingRoom as MeetingRoomType } from '../types/events';
import { nanoid } from 'nanoid';

export const MeetingRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { 
    events, 
    meetingRooms, 
    addMeetingRoom, 
    updateMeetingRoom,
    getRoomFiles,
    addSharedFile,
    removeSharedFile,
    saveToStorage 
  } = useEventStore();

  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peers, setPeers] = useState<Array<{ id: string; stream?: MediaStream; userName?: string }>>([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const rtcManagerRef = useRef<RTCManager | null>(null);
  const event = events.find(e => e.id === id);
  const room = meetingRooms.find(r => r.event_id === id);
  const sharedFiles = room ? getRoomFiles(room.id) : [];

  useEffect(() => {
    if (!event || !user) {
      navigate('/events');
      return;
    }

    initializeRoom();
    return () => {
      cleanup();
    };
  }, [event, user]);

  const initializeRoom = async () => {
    if (!user || !event) return;

    try {
      // Create or find meeting room
      let currentRoom = room;
      if (!currentRoom) {
        const newRoom: MeetingRoomType = {
          id: nanoid(),
          event_id: event.id,
          owner: user.id,
          allow_screen: true,
          allow_file: true,
          participants: [user.id],
          created_at: new Date().toISOString()
        };
        addMeetingRoom(newRoom);
        currentRoom = newRoom;
      } else if (!currentRoom.participants.includes(user.id)) {
        updateMeetingRoom(currentRoom.id, {
          participants: [...currentRoom.participants, user.id]
        });
      }

      // Initialize RTC
      rtcManagerRef.current = new RTCManager(
        (peerId, stream) => {
          setPeers(prev => [...prev.filter(p => p.id !== peerId), { id: peerId, stream, userName: `User ${peerId.slice(0, 8)}` }]);
        },
        (peerId) => {
          setPeers(prev => prev.filter(p => p.id !== peerId));
          setParticipantCount(prev => Math.max(1, prev - 1));
        },
        (peerId, data) => {
          console.log('Received data from peer:', peerId, data);
        }
      );

      // Get user media
      const stream = await rtcManagerRef.current.initializeLocalStream();
      setLocalStream(stream);
      setIsConnected(true);

      saveToStorage();
    } catch (error) {
      console.error('Failed to initialize room:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const cleanup = () => {
    if (rtcManagerRef.current) {
      rtcManagerRef.current.disconnectAll();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!rtcManagerRef.current) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing - would need to restore camera
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await rtcManagerRef.current.getScreenShare();
        setIsScreenSharing(true);
        
        // In a real app, you'd replace the video track in all peer connections
        console.log('Screen sharing started:', screenStream);
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const leaveRoom = () => {
    cleanup();
    navigate(`/events/${event?.id}`);
  };

  const handleFileUpload = async (file: File) => {
    if (!room || !user) return;

    try {
      // In a real app, upload to storage service
      const reader = new FileReader();
      reader.onload = () => {
        const sharedFile: SharedFile = {
          id: nanoid(),
          room_id: room.id,
          filename: file.name,
          url: reader.result as string,
          uploaded_by: user.id,
          created_at: new Date().toISOString()
        };

        addSharedFile(sharedFile);
        saveToStorage();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleFileDelete = (fileId: string) => {
    removeSharedFile(fileId);
    saveToStorage();
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-73px)] text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <button
              onClick={() => navigate('/events')}
              className="text-blue-400 hover:text-blue-300"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="h-[calc(100vh-73px)] flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-white text-lg font-semibold">{event.title}</h1>
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="h-4 w-4" />
                <span className="text-sm">{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-md transition-colors ${
                  showChat ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowFiles(!showFiles)}
                className={`p-2 rounded-md transition-colors ${
                  showFiles ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 p-4">
            <PeerVideoGrid
              localStream={localStream}
              peers={peers}
              isLocalMuted={isAudioMuted}
              isLocalVideoOff={isVideoOff}
            />
          </div>

          {/* Sidebar */}
          {(showChat || showFiles) && (
            <div className="w-80 bg-gray-800 border-l border-gray-700">
              {showFiles && (
                <div className="h-full p-4">
                  <FileShareArea
                    files={sharedFiles}
                    onFileUpload={handleFileUpload}
                    onFileDelete={handleFileDelete}
                    currentUserId={user?.id || ''}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                isAudioMuted
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isAudioMuted ? (
                <MicOff className="h-5 w-5 text-white" />
              ) : (
                <Mic className="h-5 w-5 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="h-5 w-5 text-white" />
              ) : (
                <Video className="h-5 w-5 text-white" />
              )}
            </button>

            <ScreenShareBtn
              isSharing={isScreenSharing}
              onStartShare={toggleScreenShare}
              onStopShare={toggleScreenShare}
            />

            <button
              onClick={leaveRoom}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <PhoneOff className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};