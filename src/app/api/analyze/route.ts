import { NextRequest, NextResponse } from 'next/server';
import { parseCSV, searchRecords } from '@/lib/csv-parser';

export async function POST(request: NextRequest) {
  try {
    const { job, task } = await request.json();

    if (!job || !task) {
      return NextResponse.json(
        { error: '직무와 업무를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const records = parseCSV();
    const results = searchRecords(records, { job, task });

    if (results.length === 0) {
      return NextResponse.json(
        { error: '일치하는 데이터를 찾지 못했습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: results[0],
      alternatives: results.slice(1),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
