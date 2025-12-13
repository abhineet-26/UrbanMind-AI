export enum IssueType {
  POTHOLE = "POTHOLE",
  SANITATION = "SANITATION",
  LIGHTING = "LIGHTING",
  DRAINAGE = "DRAINAGE",
  VEGETATION = "VEGETATION",
  SIGNAGE = "SIGNAGE",
  GRAFFITI = "GRAFFITI",
  OTHER = "OTHER",
  CLEAN = "CLEAN"
}

export interface Incident {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  severity: number; // 1-10
  lat: number;
  lng: number;
  timestamp: string;
  status: 'PENDING' | 'ANALYZED' | 'DISPATCHED' | 'RESOLVED';
  imageUrl?: string;
  suggestedAction?: string;
}

export interface Stats {
  total: number;
  critical: number;
  resolved: number;
  avgResponseTime: string;
}

export interface AnalysisResponse {
  issue_type: IssueType;
  severity: number;
  title: string;
  description: string;
  suggested_action: string;
  visual_reasoning: string;
}
