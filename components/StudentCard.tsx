import React from 'react';
import type { StudentData, EvaluationData, StandardEvaluation, AchievementStandard } from '../types';
import { SparklesIcon, WandIcon, RefreshIcon, CheckCircleIcon, PencilIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface StudentCardProps {
  student: StudentData;
  evaluationData: EvaluationData;
  isGeneratingAll: boolean;
  onDataChange: (id: number, data: Partial<StudentData>) => void;
  onGenerateComment: (id: number) => void;
  onAutoSelect: (id: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, evaluationData, isGeneratingAll, onDataChange, onGenerateComment, onAutoSelect }) => {
  const handleStandardChange = (standardId: string) => {
    const isSelected = student.standardEvaluations.some(se => se.standardId === standardId);
    let newEvaluations: StandardEvaluation[];

    if (isSelected) {
        newEvaluations = student.standardEvaluations.filter(se => se.standardId !== standardId);
    } else {
        newEvaluations = [
            ...student.standardEvaluations,
            {
                standardId: standardId,
                achievementLevel: '상 (매우 잘함)',
                attitude: '좋음',
                generationFocus: '성취 수준 & 태도 같은 비율',
                additionalInfo: '',
            }
        ];
    }
    onDataChange(student.id, { standardEvaluations: newEvaluations });
  };
  
  const handleStandardEvaluationChange = (standardId: string, updatedData: Partial<StandardEvaluation>) => {
    const newEvaluations = student.standardEvaluations.map(se =>
        se.standardId === standardId ? { ...se, ...updatedData } : se
    );
    onDataChange(student.id, { standardEvaluations: newEvaluations });
  };
  
  const currentStandards = evaluationData.standards[student.subject] || [];
  const isGenerationDisabled = student.standardEvaluations.length === 0 || student.isGenerating || isGeneratingAll;

  return (
    <div className="card-neo p-4 sm:p-6 bg-white flex flex-col space-y-3 sm:space-y-4 hover:shadow-neo-lg transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-black text-black border-black border-b-3 sm:border-b-4 pb-1">👤 학생 {student.id}</h3>
        <span className="text-xs sm:text-sm font-black bg-violet-200 text-black px-2 py-1 sm:px-3 border-black border-2 shadow-neo-sm">{student.subject}</span>
      </div>

      {/* 성취기준 선택 */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <label className="text-xs sm:text-sm font-black text-black">📋 성취기준 (다중 선택)</label>
            <button
                onClick={() => onAutoSelect(student.id)}
                className="btn-neo-secondary text-xs sm:text-sm px-3 py-2 w-full sm:w-auto"
            >
                <WandIcon />
                <span>자동 선택</span>
            </button>
        </div>
        <div className="max-h-32 overflow-y-auto p-2 sm:p-3 border-black border-2 space-y-1 sm:space-y-2 bg-lime-100">
          {currentStandards.length > 0 ? currentStandards.map(standard => (
            <div key={standard.id} className="flex items-center p-1.5 sm:p-2 hover:bg-lime-200 transition-colors">
              <input
                type="checkbox"
                id={`standard-${student.id}-${standard.id}`}
                checked={student.standardEvaluations.some(se => se.standardId === standard.id)}
                onChange={() => handleStandardChange(standard.id)}
                className="h-4 w-4 sm:h-5 sm:w-5 border-black border-2 flex-shrink-0"
              />
              <label htmlFor={`standard-${student.id}-${standard.id}`} className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-black break-words">{standard.id} {standard.text}</label>
            </div>
          )) : <p className="text-xs sm:text-sm font-bold text-gray-700">선택된 과목에 대한 성취기준이 없습니다.</p>}
        </div>
      </div>
      
      {/* 선택된 성취기준별 상세 설정 */}
      {student.standardEvaluations.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-black text-black border-t-3 sm:border-t-4 border-black pt-3 sm:pt-4">⚙️ 선택된 성취기준 상세 설정</h4>
            {student.standardEvaluations.map((se) => {
                const standard = currentStandards.find(s => s.id === se.standardId);
                if (!standard) return null;
                return (
                    <div key={se.standardId} className="p-3 sm:p-4 border-black border-3 sm:border-4 bg-cyan-100 shadow-neo-sm space-y-2 sm:space-y-3">
                        <p className="text-xs sm:text-sm font-black text-black break-words">
                           <span className="font-mono bg-violet-200 text-black border-black border-2 px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs mr-1 sm:mr-2 inline-block">{standard.id}</span>
                           {standard.text}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor={`level-${student.id}-${se.standardId}`} className="block text-xs font-black text-black mb-1">성취 수준</label>
                                <select
                                    id={`level-${student.id}-${se.standardId}`}
                                    value={se.achievementLevel}
                                    onChange={(e) => handleStandardEvaluationChange(se.standardId, { achievementLevel: e.target.value })}
                                    className="input-neo w-full text-xs sm:text-sm"
                                >
                                    <option>상 (매우 잘함)</option>
                                    <option>중 (잘함)</option>
                                    <option>하 (보통)</option>
                                    <option>노력 요함</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor={`attitude-${student.id}-${se.standardId}`} className="block text-xs font-black text-black mb-1">태도</label>
                                <select
                                    id={`attitude-${student.id}-${se.standardId}`}
                                    value={se.attitude}
                                    onChange={(e) => handleStandardEvaluationChange(se.standardId, { attitude: e.target.value })}
                                    className="input-neo w-full text-xs sm:text-sm"
                                >
                                    <option>좋음</option>
                                    <option>보통</option>
                                    <option>미흡함</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`focus-${student.id}-${se.standardId}`} className="block text-xs font-black text-black mb-1">평어 생성 중심</label>
                            <select
                                id={`focus-${student.id}-${se.standardId}`}
                                value={se.generationFocus}
                                onChange={(e) => handleStandardEvaluationChange(se.standardId, { generationFocus: e.target.value })}
                                className="input-neo w-full text-xs sm:text-sm"
                            >
                                <option>성취 수준 & 태도 같은 비율</option>
                                <option>성취 수준 중심</option>
                                <option>태도 중심</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`info-${student.id}-${se.standardId}`} className="block text-xs font-black text-black mb-1">참고할 추가 정보 (선택)</label>
                            <textarea
                                id={`info-${student.id}-${se.standardId}`}
                                rows={1}
                                value={se.additionalInfo}
                                onChange={(e) => handleStandardEvaluationChange(se.standardId, { additionalInfo: e.target.value })}
                                className="input-neo w-full text-xs sm:text-sm"
                                placeholder="예: 수학 퍼즐 풀기 좋아함."
                            />
                        </div>
                    </div>
                )
            })}
        </div>
      )}


      {/* 평어 생성 버튼 */}
      <div className="mt-2 sm:mt-3 pt-3 sm:pt-4 border-t-2 border-black">
        {student.isGenerating ? (
          <div className="flex justify-center py-2">
            <LoadingSpinner size="md" message="평어 생성 중..." />
          </div>
        ) : (
          <button
            onClick={() => onGenerateComment(student.id)}
            disabled={isGenerationDisabled}
            className="btn-neo-primary w-full text-sm sm:text-base"
          >
            <SparklesIcon />
            <span>{student.comment ? '🔄 새로운 평어 생성' : '✨ 평어 생성'}</span>
          </button>
        )}
      </div>

      {/* 생성된 평어 */}
      {student.error && (
        <div className="mt-3 sm:mt-4">
          <ErrorMessage
            message={student.error}
            onRetry={() => onGenerateComment(student.id)}
            retryLabel="다시 생성"
          />
        </div>
      )}
      {student.comment && !student.error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 border-black border-3 sm:border-4 bg-orange-100 shadow-neo-sm">
          <h4 className="text-xs sm:text-sm font-black text-black mb-2 border-black border-b-2 pb-1">📝 생성 결과:</h4>
          <textarea
            value={student.comment}
            onChange={(e) => onDataChange(student.id, { comment: e.target.value })}
            readOnly={student.isConfirmed}
            rows={5}
            className="input-neo w-full text-xs sm:text-sm read-only:bg-gray-200 read-only:border-gray-400"
          />
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mt-3 pt-3 border-t-2 border-black border-dashed">
            {student.isConfirmed ? (
              <>
                <span className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black bg-lime-200 px-3 py-2 border-black border-2">
                  <CheckCircleIcon />
                  <span>✅ 확인됨</span>
                </span>
                <button
                  onClick={() => onDataChange(student.id, { isConfirmed: false })}
                  className="btn-neo-secondary text-xs sm:text-sm px-3 py-2 w-full sm:w-auto"
                >
                  <PencilIcon />
                  <span>수정</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onGenerateComment(student.id)}
                  disabled={student.isGenerating}
                  className="btn-neo-secondary text-xs sm:text-sm px-3 py-2 disabled:opacity-50 w-full sm:w-auto"
                >
                  <RefreshIcon />
                  <span>재생성</span>
                </button>
                <button
                  onClick={() => onDataChange(student.id, { isConfirmed: true })}
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm px-3 py-2 bg-lime-200 text-black font-bold border-black border-2 shadow-neo-sm hover:shadow-neo-md transition-all w-full sm:w-auto"
                >
                  <CheckCircleIcon />
                  <span>확인</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
