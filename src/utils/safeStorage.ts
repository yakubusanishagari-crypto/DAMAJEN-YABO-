/**
 * Safe LocalStorage Utility
 * Wraps localStorage calls in try/catch and handles QuotaExceededError gracefully
 * so an unhandled storage exception NEVER crashes React or renders a blank white screen.
 */

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`LocalStorage quota exceeded or unavailable while writing "${key}":`, error);
    try {
      // Emergency recovery: prune disposable cache/log keys first
      const purgeKeys = [
        'danmaje_activity_logs', 
        'danmaje_audit_trail', 
        'danmaje_analytics', 
        'danmaje_recent_events',
        'danmaje_townhall_topics',
        'danmaje_election_reports'
      ];
      for (const p of purgeKeys) {
        if (p !== key) {
          try {
            localStorage.removeItem(p);
          } catch {}
        }
      }
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.error(`Failed to store "${key}" even after emergency pruning:`, retryError);
      return false;
    }
  }
}

export function safeGetItem(key: string, defaultValue = ''): string {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : defaultValue;
  } catch (error) {
    console.warn(`LocalStorage read failed for "${key}":`, error);
    return defaultValue;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

