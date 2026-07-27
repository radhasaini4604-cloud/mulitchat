import { CreationsRow } from '../components/CreationsRow';
import { CreationsMasonry } from '../components/CreationsMasonry';
import type { ImageData } from '../utils/types';
import type { SavedCreation } from '../utils/db';
import './ShowroomHistory.css';

interface ShowroomProps {
  recentImages: ImageData[];
  historyImages: SavedCreation[];
  galleryImages: ImageData[];
  copyImageToClipboard: (url: string) => void;
}

export function Showroom({
  recentImages,
  historyImages,
  galleryImages,
  copyImageToClipboard
}: ShowroomProps) {
  return (
    <>
      {/* Top Visuals Row (Horizontal Scroll) */}
      <CreationsRow 
        images={recentImages} 
        onCopyPrompt={copyImageToClipboard} 
        title="Top Visuals"
      />

      {/* Your Recent Creations Row (Horizontal Scroll) */}
      <CreationsRow 
        images={historyImages} 
        onCopyPrompt={copyImageToClipboard} 
        title="Your Recent Creations"
        emptyPlaceholder="Your generated creations will appear here. Try creating one below!"
      />

      {/* Community Showroom (Masonry preserving aspect ratio) */}
      <CreationsMasonry 
        images={galleryImages} 
        onCopyPrompt={copyImageToClipboard} 
        title="Community Showroom"
      />
    </>
  );
}
