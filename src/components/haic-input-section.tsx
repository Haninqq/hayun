'use client';

import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HAICInputSectionProps {
  jobInput: string;
  taskInput: string;
  isLoading: boolean;
  onJobChange: (value: string) => void;
  onTaskChange: (value: string) => void;
  onSubmit: () => void;
}

export function HAICInputSection({
  jobInput,
  taskInput,
  isLoading,
  onJobChange,
  onTaskChange,
  onSubmit,
}: HAICInputSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && jobInput.trim() && taskInput.trim()) {
      onSubmit();
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 pt-12 pb-8">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.18_270_/_0.1)] border border-[oklch(0.7_0.18_270_/_0.2)] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[oklch(0.75_0.18_270)]" />
          <span className="text-xs font-medium text-[oklch(0.75_0.18_270)]">
            AI 협업 가이드 시스템
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text tracking-tight leading-tight mb-3">
          Human–AI
          <br />
          Collaboration Guide
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
          직무와 업무를 입력하면 AI 협업 강도를 판별하고
          <br />
          최적의 협업 가이드를 제공합니다.
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="job-input"
              className="text-xs font-medium text-muted-foreground pl-1"
            >
              직무
            </label>
            <Input
              id="job-input"
              type="text"
              placeholder="직무를 입력하세요... (예: 마케터, 개발자)"
              value={jobInput}
              onChange={(e) => onJobChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                h-12 bg-secondary/50 border-border/50
                placeholder:text-muted-foreground/40
                focus:bg-secondary focus:border-[oklch(0.7_0.18_270_/_0.4)]
                text-sm
              "
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor="task-input"
              className="text-xs font-medium text-muted-foreground pl-1"
            >
              업무
            </label>
            <Input
              id="task-input"
              type="text"
              placeholder="업무를 입력하세요... (예: 수요 예측, 코드 리뷰)"
              value={taskInput}
              onChange={(e) => onTaskChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                h-12 bg-secondary/50 border-border/50
                placeholder:text-muted-foreground/40
                focus:bg-secondary focus:border-[oklch(0.7_0.18_270_/_0.4)]
                text-sm
              "
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <Button
            id="analyze-button"
            onClick={onSubmit}
            disabled={!jobInput.trim() || !taskInput.trim() || isLoading}
            className="
              h-12 px-8
              bg-[oklch(0.65_0.2_270)]
              hover:bg-[oklch(0.7_0.22_270)]
              text-white font-semibold
              disabled:opacity-40 disabled:pointer-events-none
              rounded-xl
            "
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>분석 중...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>분석하기</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
