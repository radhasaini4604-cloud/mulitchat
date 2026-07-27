import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';

interface EditorPageProps {
  source: string;
  onSave: (editedImage: string) => void;
  onClose: () => void;
}

export function EditorPage({ source, onSave, onClose }: EditorPageProps) {
  const handleSave = (editedImageObject: any) => {
    console.log('Filerobot saved image object:', editedImageObject);
    if (editedImageObject?.imageBase64) {
      onSave(editedImageObject.imageBase64);
    } else if (editedImageObject?.url) {
      onSave(editedImageObject.url);
    }
  };

  return (
    <FilerobotImageEditor
      source={source}
      onSave={handleSave}
      onClose={onClose}
      annotationsCommon={{
        fill: '#ff0000',
      }}
      theme={{
        palette: {
          'accent-primary': '#581c87', // Dark purple
          'accent-primary-active': '#3b0764',
          'accent-primary-hover': '#7e22ce',
        },
      }}
      previewPixelRatio={1}
      savingPixelRatio={1}
      observePluginContainerSize={false}
      Rotate={{
        componentType: 'buttons',
      }}
      tabsIds={[
        TABS.ADJUST,
        TABS.ANNOTATE,
        TABS.FILTERS,
        TABS.FINETUNE,
        TABS.RESIZE,
      ]}
      defaultTabId={TABS.ADJUST}
      defaultToolId={TOOLS.CROP}
    />
  );
}
