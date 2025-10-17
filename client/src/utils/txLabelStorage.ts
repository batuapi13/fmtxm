// Simple client-side persistence for transmitter display labels
// Uses localStorage keyed by transmitter id

const KEY_PREFIX = 'txLabel:';

export function getTxLabel(transmitterId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(KEY_PREFIX + transmitterId);
  } catch {
    return null;
  }
}

export function setTxLabel(transmitterId: string, label: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (label.trim().length === 0) {
      window.localStorage.removeItem(KEY_PREFIX + transmitterId);
    } else {
      window.localStorage.setItem(KEY_PREFIX + transmitterId, label);
    }
  } catch {
    // noop
  }
}