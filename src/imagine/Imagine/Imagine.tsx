import { useState, useEffect } from 'react';
import './Imagine.css';

import type { ImageData } from '../utils/types';
import { DEFAULT_PROMPTS, MODELS, RATIOS } from '../utils/types';
import { generateWithCloudflare, enhancePromptWithGroq, summarizePromptWithGroq } from '../utils/aiHandler';
import type { SavedCreation } from '../utils/db';
import { saveCreation, getCreations, deleteCreation } from '../utils/db';

import { Showroom } from './Showroom';
import { HistoryView } from './HistoryView';
import { ActiveWorkspace } from './ActiveWorkspace';
import { InputPanel } from '../components/InputPanel';
import { EditorPage } from '../EditorPage/EditorPage';
import { supabase } from '../../lib/supabase';


// Dynamically import all images in the `./images` directory
const imageModules = import.meta.glob('../images/*.png', { eager: true });
const imageUrls = Object.values(imageModules).map((mod: any) => mod.default || mod);

export interface WorkspaceCreation {
  id: string;
  url?: string;
  prompt: string;
  model: string;
  ratio: string;
  progress: number;
  step: string;
  status: 'generating' | 'success' | 'failed';
  summary?: string;
}

const MODEL_MAPPING: Record<string, string> = {
  'Flux Schnell': '@cf/black-forest-labs/flux-1-schnell',
  'Flux Klein': '@cf/black-forest-labs/flux-2-klein-4b',
  'Flux Dev': '@cf/black-forest-labs/flux-2-dev'
};

let isInitialPageLoad = window.location.pathname === '/imagine';

