import Peer from 'simple-peer';

export interface PeerConnection {
  id: string;
  peer: Peer.Instance;
  stream?: MediaStream;
}

export class RTCManager {
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private onPeerJoined?: (peerId: string, stream?: MediaStream) => void;
  private onPeerLeft?: (peerId: string) => void;
  private onDataReceived?: (peerId: string, data: any) => void;

  constructor(
    onPeerJoined?: (peerId: string, stream?: MediaStream) => void,
    onPeerLeft?: (peerId: string) => void,
    onDataReceived?: (peerId: string, data: any) => void
  ) {
    this.onPeerJoined = onPeerJoined;
    this.onPeerLeft = onPeerLeft;
    this.onDataReceived = onDataReceived;
  }

  async initializeLocalStream(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
      return this.localStream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      throw error;
    }
  }

  async getScreenShare(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } catch (error) {
      console.error('Failed to get screen share:', error);
      throw error;
    }
  }

  createPeer(peerId: string, initiator: boolean = false): Peer.Instance {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: this.localStream || undefined
    });

    peer.on('signal', (signal) => {
      // In a real app, send this signal to the other peer via signaling server
      console.log('Signal for peer', peerId, signal);
    });

    peer.on('stream', (stream) => {
      this.onPeerJoined?.(peerId, stream);
    });

    peer.on('data', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        this.onDataReceived?.(peerId, parsed);
      } catch (error) {
        console.error('Failed to parse peer data:', error);
      }
    });

    peer.on('close', () => {
      this.peers.delete(peerId);
      this.onPeerLeft?.(peerId);
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.peers.delete(peerId);
      this.onPeerLeft?.(peerId);
    });

    this.peers.set(peerId, { id: peerId, peer });
    return peer;
  }

  sendData(data: any, targetPeerId?: string) {
    const message = JSON.stringify(data);
    
    if (targetPeerId) {
      const peerConnection = this.peers.get(targetPeerId);
      if (peerConnection?.peer.connected) {
        peerConnection.peer.send(message);
      }
    } else {
      // Broadcast to all peers
      this.peers.forEach(({ peer }) => {
        if (peer.connected) {
          peer.send(message);
        }
      });
    }
  }

  disconnectPeer(peerId: string) {
    const peerConnection = this.peers.get(peerId);
    if (peerConnection) {
      peerConnection.peer.destroy();
      this.peers.delete(peerId);
    }
  }

  disconnectAll() {
    this.peers.forEach(({ peer }) => peer.destroy());
    this.peers.clear();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  getPeers(): PeerConnection[] {
    return Array.from(this.peers.values());
  }
}