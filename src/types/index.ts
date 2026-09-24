export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  features: string[];
  startingPrice: number | string;
  active: boolean;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  location: string;
  serviceType: string;
  description: string;
  beforeImage?: string;
  afterImage: string;
  gallery: string[];
  completedDate: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type QuoteStatus = 'Pending' | 'Contacted' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';

export interface Quote {
  id?: string;
  customerId?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  serviceId?: string;
  serviceName: string;
  preferredDate?: string;
  message?: string;
  photoUrls?: string[];
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  estimatedCost?: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface Testimonial {
  id?: string;
  customerName: string;
  customerPhoto?: string;
  rating: number;
  text: string;
  service: string;
  approved: boolean;
  createdAt: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order: number;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  authorId?: string;
  authorName?: string;
  published: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CompanySettings {
  companyName: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  heroTitle: string;
  heroDescription: string;
  footerText: string;
}

export interface NotificationItem {
  id?: string;
  userId?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
