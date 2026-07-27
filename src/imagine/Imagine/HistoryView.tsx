import { HistorySection } from '../components/HistorySection';
import type { SavedCreation } from '../utils/db';
import './ShowroomHistory.css';

interface HistoryViewProps {
  historyImages: SavedCreation[];
  copyImageToClipboard: (url: string) => void;
  handleDeleteImage: (id: number) => void;
  setEditingImage: (img: SavedCreation) => void;
}

export function HistoryView({
  historyImages,
  copyImageToClipboard,
  handleDeleteImage,
  setEditingImage
}: HistoryViewProps) {
  return (
    <HistorySection 
      images={historyImages} 
      onCopyImage={copyImageToClipboard} 
      onDeleteImage={handleDeleteImage}
      onEditImage={setEditingImage}
    />
  );
}