export function Imagine() {
  // Session storage helpers for active workspace creation IDs
  const getActiveWorkspaceIds = (): string[] => {
    try {
      const data = sessionStorage.getItem('imagine_activeWorkspaceIds');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveActiveWorkspaceIds = (ids: string[]) => {
    try {
      sessionStorage.setItem('imagine_activeWorkspaceIds', JSON.stringify(ids));
    } catch (e) {
      console.error("Failed to save active workspace IDs", e);
    }
  };

  const [promptInput, setPromptInput] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState('image');
  const [selectedRatio, setSelectedRatio] = useState('2:3');
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('imagine_selectedModel') || 'Flux Schnell');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // Grid images split
  const [recentImages, setRecentImages] = useState<ImageData[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);

  // History, tabs & workspace
  const [activeTab, setActiveTab] = useState<'showroom' | 'history'>(
    () => isInitialPageLoad ? ((localStorage.getItem('imagine_activeTab') as 'showroom' | 'history') || 'showroom') : 'showroom'
  );
  const [historyImages, setHistoryImages] = useState<SavedCreation[]>([]);
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(
    () => isInitialPageLoad ? (localStorage.getItem('imagine_isWorkspaceMode') === 'true') : false
  );
  const [workspaceCreations, setWorkspaceCreations] = useState<WorkspaceCreation[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);



  // Load local IndexedDB creations when userId changes (e.g. login or logout)
  useEffect(() => {
    async function loadDBHistory() {
      try {
        let saved = await getCreations();
        setHistoryImages(saved);
        
        // Populate only the active workspace creations based on saved active IDs in sessionStorage
        const activeIds = getActiveWorkspaceIds();
        const activeSaved = saved.filter(item => item.id && activeIds.includes(item.id.toString()));
        const mappedWorkspace = activeSaved.map(item => ({
          id: item.id!.toString(),
          url: item.url,
          prompt: item.prompt,
          model: item.model,
          ratio: item.ratio,
          progress: 100,
          step: 'ready for frist sigh',
          status: 'success' as const,
          summary: item.summary
        }));
        setWorkspaceCreations(mappedWorkspace);
      } catch (err) {
        console.error("Failed to load creations from IndexedDB:", err);
      }
    }
    loadDBHistory();
  }, [userId]);

  // Generation loading states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Editing state
  const [editingImage, setEditingImage] = useState<SavedCreation | null>(null);



  // Tracks if the prompt in input is already enhanced to avoid double-processing
  const [lastEnhancedPrompt, setLastEnhancedPrompt] = useState('');



  // Modal state removed

  // Initialize images
  useEffect(() => {
    // Generate realistic models & ratios for the mock dataset
    const allImages: ImageData[] = imageUrls.map((url, idx) => ({
      url,
      prompt: DEFAULT_PROMPTS[idx % DEFAULT_PROMPTS.length],
      model: MODELS[idx % MODELS.length],
      ratio: RATIOS[idx % RATIOS.length]
    }));

    // Shuffle the images list so the layout is randomized on load
    const shuffledImages = [...allImages];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    // Split: first 6 go to recent, rest to masonry gallery
    setRecentImages(shuffledImages.slice(0, 6));
    setGalleryImages(shuffledImages.slice(6));

    isInitialPageLoad = false;
  }, []);

  // Close ratio & model dropdowns on outside click
  useEffect(() => {
    if (!showRatioDropdown && !showModelDropdown) return;
    const handleCloseDropdown = () => {
      setShowRatioDropdown(false);
      setShowModelDropdown(false);
    };
    document.addEventListener('click', handleCloseDropdown);
    return () => {
      document.removeEventListener('click', handleCloseDropdown);
    };
  }, [showRatioDropdown, showModelDropdown]);

  // Handle horizontal scrolling on all Filerobot carousels (filters, watermarks, etc.) via trackpad/mouse wheel
  useEffect(() => {
    if (!editingImage) return;

    const handleWheel = (e: WheelEvent) => {
      const carouselItems = (e.target as HTMLElement).closest(
        '[class*="FIE_"][class*="-items"], .FIE_filters-items, .FIE_carousel-items'
      );
      if (carouselItems) {
        if (e.deltaY !== 0) {
          carouselItems.scrollLeft += e.deltaY;
          e.preventDefault();
        } else if (e.deltaX !== 0) {
          carouselItems.scrollLeft += e.deltaX;
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [editingImage]);

  // Persist tab & workspace mode across refreshes
  useEffect(() => {
    localStorage.setItem('imagine_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('imagine_isWorkspaceMode', String(isWorkspaceMode));
  }, [isWorkspaceMode]);

  useEffect(() => {
    localStorage.setItem('imagine_selectedModel', selectedModel);
  }, [selectedModel]);

  const handleModeChange = async (mode: string) => {
    setSelectedMode(mode);
    if (mode === 'image' && originalPrompt) {
      setPromptInput(originalPrompt);
      setOriginalPrompt('');
    } else if (mode === 'agent' && promptInput.trim()) {
      setOriginalPrompt(promptInput);
      setIsEnhancing(true);
      setNotificationMsg('Enhancing prompt with Groq AI...');
      setShowNotification(true);
      try {
        const enhanced = await enhancePromptWithGroq(promptInput.trim());
        setPromptInput(enhanced);
        setLastEnhancedPrompt(enhanced);
        setNotificationMsg('Prompt enhanced successfully!');
      } catch (err) {
        console.error(err);
        setNotificationMsg('Failed to enhance prompt with Groq.');
      } finally {
        setIsEnhancing(false);
        setTimeout(() => setShowNotification(false), 2000);
      }
    }
  };

  const handleUndoPrompt = () => {
    if (originalPrompt) {
      setPromptInput(originalPrompt);
      setOriginalPrompt('');
      setSelectedMode('image');
      setNotificationMsg('Restored original prompt!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1500);
    }
  };

  const triggerWorkspaceGeneration = async (id: string, promptText: string, ratio: string, mode: string, modelName: string) => {
    let finalPrompt = promptText;
    const isAgent = mode === 'agent' || mode === 'agent-skip-enhance';

    if (mode === 'agent' && promptText !== lastEnhancedPrompt) {
      // Set the step to "enhancing prompt..." in the workspace card
      setWorkspaceCreations(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, step: 'enhancing prompt with Groq AI...' };
        }
        return item;
      }));

      try {
        finalPrompt = await enhancePromptWithGroq(promptText);
        finalPrompt = finalPrompt.trim();
        setLastEnhancedPrompt(finalPrompt);

        // Update the card with the new enhanced prompt
        setWorkspaceCreations(prev => prev.map(item => {
          if (item.id === id) {
            return { ...item, prompt: finalPrompt };
          }
          return item;
        }));
      } catch (err) {
        console.error("Failed to enhance prompt, falling back to original:", err);
      }
    }

    let simProgress = 0;
    const progressInterval = setInterval(() => {
      if (simProgress < 95) {
        simProgress += Math.floor(Math.random() * 4) + 8;
        if (simProgress > 95) simProgress = 95;
        
        setWorkspaceCreations(prev => prev.map(item => {
          if (item.id === id) {
            let stepText = 'Creating image...';
            if (simProgress > 20 && simProgress <= 40) stepText = 'getting more pixel...';
            else if (simProgress > 40 && simProgress <= 60) stepText = 'giving more details...';
            else if (simProgress > 60 && simProgress <= 80) stepText = 'last touch...';
            else if (simProgress > 80) stepText = 'ready for first sight...';
            
            return { ...item, progress: simProgress, step: stepText };
          }
          return item;
        }));
      }
    }, 1000);

    const modelId = MODEL_MAPPING[modelName] || '@cf/black-forest-labs/flux-1-schnell';
    const options = { prompt: finalPrompt, ratio: ratio, mode: mode, model: modelId };

    let summary = "";
    const summaryPromise = summarizePromptWithGroq(finalPrompt)
      .then(res => { summary = res; })
      .catch(() => { summary = ""; });

    try {
      const [base64Url] = await Promise.all([
        generateWithCloudflare(options),
        summaryPromise
      ]);
      
      clearInterval(progressInterval);

      // Save creation to IndexedDB
      const saved = await saveCreation({
        url: base64Url,
        prompt: finalPrompt,
        model: isAgent ? `${modelName} (Agent Enhanced)` : modelName,
        ratio: ratio,
        summary: summary
      });



      // Update active workspace IDs in sessionStorage (replace creationId with the saved database ID)
      const activeIds = getActiveWorkspaceIds();
      const updatedIds = activeIds.map(val => val === id ? saved.id!.toString() : val);
      saveActiveWorkspaceIds(updatedIds);

      // Update local workspace creation to success
      setWorkspaceCreations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            id: saved.id!.toString(),
            url: base64Url,
            progress: 100,
            step: 'ready for first sight...',
            status: 'success',
            model: isAgent ? `${modelName} (Agent Enhanced)` : modelName,
            summary: summary
          };
        }
        return item;
      }));

      // Update general app states so they show in history
      setHistoryImages(prev => [saved, ...prev]);

    } catch (err) {
      console.error("Cloudflare generation failed in workspace:", err);
      
      clearInterval(progressInterval);

      setWorkspaceCreations(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            progress: 0,
            step: 'Generation failed',
            status: 'failed'
          };
        }
        return item;
      }));

      setNotificationMsg('Generation failed: API Error.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleGenerate = async () => {
    const promptText = promptInput.trim();
    if (!promptText) return;

    // Switch to workspace mode
    setIsWorkspaceMode(true);
    
    // Clear prompt input so they can generate more
    setPromptInput('');

    const creationId = Date.now().toString();
    const newCreation: WorkspaceCreation = {
      id: creationId,
      prompt: promptText,
      model: selectedMode === 'agent' ? `${selectedModel} (Agent Enhanced)` : selectedModel,
      ratio: selectedRatio,
      progress: 0,
      step: 'Creating image...',
      status: 'generating'
    };

    // Save temporary ID to sessionStorage active list
    const activeIds = getActiveWorkspaceIds();
    activeIds.unshift(creationId);
    
    // Remove failed items from active list
    const activeWorkspaceIds = activeIds.filter(id => {
      const item = workspaceCreations.find(w => w.id === id);
      return !item || item.status !== 'failed';
    });
    saveActiveWorkspaceIds(activeWorkspaceIds);

    // Remove any failed cards from the workspace when starting a new generation
    setWorkspaceCreations(prev => [newCreation, ...prev.filter(item => item.status !== 'failed')]);

    // Trigger the actual generation asynchronously
    triggerWorkspaceGeneration(creationId, promptText, selectedRatio, selectedMode, selectedModel);
  };

  const handleRetry = (creation: WorkspaceCreation) => {
    const cleanModelName = creation.model.replace(" (Agent Enhanced)", "");
    const creationId = Date.now().toString();
    const newCreation: WorkspaceCreation = {
      id: creationId,
      prompt: creation.prompt,
      model: creation.model,
      ratio: creation.ratio,
      progress: 0,
      step: 'Creating image...',
      status: 'generating'
    };

    // Remove the failed creation card being retried from active workspace IDs
    const activeIds = getActiveWorkspaceIds().filter(val => val !== creation.id);
    activeIds.unshift(creationId);
    saveActiveWorkspaceIds(activeIds);

    // Remove the failed creation card being retried from the workspace state
    setWorkspaceCreations(prev => [newCreation, ...prev.filter(item => item.id !== creation.id)]);
    triggerWorkspaceGeneration(creationId, creation.prompt, creation.ratio, creation.model.includes('Agent') ? 'agent-skip-enhance' : 'image', cleanModelName);
  };

  const copyImageToClipboard = async (imageUrl: string) => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setNotificationMsg('Image copied to clipboard!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy image to clipboard:', err);
      // Fallback: write image URL to clipboard
      await navigator.clipboard.writeText(imageUrl);
      setNotificationMsg('Copied image link to clipboard.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await deleteCreation(id);
      setHistoryImages(prev => prev.filter(img => img.id !== id));
      setWorkspaceCreations(prev => prev.filter(img => img.id !== id.toString()));
      
      // Remove from active workspace IDs in sessionStorage
      const activeIds = getActiveWorkspaceIds().filter(val => val !== id.toString());
      saveActiveWorkspaceIds(activeIds);



      setNotificationMsg('Image deleted from history.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (err) {
      console.error('Failed to delete creation:', err);
    }
  };


  const handleExitWorkspace = () => {
    setIsWorkspaceMode(false);
    setWorkspaceCreations([]);
    sessionStorage.removeItem('imagine_activeWorkspaceIds');
  };

  if (isWorkspaceMode) {
    return (
      <ActiveWorkspace
        workspaceCreations={workspaceCreations}
        handleExitWorkspace={handleExitWorkspace}
        copyImageToClipboard={copyImageToClipboard}
        setNotificationMsg={setNotificationMsg}
        setShowNotification={setShowNotification}
        handleRetry={handleRetry}
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        isEnhancing={isEnhancing}
        selectedMode={selectedMode}
        handleModeChange={handleModeChange}
        selectedRatio={selectedRatio}
        setSelectedRatio={setSelectedRatio}
        showRatioDropdown={showRatioDropdown}
        setShowRatioDropdown={setShowRatioDropdown}
        handleGenerate={handleGenerate}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        showModelDropdown={showModelDropdown}
        setShowModelDropdown={setShowModelDropdown}
        originalPrompt={originalPrompt}
        handleUndoPrompt={handleUndoPrompt}
      />
    );
  }

  return (
    <div className="imagine-layout">
      {/* Scrollable Main Content */}
      <div className="imagine-scrollable-container">
        {/* Soft decorative background blobs in the upper border */}
        <div className="page-bg-blob page-bg-blob-blue"></div>
        <div className="page-bg-blob page-bg-blob-skin"></div>
        <div className="page-bg-blob page-bg-blob-purple"></div>
        
        {/* Floating Notification */}
        {showNotification && (
          <div className="imagine-notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="notification-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Hero Header */}
        <header className="imagine-header">
          <h1 className="imagine-title">
            Imagine Limitless Visuals
          </h1>
          <p className="imagine-subtitle">
            {activeTab === 'showroom' ? (
              "Experience next-generation image generation. Input custom prompts to render stunning photography, surreal digital art, and abstract renders."
            ) : (
              "View, manage, and download your previously generated designs. Copy, share, download, view, or delete your creations instantly."
            )}
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="imagine-navigation-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'showroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('showroom')}
          >
            Explore Showroom
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            My History ({historyImages.length})
          </button>
        </div>

        {activeTab === 'showroom' ? (
          <Showroom
            recentImages={recentImages}
            historyImages={historyImages}
            galleryImages={galleryImages}
            copyImageToClipboard={copyImageToClipboard}
          />
        ) : (
          <HistoryView
            historyImages={historyImages}
            copyImageToClipboard={copyImageToClipboard}
            handleDeleteImage={handleDeleteImage}
            setEditingImage={setEditingImage}
          />
        )}
      </div>

      {/* Capsule Input Panel */}
      {activeTab === 'showroom' && (
        <InputPanel 
          promptInput={promptInput}
          setPromptInput={setPromptInput}
          isGenerating={false}
          isEnhancing={isEnhancing}
          selectedMode={selectedMode}
          setSelectedMode={handleModeChange}
          selectedRatio={selectedRatio}
          setSelectedRatio={setSelectedRatio}
          showRatioDropdown={showRatioDropdown}
          setShowRatioDropdown={setShowRatioDropdown}
          onGenerate={handleGenerate}
          ratios={RATIOS}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          showModelDropdown={showModelDropdown}
          setShowModelDropdown={setShowModelDropdown}
          models={MODELS}
          originalPrompt={originalPrompt}
          onUndo={handleUndoPrompt}
        />
      )}

      {editingImage && (
        <div className="imagine-editor-modal-overlay">
          <button 
            className="imagine-editor-back-btn"
            onClick={() => setEditingImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
          <EditorPage
            source={editingImage.url}
            onClose={() => setEditingImage(null)}
            onSave={async (editedBase64) => {
              try {
                // Save edited image as a new creation
                const saved = await saveCreation({
                  url: editedBase64,
                  prompt: `Edited: ${editingImage.prompt}`,
                  model: `${editingImage.model} (Edited)`,
                  ratio: editingImage.ratio
                });
                
                // Update local list states
                setHistoryImages(prev => [saved, ...prev]);
                setRecentImages(prev => [saved, ...prev]);
                
                setNotificationMsg('Image edited and saved to history!');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 2000);
              } catch (err) {
                console.error("Failed to save edited creation:", err);
                setNotificationMsg('Failed to save edited image.');
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 2000);
              } finally {
                setEditingImage(null);
              }
            }}
          />
        </div>
      )}



    </div>
  );
}
