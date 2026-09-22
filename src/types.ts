export type ToneStyle = 'spiritual' | 'health' | 'fengshui' | 'life';

export interface Speaker {
  id: string;
  name: string;
  role: string;
  style: string;
  pronounSelf: string; // "Thầy", "Bác sĩ", "Tôi"...
  pronounOther: string; // Gọi đối phương hoặc đồng nghiệp: "đạo hữu", "MC", "anh"...
  pronounAudience: string; // Gọi khán giả/thính giả: "Đại chúng!", "quý vị khán thính giả"...
  isActive: boolean;
}

export interface ChunkState {
  index: number;
  originalText: string;
  generatedText: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  error?: string;
  retryCount?: number;
}

export interface PodcastConfig {
  toneStyle: ToneStyle;
  expansionRate: number; // 1.0, 1.2, 1.5
  targetChunkSize: number; // 2000 to 3000
  speakers: Speaker[];
}
