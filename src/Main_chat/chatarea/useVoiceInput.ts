import { useState, useRef, useCallback } from 'react';

// WAV encoding helpers
function encodeWAV(samples: Float32Array, sampleRate: number = 16000): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return window.btoa(binary);
}

interface UseVoiceInputOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onTranscript: (text: string) => void;
}

export function useVoiceInput({ canvasRef, onTranscript }: UseVoiceInputOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const volumeHistory = useRef<number[]>([]);

  const stopVisualizer = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  const startVisualizer = useCallback((stream: MediaStream) => {
    try {
      volumeHistory.current = Array(100).fill(0);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const maxPoints = 100;

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const amp = Math.min(1.0, rms * 1.8);
        volumeHistory.current.shift();
        volumeHistory.current.push(amp);

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.lineWidth = 1.5 * dpr;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            const grad = ctx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0, 'rgba(156, 163, 175, 0.05)');
            grad.addColorStop(0.15, 'rgba(156, 163, 175, 0.45)');
            grad.addColorStop(0.85, 'rgba(156, 163, 175, 0.45)');
            grad.addColorStop(1, 'rgba(156, 163, 175, 0.05)');
            ctx.strokeStyle = grad;
            ctx.beginPath();
            const step = w / (maxPoints - 1);
            const time = Date.now() * 0.008;
            for (let i = 0; i < maxPoints; i++) {
              const x = i * step;
              const val = volumeHistory.current[i];
              const wave = Math.sin(time - i * 0.15) * Math.cos(time * 0.5 + i * 0.05);
              const y = (h / 2) + wave * val * (h / 5.5);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
        animationFrameIdRef.current = requestAnimationFrame(tick);
      };

      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
        }
        tick();
      }, 50);
    } catch (e) {
      console.error('Failed to start audio visualizer:', e);
    }
  }, [canvasRef]);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || 'a3fc173c2b06b226e3b3be38fe1c126b';
    const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || 'cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1';
    if (!accountId || !apiToken) {
      alert('Cloudflare credentials are missing from environment.');
      return;
    }
    setIsProcessingVoice(true);
    const endpoint = `/cloudflare-api/client/v4/accounts/${accountId}/ai/run/@cf/openai/whisper-large-v3-turbo`;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const rawArrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(rawArrayBuffer);
      const targetSampleRate = 16000;
      const totalSamples = Math.round(audioBuffer.duration * targetSampleRate);
      const offlineCtx = new OfflineAudioContext(1, totalSamples, targetSampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start();
      const resampledBuffer = await offlineCtx.startRendering();
      const float32Samples = resampledBuffer.getChannelData(0);
      const wavBuffer = encodeWAV(float32Samples, targetSampleRate);
      const base64Wav = arrayBufferToBase64(wavBuffer);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio: base64Wav })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloudflare API Error (${response.status}): ${errText}`);
      }
      const data = await response.json();
      const textResult = data?.result?.text || '';
      if (textResult.trim()) {
        onTranscript(textResult.trim());
      }
    } catch (err) {
      console.error('Transcription failed:', err);
      alert('Failed to transcribe audio: ' + (err as Error).message);
    } finally {
      setIsProcessingVoice(false);
    }
  }, [onTranscript]);

  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) options = { mimeType: 'audio/webm' };
      else if (MediaRecorder.isTypeSupported('audio/ogg')) options = { mimeType: 'audio/ogg' };
      else if (MediaRecorder.isTypeSupported('audio/mp4')) options = { mimeType: 'audio/mp4' };

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
      startVisualizer(stream);
    } catch (err) {
      console.error('Failed to start voice recording:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  }, [transcribeAudio, startVisualizer]);

  const stopRecording = useCallback(() => {
    stopVisualizer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, [stopVisualizer]);

  const handleMicClick = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isProcessingVoice,
    handleMicClick,
    stopVisualizer,
  };
}
