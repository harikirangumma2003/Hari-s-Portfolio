export interface AutomationSettings {
  mediumEnabled: boolean;
  youtubeEnabled: boolean;
  linkedinEnabled: boolean;
  instagramEnabled: boolean;
  threadsEnabled: boolean;
  xEnabled: boolean;
  autoSync: boolean;
  syncInterval: number; // in minutes
  lastGlobalSync: Date | null;
}

export interface SyncLog {
  id?: string;
  platform: string;
  startedAt: Date;
  completedAt: Date;
  status: 'success' | 'failed';
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  duration: number; // in milliseconds
  errors: string[];
}

export interface RawPlatformItem {
  id: string; // The platform's unique identifier (e.g. RSS guid)
  title: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  authorName: string;
  url: string;
  publishedDate: Date;
  categories: string[];
  views?: number;
  likes?: number;
  raw?: any; // Original structure in case needed
}

export interface ContentImporter {
  platformName: string;
  fetchAndParse(): Promise<RawPlatformItem[]>;
}
