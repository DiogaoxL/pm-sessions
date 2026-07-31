/**
 * Feature Flags Configuration Module
 * Allows toggleable functionality without redeploying.
 */

export const FEATURE_FLAGS = {
  /**
   * Google Calendar integration toggle
   */
  isGoogleCalendarEnabled(): boolean {
    if (process.env.FEATURE_GOOGLE_CALENDAR === 'false') {
      return false;
    }
    return true;
  },

  /**
   * Auto Allocation of hosts toggle
   */
  isAutoAllocationEnabled(): boolean {
    if (process.env.FEATURE_AUTO_ALLOCATION === 'false') {
      return false;
    }
    return true;
  },

  /**
   * Public scheduling page toggle
   */
  isPublicPageEnabled(): boolean {
    if (process.env.FEATURE_PUBLIC_PAGE === 'false') {
      return false;
    }
    return true;
  },
};
