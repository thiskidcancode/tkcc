/**
 * Type definitions for the Waitlist API
 */

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  twilioOptIn: boolean;
  registeredAt: Date;
  position: number;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
  totalCount?: number;
}

export interface WaitlistRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  twilioOptIn: boolean;
}

export interface WaitlistData {
  entries: WaitlistEntry[];
  metadata: {
    startCount: number;
    lastPosition: number;
  };
}

export interface RateLimitRecord {
  ip: string;
  registrations: number[];
  lastCleanup: number;
}
