'use client';

import { AnalysisResult } from '@/lib/types';
import { Bot, User, Zap, Circle, CheckCircle2 } from 'lucide-react';

interface HAICResultSectionProps {
  result: AnalysisResult | null;
  jobInput: string;
  taskInput: string;
  aiGuide: any;
  isStreaming: boolean;
}

export function HAICResultSection({
  result,
  jobInput,
  taskInput,
  aiGuide,
  isStreaming,
}: HAICResultSectionProps) {
  if (!result) return null;

  const level = result.record.협업강도;
  
  let levelText = '';
  let dotIndex = 0;

  if (level === 'Low') {
    levelText = '인간 주도';
    dotIndex = 0;
  } else if (level === 'Medium') {
    levelText = '공동 주도';
    dotIndex = 1;
  } else {
    levelText = 'AI 주도';
    dotIndex = 2;
  }

  const aiTasks = aiGuide?.aiTasks || [];
  const humanTasks = aiGuide?.humanTasks || [];
  const direction = aiGuide?.direction || '';
  const effect = aiGuide?.effect || '';
  const tools = aiGuide?.tools || [];
  const education = aiGuide?.education || [];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-20 font-sans text-gray-900">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500">HAIC 진단 결과</span>
            <span className="px-3 py-1 bg-[#f0f0ff] text-[#6366f1] text-xs rounded-full font-bold border border-[#e0e0ff]">
              {levelText}
            </span>
            <span className="px-3 py-1 bg-[#f0fff4] text-[#10b981] text-xs rounded-full font-bold border border-[#d1fae5]">
              {result.record.동사키워드.split('/')[0] || '동사'}
            </span>
          </div>
          <span className="text-xs text-gray-400">DB 기반 자동 판정</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">{jobInput} · {result.record.업무단위}</div>
          <h2 className="text-2xl font-bold text-gray-900">{taskInput}</h2>
        </div>

        {/* Progress Bar UI */}
        <div className="relative w-full h-4 bg-gray-100 rounded-full mb-16 flex items-center mt-14">
          {/* Active Bar */}
          <div 
            className="absolute left-0 h-full bg-[#6366f1] rounded-full transition-all duration-500" 
            style={{ width: dotIndex === 0 ? '10%' : dotIndex === 1 ? '50%' : '100%' }}
          />
          
          {/* Dots */}
          <div className="absolute w-full flex justify-between px-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative flex justify-center items-center">
                <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 transition-colors ${i <= dotIndex ? 'bg-[#6366f1]' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 rounded-full ${i <= dotIndex ? 'bg-white/90' : 'bg-gray-400'}`} />
                </div>
                {i === dotIndex && (
                  <div className="absolute -top-14 bg-[#6366f1] text-white px-4 py-2 rounded-xl text-lg font-bold shadow-sm whitespace-nowrap">
                    {levelText}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#6366f1]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
              <h3 className="font-bold text-gray-900">AI가 할 것</h3>
            </div>
            <ul className="space-y-3">
              {aiTasks.map((task: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-[#6366f1] mt-0.5">›</span> {task}
                </li>
              ))}
              {isStreaming && aiTasks.length === 0 && <span className="text-sm text-gray-400">분석 중...</span>}
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
              <h3 className="font-bold text-gray-900">인간이 할 것</h3>
            </div>
            <ul className="space-y-3">
              {humanTasks.map((task: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-[#3b82f6] mt-0.5">›</span> {task}
                </li>
              ))}
              {isStreaming && humanTasks.length === 0 && <span className="text-sm text-gray-400">분석 중...</span>}
            </ul>
          </div>
        </div>

        {/* Direction */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" />
            <h3 className="font-bold text-gray-900">AI 주도적 협업 방향성</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {direction || (isStreaming ? '분석 중...' : '')}
          </p>
        </div>

        {/* Expected Effect */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-amber-700">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold">AI 기대 효과</h3>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            {effect || (isStreaming ? '분석 중...' : '')}
          </p>
        </div>

        {/* Tools */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <h3 className="font-bold text-gray-900">사용 가능한 AI 기능 및 도구</h3>
          </div>
          <div className="space-y-3">
            {tools.map((tool: any, i: number) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{tool.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                  {tool.tag && (
                    <span className="inline-block px-2 py-1 bg-[#f0f0ff] text-[#6366f1] text-xs rounded-md border border-[#e0e0ff]">
                      {tool.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && tools.length === 0 && <div className="text-sm text-gray-400">분석 중...</div>}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <h3 className="font-bold text-gray-900">교육 인터벤션 예시</h3>
            <span className="text-xs text-gray-500 ml-2">위 도구를 업무에 적용하기 위한 학습 경로</span>
          </div>
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{edu.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{edu.description}</p>
                  <div className="flex gap-2">
                    {edu.tags?.map((tag: string, j: number) => (
                      <span key={j} className="inline-block px-2 py-1 bg-white text-gray-600 text-xs rounded-md border border-gray-200 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isStreaming && education.length === 0 && <div className="text-sm text-gray-400">분석 중...</div>}
          </div>
        </div>

      </div>
    </section>
  );
}
