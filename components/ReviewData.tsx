import React from 'react';
import type { EvaluationData } from '../types';
import { RefreshIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ReviewDataProps {
  evaluationData: EvaluationData;
  onConfirm: () => void;
  onReanalyze: () => void;
  isReanalyzing: boolean;
}

const ReviewData: React.FC<ReviewDataProps> = ({ evaluationData, onConfirm, onReanalyze, isReanalyzing }) => {
  return (
    <div className="max-w-4xl mx-auto card-neo p-4 sm:p-6 md:p-8 bg-white">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 text-black border-black border-b-3 sm:border-b-4 pb-2 inline-block">✅ 분석 결과 확인</h2>
      <p className="text-sm sm:text-base text-gray-800 font-medium mb-4 sm:mb-6">PDF에서 추출된 과목과 성취기준이 올바른지 확인해주세요. 내용이 올바르다면 확인 버튼을 눌러 평어 생성을 시작하세요.</p>

      <div className="space-y-4 sm:space-y-6 max-h-[55vh] overflow-y-auto p-3 sm:p-4 border-black border-3 sm:border-4 bg-lime-100 shadow-neo-sm">
        {evaluationData.subjects.map(subject => (
          <div key={subject} className="p-3 sm:p-4 bg-white border-black border-2 shadow-neo-sm">
            <h3 className="text-lg sm:text-xl font-black text-black border-black border-b-3 sm:border-b-4 pb-2 mb-2 sm:mb-3">📚 {subject}</h3>
            <ul className="space-y-1 sm:space-y-2">
              {(evaluationData.standards[subject] || []).map(standard => (
                <li key={standard.id} className="text-xs sm:text-sm text-black flex items-start p-1.5 sm:p-2 hover:bg-cyan-100 transition-colors">
                  <span className="font-mono bg-violet-200 text-black border-black border-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs mr-2 sm:mr-3 mt-0.5 flex-shrink-0">{standard.id}</span>
                  <span className="font-medium break-words">{standard.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {isReanalyzing ? (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <LoadingSpinner size="md" message="PDF 재분석 중..." />
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onReanalyze}
            className="btn-neo-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
          >
            <RefreshIcon />
            🔄 다시 분석 요청
          </button>
          <button
            onClick={onConfirm}
            className="btn-neo-primary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
          >
            ✅ 확인, 평어 생성 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewData;
