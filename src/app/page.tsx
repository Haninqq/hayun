'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';
import { HAICInputSection } from '@/components/haic-input-section';
import { HAICResultSection } from '@/components/haic-result-section';
import { AnalysisResult } from '@/lib/types';

const guideSchema = z.object({
  aiTasks: z.array(z.string()),
  humanTasks: z.array(z.string()),
  direction: z.string(),
  effect: z.string(),
  tools: z.array(z.object({
    name: z.string(),
    description: z.string(),
    tag: z.string()
  })),
  education: z.array(z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string())
  }))
});

export default function Home() {
  const [jobInput, setJobInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    object: aiGuide,
    submit,
    isLoading: isStreaming,
  } = useObject({
    api: '/api/guide',
    schema: guideSchema,
  });

  const handleSubmit = async () => {
    if (!jobInput.trim() || !taskInput.trim()) return;

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // 1. CSV 검색 API 호출
      const searchResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobInput, task: taskInput }),
      });

      if (!searchResponse.ok) {
        const error = await searchResponse.json();
        throw new Error(error.error || '분석에 실패했습니다.');
      }

      const { result } = await searchResponse.json();
      setAnalysisResult(result);
      setIsLoading(false);

      // 2. AI 가이드 스트리밍 호출
      submit({
        job: jobInput,
        task: taskInput,
        level: result.record.협업강도,
        evidence: result.record.협업강도근거,
      });
    } catch (error) {
      console.error('Submit error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[oklch(0.7_0.18_270_/_0.04)] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[oklch(0.6_0.15_220_/_0.04)] rounded-full blur-[100px]" />
      </div>

      <HAICInputSection
        jobInput={jobInput}
        taskInput={taskInput}
        isLoading={isLoading}
        onJobChange={setJobInput}
        onTaskChange={setTaskInput}
        onSubmit={handleSubmit}
      />

      <HAICResultSection
        result={analysisResult}
        jobInput={jobInput}
        taskInput={taskInput}
        aiGuide={aiGuide}
        isStreaming={isStreaming}
      />
    </div>
  );
}
