import React from 'react';
import type { EvaluationData } from '../types';
import { RefreshIcon } from './icons';

interface ReviewDataProps {
  evaluationData: EvaluationData;
  onConfirm: () => void;
  onReanalyze: () => void;
  isReanalyzing: boolean;
}

const ReviewData: React.FC<ReviewDataProps> = ({ evaluationData, onConfirm, onReanalyze, isReanalyzing }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">분석 결과 확인</h2>
      <p className="text-gray-600 mb-6">PDF에서 추출된 과목과 성취기준이 올바른지 확인해주세요. 내용이 올바르다면 확인 버튼을 눌러 평어 생성을 시작하세요.</p>
      
      <div className="space-y-6 max-h-[55vh] overflow-y-auto p-4 border bg-gray-50 border-gray-200 rounded-lg">
        {evaluationData.subjects.map(subject => (
          <div key={subject} className="p-4 bg-white rounded-md border">
            <h3 className="text-lg font-semibold text-indigo-700 border-b pb-2 mb-3">{subject}</h3>
            <ul className="space-y-2">
              {(evaluationData.standards[subject] || []).map(standard => (
                <li key={standard.id} className="text-sm text-gray-800 flex items-start">
                  <span className="font-mono bg-gray-100 text-gray-600 rounded px-2 py-1 text-xs mr-3 mt-0.5">{standard.id}</span>
                  <span>{standard.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-wait transition-colors"
        >
          <RefreshIcon />
          {isReanalyzing ? '다시 분석 중...' : '다시 분석 요청'}
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
        >
          확인, 평어 생성 시작
        </button>
      </div>
    </div>
  );
};

export default ReviewData;
