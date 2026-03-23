export interface Plant {
  id: number;
  name: string;
  description: string;
  locationName: string;
  latitude: number;
  longitude: number;
  allowedRadiusMeter: number;
  currentStatus: 'NORMAL' | 'THIRSTY' | 'DANGER';
  thresholdHours: number;
  mainImageUrl: string;
  qrCodeUrl: string;
  updatedAt: string;
}

export interface PlantLog {
  id: number;
  plantId: number;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  watered: boolean;
  isHealthy: boolean;
  hasIssue: boolean;
  issueNote: string | null;
  relayMessage: string | null;
  guardianOrder: number;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  createdAt: string;
}

export interface Comment {
  id: number;
  plantLogId: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface PlantLogRequest {
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  watered: boolean;
  isHealthy: boolean;
  hasIssue: boolean;
  issueNote: string;
  relayMessage: string;
}
