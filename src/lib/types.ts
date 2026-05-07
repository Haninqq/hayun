// HAIC 데이터베이스 타입 정의

export type HAICLevel = 'High' | 'Medium' | 'Low';

export interface HAICRecord {
  직무단위: string;
  업무단위: string;
  동사키워드: string;
  세부동사: string;
  협업강도: HAICLevel;
  협업강도근거: string;
}

export interface AnalysisResult {
  record: HAICRecord;
  similarity: number;
  aiGuide?: string;
}

export interface SearchQuery {
  job: string;
  task: string;
}
