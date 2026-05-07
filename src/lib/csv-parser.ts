import Papa from 'papaparse';
import { HAICRecord, HAICLevel, AnalysisResult, SearchQuery } from './types';
import fs from 'fs';
import path from 'path';

// CSV 파싱 함수 (서버 사이드 전용)
export function parseCSV(): HAICRecord[] {
  const csvPath = path.join(process.cwd(), 'data', 'HAIC_database.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  const records: HAICRecord[] = (result.data as Record<string, string>[])
    .filter((row) => {
      // 빈 행 또는 협업 강도가 없는 행 필터링
      const level = row['AI 협업 강도']?.trim();
      return level && ['High', 'Medium', 'Low'].includes(level);
    })
    .map((row) => ({
      직무단위: (row['직무 단위'] || '').trim(),
      업무단위: (row['업무(기능) 단위'] || '').trim(),
      동사키워드: (row['동사 키워드 정리'] || '').trim(),
      세부동사: (row['세부 동사 추출'] || '').trim(),
      협업강도: (row['AI 협업 강도'] || '').trim() as HAICLevel,
      협업강도근거: (row['협업 강도 근거'] || '').trim(),
    }));

  return records;
}

// 텍스트 유사도 계산 (간단한 토큰 기반 유사도)
function calculateSimilarity(query: string, target: string): number {
  if (!query || !target) return 0;

  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎ가-힣]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const targetLower = target.toLowerCase();

  if (queryTokens.length === 0) return 0;

  let matchCount = 0;
  for (const token of queryTokens) {
    if (targetLower.includes(token)) {
      matchCount++;
    }
  }

  // 정확한 문자열 포함 보너스
  if (targetLower.includes(query.toLowerCase())) {
    matchCount += queryTokens.length;
  }

  return matchCount / queryTokens.length;
}

// 검색 함수: 직무 + 업무를 기반으로 가장 유사한 레코드를 반환
export function searchRecords(
  records: HAICRecord[],
  query: SearchQuery
): AnalysisResult[] {
  const results: AnalysisResult[] = records.map((record) => {
    // 직무 유사도 (가중치 0.3)
    const jobSim = calculateSimilarity(query.job, record.직무단위);
    // 업무 유사도 (가중치 0.5)
    const taskSim = calculateSimilarity(query.task, record.업무단위);
    // 동사 키워드 유사도 (가중치 0.1)
    const verbSim = calculateSimilarity(query.task, record.동사키워드);
    // 세부 동사 유사도 (가중치 0.1)
    const detailVerbSim = calculateSimilarity(query.task, record.세부동사);

    const similarity =
      jobSim * 0.3 + taskSim * 0.5 + verbSim * 0.1 + detailVerbSim * 0.1;

    return { record, similarity };
  });

  // 유사도 기준 내림차순 정렬
  return results
    .filter((r) => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5); // 상위 5개 결과
}
