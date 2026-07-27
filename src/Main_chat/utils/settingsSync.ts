import { supabase } from '../../lib/supabase';

// Prefixes for keys that we want to sync to the cloud
const SYNCABLE_PREFIXES = [
  'personalization-',
  'settings-',
  'parental-',
  'datacontrol-',
  'imagine_selectedModel',
  'imagine_activeTab',
  'imagine_isWorkspaceMode'
];

function isSyncable(key: string): boolean {
  return SYNCABLE_PREFIXES.some(prefix => key.startsWith(prefix));
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Sets a setting in localStorage and schedules a sync to Supabase user metadata.
 * @param key The setting key (e.g. 'personalization-base-style')
 * @param value The value to save
 */
export function setAppSetting(key: string, value: string) {
  // Always update local storage immediately for synchronous reads
  localStorage.setItem(key, value);

  // If it's not a syncable key, we don't push it to the cloud
  if (!isSyncable(key)) return;

  // Debounce the cloud sync
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(() => {
    syncToCloud();
  }, 200); // 200ms debounce for near-instant sync
}

// Flush pending settings immediately before the page unloads/refreshes
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncToCloud();
    }
  });
}

/**
 * Gathers all syncable settings from localStorage and pushes them to Supabase.
 */
async function syncToCloud() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return;
    }
    if (!user) {
      return;
    }

    const currentMetadata = user.user_metadata || {};
    const appSettings: Record<string, string> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isSyncable(key)) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          appSettings[key] = val;
        }
      }
    }

    const newMetadata = {
      ...currentMetadata,
      app_settings: appSettings
    };

    await supabase.auth.updateUser({
      data: newMetadata
    });
  } catch (err) {
    // Fail silently to keep console clean
  }
}

/**
 * Pulls settings from Supabase user metadata and populates localStorage.
 * Call this on app load or user login.
 */
export async function pullSettingsFromCloud() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const metadata = user.user_metadata || {};
    const appSettings = metadata.app_settings;

    if (appSettings && typeof appSettings === 'object' && Object.keys(appSettings).length > 0) {
      let changed = false;
      for (const [key, value] of Object.entries(appSettings)) {
        if (isSyncable(key)) {
          const localVal = localStorage.getItem(key);
          // Only write if it's different to avoid unnecessary writes
          if (localVal !== String(value)) {
            localStorage.setItem(key, String(value));
            changed = true;
          }
        }
      }

      // Check if local storage has syncable keys not present in the cloud settings
      let needsUpload = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && isSyncable(key)) {
          if (!(key in appSettings)) {
            needsUpload = true;
            break;
          }
        }
      }

      if (needsUpload) {
        await syncToCloud();
      }

      // If settings changed, dispatch generic event and specific events
      if (changed) {
        window.dispatchEvent(new Event('app_settings_synced'));

        // Dispatch specific events the UI is already listening to
        window.dispatchEvent(new Event('settings-theme-changed'));
        window.dispatchEvent(new Event('settings-accent-changed'));
        window.dispatchEvent(new Event('settings-dictation-changed'));
        window.dispatchEvent(new Event('settings-bg-bulbs-changed'));
        window.dispatchEvent(new Event('settings-smart-scroll-changed'));
        window.dispatchEvent(new Event('personalization-settings-updated'));
      }
    } else {
      // Cloud settings don't exist yet, upload local settings so they persist for all devices
      await syncToCloud();
    }
  } catch (err) {
    // Fail silently to keep console clean
  }
}

/**
 * Clears all synced settings from local storage on logout.
 */
export function clearCloudSettingsFromLocal() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isSyncable(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  // Dispatch event so UI can reset to defaults if needed
  window.dispatchEvent(new Event('app_settings_synced'));
}
