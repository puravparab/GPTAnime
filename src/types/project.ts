export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  status?: 'completed' | 'processing' | 'error';
  images?: string[];
  prompt?: string;
  style?: string;
  generatedImages?: string[];
  originalImages?: string[];
  lastTransformed?: string;
  model?: string;
} 