import { GoogleGenAI, Type } from '@google/genai';
import type { StudentData, AchievementStandard, EvaluationData } from '../types';

// This interface describes the structured data we expect from Gemini for a single subject.
interface SubjectEvaluationData {
  subject: string;
  standards: AchievementStandard[];
}

/**
 * Uses Gemini to extract and structure evaluation data from raw text.
 * @param ai The GoogleGenAI client instance.
 * @param text The raw text extracted from a PDF.
 * @returns A promise that resolves to structured EvaluationData.
 */
export const extractEvaluationDataFromText = async (
  ai: GoogleGenAI,
  text: string
): Promise<EvaluationData> => {
  const prompt = `
당신은 교육 평가 계획서에서 데이터를 추출하는 AI입니다.
주어진 텍스트에서 과목(subject)과 각 과목에 해당하는 성취기준(achievement standard) 목록을 추출해주세요.

**요구사항:**
1.  텍스트를 분석하여 모든 과목명을 찾아 목록으로 만듭니다.
2.  각 과목별로 연관된 성취기준들을 모두 찾습니다.
3.  각 성취기준에 대해, "[...]" 형식의 고유 ID(예: [2슬01-01])가 있으면 그것을 'id'로 사용합니다. 만약 없다면, 과목명 약어와 숫자를 조합하여 고유한 ID를 생성합니다. (예: 국어 -> kor-1)
4.  결과는 반드시 지정된 JSON 스키마 형식에 맞춰 출력해야 합니다.

**추출할 텍스트:**
---
${text}
---
`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: '과목명 (예: 국어, 수학)',
        },
        standards: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
                description: '고유 식별자 (예: [2슬01-01] 또는 kor-1)',
              },
              text: {
                type: Type.STRING,
                description: '성취기준의 전체 내용',
              },
            },
            required: ['id', 'text'],
          },
        },
      },
      required: ['subject', 'standards'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const parsedResponse: SubjectEvaluationData[] = JSON.parse(response.text);

    // Transform the array from Gemini into the app's EvaluationData structure
    const evaluationData: EvaluationData = {
      subjects: [],
      standards: {},
    };

    for (const subjectData of parsedResponse) {
      evaluationData.subjects.push(subjectData.subject);
      evaluationData.standards[subjectData.subject] = subjectData.standards;
    }

    if (evaluationData.subjects.length === 0) {
        throw new Error("PDF에서 과목 및 성취기준을 추출할 수 없습니다. 파일 내용을 확인해주세요.");
    }
    
    return evaluationData;
  } catch (error) {
    console.error("Gemini API Error during data extraction:", error);
    throw new Error("PDF 내용 분석 중 Gemini API 오류가 발생했습니다.");
  }
};


export const generateComment = async (
  ai: GoogleGenAI,
  student: StudentData,
  allStandards: AchievementStandard[]
): Promise<string> => {

  if (student.standardEvaluations.length === 0) {
    return Promise.resolve('');
  }

  const standardsText = student.standardEvaluations.map((se, index) => {
      const standard = allStandards.find(s => s.id === se.standardId);
      if (!standard) return '';
      return `
---
성취기준 ${index + 1}: "${standard.text}"
- 성취 수준: ${se.achievementLevel}
- 태도: ${se.attitude}
- 생성 중심: ${se.generationFocus}
- 추가 정보: ${se.additionalInfo || '없음'}
---
      `
  }).join('\n');

  const prompt = `
당신은 한국 초등학교 교사를 돕는 전문 AI 어시스턴트입니다.
주어진 정보를 바탕으로 학생의 교과별 평어 문장을 생성하는 임무를 맡았습니다.
평어는 학교 생활기록부에 기재하기에 적합하도록, 정중하고 서술적이며 긍정적인 어조로 작성해야 합니다.

**지시사항:**
1.  제공된 각각의 '성취기준'에 대해, 해당 기준에 지정된 '성취 수준', '태도', '생성 중심', '추가 정보'를 **개별적으로** 반영하여 한 문장씩 설명하는 글을 생성합니다.
2.  각 성취기준별 '생성 중심' 값에 따라 내용의 비중을 조절해야 합니다. '성취 수준 중심'은 성취도 관련 내용을, '태도 중심'은 태도 관련 내용을 더 강조하고, '성취 수준 & 태도 같은 비율'은 둘을 균형 있게 다루어야 합니다.
3.  '추가 정보'가 있는 경우, 관련된 문장에 자연스럽게 내용을 포함시키세요.
4.  각 문장은 간결하고 명료하게 작성합니다.
5.  각 문장의 끝은 '~함', '~임', '~할 수 있음', 또는 '~보임' 중 하나를 사용하여 자연스럽게 끝맺습니다.
6.  모든 문장을 하나의 문단으로 합칩니다. 각 문장은 띄어쓰기 한 칸으로 구분하고, 줄바꿈은 절대 사용하지 마세요.
7.  아래 '결과 예시'의 문체와 형식을 반드시 준수해야 합니다.
8.  매번 약간씩 다른 표현을 사용하여 문장을 생성하여, 여러 학생에게 동일한 내용이 반복되지 않도록 합니다.

**결과 예시:**
- 생활 주변에서 삼각형, 사각형, 원 모양을 다양하게 찾음. 일의 자리에서 받아올림이 있는 두 자리 수의 덧셈 계산 방법을 익혀 문제를 바르게 해결함.
- 삼각형의 개념을 이해하고 특징을 바르게 설명할 수 있음. 객관적인 분류 기준을 정하여 여러 동물들을 바르게 분류하는 태도가 돋보임.
- 말차례가 무엇인지 알고 말차례를 지키는 방법을 스스로 탐구함. 글을 읽고 인물이 처한 상황을 파악하고, 인물의 말이나 행동을 통해 인물의 마음을 짐작함.

**학생 정보:**
- 과목: ${student.subject}

**작성할 성취기준 및 개별 평가:**
${standardsText}

**생성된 평어:**
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini API로부터 응답을 받는 데 실패했습니다.");
  }
};
