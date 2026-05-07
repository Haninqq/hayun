import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export async function POST(request: Request) {
  const { job, task, level, evidence } = await request.json();

  const result = streamObject({
    model: google('gemini-2.5-flash-lite'),
    schema: z.object({
      aiTasks: z.array(z.string()).describe('AI가 수행해야 할 구체적인 업무 리스트 (3개)'),
      humanTasks: z.array(z.string()).describe('인간이 수행해야 할 구체적인 업무 리스트 (3개)'),
      direction: z.string().describe('해당 직무/업무에서 AI와 어떻게 협업해야 하는지 방향성 (2~3문장)'),
      effect: z.string().describe('AI 도입으로 기대되는 구체적인 효과 (1~2문장)'),
      tools: z.array(z.object({
        name: z.string(),
        description: z.string(),
        tag: z.string()
      })).describe('사용 가능한 AI 기능 및 도구 추천 (3개)'),
      education: z.array(z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string())
      })).describe('해당 업무에 AI를 적용하기 위한 교육 인터벤션 예시 (3개)')
    }),
    system: `당신은 인간-AI 협업(HAIC) 전문 컨설턴트입니다. 
사용자의 직무와 업무에 대해 실무적이고 구체적인 AI 협업 가이드를 JSON 형태로 제공합니다.`,
    prompt: `다음 직무와 업무에 대한 AI 협업 가이드를 작성해주세요.

**직무:** ${job}
**업무:** ${task}
**AI 협업 강도:** ${level}
**근거:** ${evidence}

지침:
1. 'AI가 할 것'과 '인간이 할 것'은 실무에서 바로 적용 가능한 수준으로 구체적인 행동(동사형태)으로 작성하세요.
2. 방향성과 기대 효과는 구체적인 수치나 직무 맥락을 포함하면 좋습니다.
3. 도구와 교육 예시는 해당 업무에 가장 적합한 트렌디한 내용을 가상으로 혹은 실제 기반으로 구성해주세요.`,
  });

  return result.toTextStreamResponse();
}
