import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

interface VoiceChatUser {
  userId: string;
  userName: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export function useVoice(channel: any, currentUserId: string, currentUserName: string) {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState<VoiceChatUser[]>([]);
  const [speakingUsers, setSpeakingUsers] = useState<Record<string, boolean>>({});

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio level monitoring for active speaker detection
  const startAudioMonitoring = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const isSpeaking = average > 15; // Threshold for active speech

        setSpeakingUsers((prev) => {
          if (prev[currentUserId] === isSpeaking) return prev;
          return { ...prev, [currentUserId]: isSpeaking };
        });

        if (channel) {
          channel.send({
            type: 'broadcast',
            event: 'voice_speaking',
            payload: { userId: currentUserId, isSpeaking },
          });
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.error('Audio monitoring error:', e);
    }
  };

  const stopAudioMonitoring = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Create WebRTC Peer Connection to a target user
  const createPeerConnection = useCallback((targetUserId: string, isInitiator: boolean) => {
    if (peerConnectionsRef.current[targetUserId]) return peerConnectionsRef.current[targetUserId];

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current[targetUserId] = pc;

    // Add local mic tracks to PeerConnection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming ICE Candidate
    pc.onicecandidate = (event) => {
      if (event.candidate && channel) {
        channel.send({
          type: 'broadcast',
          event: 'voice_ice_candidate',
          payload: {
            fromUserId: currentUserId,
            toUserId: targetUserId,
            candidate: event.candidate,
          },
        });
      }
    };

    // Handle remote audio stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        let audio = audioElementsRef.current[targetUserId];
        if (!audio) {
          audio = document.createElement('audio');
          audio.autoplay = true;
          audioElementsRef.current[targetUserId] = audio;
        }
        audio.srcObject = event.streams[0];
      }
    };

    // Handle ICE connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        cleanupPeer(targetUserId);
      }
    };

    // If initiator, create and send SDP offer
    if (isInitiator) {
      pc.createOffer({ offerToReceiveAudio: true })
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (channel) {
            channel.send({
              type: 'broadcast',
              event: 'voice_offer',
              payload: {
                fromUserId: currentUserId,
                fromUserName: currentUserName,
                toUserId: targetUserId,
                offer: pc.localDescription,
              },
            });
          }
        })
        .catch((err) => console.error('Error creating SDP offer:', err));
    }

    return pc;
  }, [channel, currentUserId, currentUserName]);

  const cleanupPeer = (userId: string) => {
    if (peerConnectionsRef.current[userId]) {
      peerConnectionsRef.current[userId].close();
      delete peerConnectionsRef.current[userId];
    }
    if (audioElementsRef.current[userId]) {
      audioElementsRef.current[userId].pause();
      audioElementsRef.current[userId].remove();
      delete audioElementsRef.current[userId];
    }
    setVoiceUsers((prev) => prev.filter((u) => u.userId !== userId));
    setSpeakingUsers((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  };

  // Join Voice Channel
  const joinVoice = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      setIsInVoice(true);
      setIsMuted(false);

      startAudioMonitoring(stream);

      setVoiceUsers((prev) => {
        if (prev.some((u) => u.userId === currentUserId)) return prev;
        return [...prev, { userId: currentUserId, userName: currentUserName, isMuted: false, isSpeaking: false }];
      });

      // Broadcast voice join to room
      if (channel) {
        channel.send({
          type: 'broadcast',
          event: 'voice_join',
          payload: { userId: currentUserId, userName: currentUserName },
        });
      }
    } catch (err) {
      console.error('Failed to access microphone for voice chat:', err);
      alert('Microphone access is required for voice chat. Please allow mic permissions.');
    }
  }, [channel, currentUserId, currentUserName]);

  // Leave Voice Channel
  const leaveVoice = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    stopAudioMonitoring();

    Object.keys(peerConnectionsRef.current).forEach((targetId) => {
      cleanupPeer(targetId);
    });

    setIsInVoice(false);
    setIsMuted(false);
    setVoiceUsers([]);
    setSpeakingUsers({});

    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'voice_leave',
        payload: { userId: currentUserId },
      });
    }
  }, [channel, currentUserId]);

  // Mute / Unmute Mic
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const nextMuted = !audioTrack.enabled;
        setIsMuted(nextMuted);

        if (channel) {
          channel.send({
            type: 'broadcast',
            event: 'voice_mute_changed',
            payload: { userId: currentUserId, isMuted: nextMuted },
          });
        }
      }
    }
  }, [channel, currentUserId]);

  // Supabase Realtime Voice Signalling Listeners
  useEffect(() => {
    if (!channel) return;

    channel
      .on('broadcast', { event: 'voice_join' }, ({ payload }: any) => {
        if (payload.userId === currentUserId) return;
        setVoiceUsers((prev) => {
          if (prev.some((u) => u.userId === payload.userId)) return prev;
          return [...prev, { userId: payload.userId, userName: payload.userName, isMuted: false, isSpeaking: false }];
        });

        // If we are already in voice, initiate connection to new user
        if (isInVoice && localStreamRef.current) {
          createPeerConnection(payload.userId, true);
        }
      })
      .on('broadcast', { event: 'voice_offer' }, async ({ payload }: any) => {
        if (payload.toUserId !== currentUserId) return;

        setVoiceUsers((prev) => {
          if (prev.some((u) => u.userId === payload.fromUserId)) return prev;
          return [...prev, { userId: payload.fromUserId, userName: payload.fromUserName, isMuted: false, isSpeaking: false }];
        });

        const pc = createPeerConnection(payload.fromUserId, false);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          channel.send({
            type: 'broadcast',
            event: 'voice_answer',
            payload: {
              fromUserId: currentUserId,
              toUserId: payload.fromUserId,
              answer: pc.localDescription,
            },
          });
        } catch (e) {
          console.error('Error handling voice offer:', e);
        }
      })
      .on('broadcast', { event: 'voice_answer' }, async ({ payload }: any) => {
        if (payload.toUserId !== currentUserId) return;
        const pc = peerConnectionsRef.current[payload.fromUserId];
        if (pc) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
          } catch (e) {
            console.error('Error setting remote answer:', e);
          }
        }
      })
      .on('broadcast', { event: 'voice_ice_candidate' }, async ({ payload }: any) => {
        if (payload.toUserId !== currentUserId) return;
        const pc = peerConnectionsRef.current[payload.fromUserId];
        if (pc && payload.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
          } catch (e) {
            console.error('Error adding ICE candidate:', e);
          }
        }
      })
      .on('broadcast', { event: 'voice_leave' }, ({ payload }: any) => {
        cleanupPeer(payload.userId);
      })
      .on('broadcast', { event: 'voice_mute_changed' }, ({ payload }: any) => {
        setVoiceUsers((prev) =>
          prev.map((u) => (u.userId === payload.userId ? { ...u, isMuted: payload.isMuted } : u))
        );
      })
      .on('broadcast', { event: 'voice_speaking' }, ({ payload }: any) => {
        setSpeakingUsers((prev) => {
          if (prev[payload.userId] === payload.isSpeaking) return prev;
          return { ...prev, [payload.userId]: payload.isSpeaking };
        });
      });

    return () => {
      // Don't unbind channel completely on re-render, just let effect handle cleanup
    };
  }, [channel, currentUserId, isInVoice, createPeerConnection]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      leaveVoice();
    };
  }, []);

  return {
    isInVoice,
    isMuted,
    voiceUsers,
    speakingUsers,
    joinVoice,
    leaveVoice,
    toggleMute,
  };
}
