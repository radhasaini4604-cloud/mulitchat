import { useState, useRef, useEffect } from 'react';
import { setAppSetting } from '../../Main_chat/utils/settingsSync';
import './VoiceTab.css';

interface VoiceOption {
  key: string;
  name: string;
  gender: 'Female' | 'Male';
  description: string;
  audioPath: string;
}

const voiceOptions: VoiceOption[] = [
  {
    key: 'luna',
    name: 'Luna',
    gender: 'Female',
    description: 'Warm professional voice',
    audioPath: '/audio-samples-best/female_1_luna.mp3'
  },
  {
    key: 'asteria',
    name: 'Asteria',
    gender: 'Female',
    description: 'Expressive conversational voice',
    audioPath: '/audio-samples-best/female_2_asteria.mp3'
  },
  {
    key: 'athena',
    name: 'Athena',
    gender: 'Female',
    description: 'Crisp intellectual voice',
    audioPath: '/audio-samples-best/female_3_athena.mp3'
  },
  {
    key: 'orion',
    name: 'Orion',
    gender: 'Male',
    description: 'Natural warm voice',
    audioPath: '/audio-samples-best/male_1_orion.mp3'
  },
  {
    key: 'zeus',
    name: 'Zeus',
    gender: 'Male',
    description: 'Deep resonant voice',
    audioPath: '/audio-samples-best/male_2_zeus.mp3'
  },
  {
    key: 'orpheus',
    name: 'Orpheus',
    gender: 'Male',
    description: 'Steady calm voice',
    audioPath: '/audio-samples-best/male_3_orpheus.mp3'
  },
  {
    key: 'atlas',
    name: 'Atlas',
    gender: 'Male',
    description: 'Smooth friendly voice',
    audioPath: '/audio-samples-best/male_4_atlas.mp3'
  }
];

export function VoiceTab() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedVoice = localStorage.getItem('settings-tts-voice');
    if (savedVoice) {
      const idx = voiceOptions.findIndex(v => v.key === savedVoice);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  useEffect(() => {
    const handleSync = () => {
      const savedVoice = localStorage.getItem('settings-tts-voice');
      if (savedVoice) {
        const idx = voiceOptions.findIndex(v => v.key === savedVoice);
        if (idx >= 0) {
          setCurrentIndex(idx);
        }
      }
    }
    window.addEventListener('app_settings_synced', handleSync)
    return () => window.removeEventListener('app_settings_synced', handleSync)
  }, [voiceOptions])
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeVoice = voiceOptions[currentIndex];

  const playPreview = (voice: VoiceOption) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(voice.audioPath);
    setIsPlaying(true);
    audioRef.current.play().catch(err => {
      console.warn("Audio play failed:", err);
      setIsPlaying(false);
    });
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  const updateVoiceIndex = (newIndex: number) => {
    const nextIndex = (newIndex + voiceOptions.length) % voiceOptions.length;
    setCurrentIndex(nextIndex);
    const voice = voiceOptions[nextIndex];
    setAppSetting('settings-tts-voice', voice.key);
    window.dispatchEvent(new CustomEvent('settings-tts-voice-changed', { detail: voice.key }));
    
    // Play preview automatically
    playPreview(voice);
  };

  const handlePrev = () => {
    updateVoiceIndex(currentIndex - 1);
  };

  const handleNext = () => {
    updateVoiceIndex(currentIndex + 1);
  };

  const handleDoublePrev = () => {
    updateVoiceIndex(currentIndex - 2);
  };

  const handleDoubleNext = () => {
    updateVoiceIndex(currentIndex + 2);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      playPreview(activeVoice);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="voice-tab-content">
      {/* Header section at the top */}
      <div className="voice-header-section">
        <h3>Nothric Voices</h3>
      </div>

      <div className="voice-tab-body">
        {/* Central Visualizer Orbit */}
        <div className="voice-visualizer-container">
          <div className={`gif-wrapper ${isPlaying ? 'speaking' : ''}`} onClick={handleTogglePlay}>
            <img src="/voice.gif" alt="Voice visualizer" className="voice-visual-gif" />
            <div className="play-overlay">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={{ marginLeft: '2px' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Voice Selection Controls below the visualizer */}
        <div className="voice-controls-container">
          
          {/* Navigation Row: < Voice Name > */}
          <div className="voice-navigation-row">
            <div className="voice-nav-group">
              <button 
                type="button" 
                className="voice-nav-arrow double" 
                onClick={handleDoublePrev}
                aria-label="Double previous voice"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="m11 17-5-5 5-5"/>
                  <path d="m18 17-5-5 5-5"/>
                </svg>
              </button>

              <button 
                type="button" 
                className="voice-nav-arrow" 
                onClick={handlePrev}
                aria-label="Previous voice"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            </div>
            
            <div className="voice-metadata">
              <div className="voice-title-row">
                <span className="voice-name">{activeVoice.name}</span>
              </div>
              <span className="voice-description">{activeVoice.description}</span>
            </div>

            <div className="voice-nav-group">
              <button 
                type="button" 
                className="voice-nav-arrow" 
                onClick={handleNext}
                aria-label="Next voice"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <button 
                type="button" 
                className="voice-nav-arrow double" 
                onClick={handleDoubleNext}
                aria-label="Double next voice"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="m13 17 5-5-5-5"/>
                  <path d="m6 17 5-5-5-5"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Pulse indicator tag */}
          <div className="voice-status-indicator">
            {isPlaying ? (
              <span className="playing-label pulsing">Playing preview...</span>
            ) : (
              <span className="idle-label">Click GIF or arrows to play</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
