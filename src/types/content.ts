import { Timestamp } from "firebase/firestore";

export interface FirestoreAuthor {
  name: string;
  role: string;
  image?: string;
}

export interface FirestoreContentHubItem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  platform: 'Blogger' | 'Medium' | 'Portfolio' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'X' | 'Threads' | 'Podcast' | 'Case Study' | 'Resource';
  contentType: 'Blog' | 'Video' | 'Short' | 'Social Post' | 'Case Study' | 'Resource' | 'Audio';
  category: 'SEO Tips' | 'Marketing' | 'AI' | 'Growth' | 'Compliance' | 'Retention' | 'Video';
  tags: string[];
  url: string;
  featured: boolean;
  publishedDate: Timestamp | Date;
  readTime: string;
  views?: number;
  likes?: number;
  author: FirestoreAuthor;
  status: 'Published' | 'Draft' | string;
  visibility: 'public' | 'private' | string;
  
  deletedAt?: Timestamp | Date | null;
  archivedAt?: Timestamp | Date | null;
  createdAt?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
}

export interface ContentHubItem {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  thumbnail: string;
  platform: 'Blogger' | 'Medium' | 'Portfolio' | 'Instagram' | 'YouTube' | 'LinkedIn' | 'X' | 'Threads' | 'Podcast' | 'Case Study' | 'Resource';
  contentType: 'Blog' | 'Video' | 'Short' | 'Social Post' | 'Case Study' | 'Resource' | 'Audio';
  category: 'SEO Tips' | 'Marketing' | 'AI' | 'Growth' | 'Compliance' | 'Retention' | 'Video';
  tags: string[];
  url: string;
  featured: boolean;
  publishedDate: Date;
  readTime: string;
  views?: number;
  likes?: number;
  author: FirestoreAuthor;
  status: string;
  visibility: string;
  
  deletedAt?: Date | null;
  archivedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
}
