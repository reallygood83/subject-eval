import React from 'react';
import type { StudentData, EvaluationData, StandardEvaluation, AchievementStandard } from '../types';
import { SparklesIcon, WandIcon, RefreshIcon, CheckCircleIcon, PencilIcon } from './icons';

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
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 transition-all hover:shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">학생 {student.id}</h3>
        <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{student.subject}</span>
      </div>

      {/* 성취기준 선택 */}
      <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">성취기준 (다중 선택)</label>
            <button
                onClick={() => onAutoSelect(student.id)}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200"
            >
                <WandIcon /> 자동 선택
            </button>
        </div>
        <div className="max-h-32 overflow-y-auto p-2 border border-gray-300 rounded-md space-y-2 bg-gray-50">
          {currentStandards.length > 0 ? currentStandards.map(standard => (
            <div key={standard.id} className="flex items-center">
              <input
                type="checkbox"
                id={`standard-${student.id}-${standard.id}`}
                checked={student.standardEvaluations.some(se => se.standardId === standard.id)}
                onChange={() => handleStandardChange(standard.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`standard-${student.id}-${standard.id}`} className="ml-2 text-sm text-gray-700">{standard.id} {standard.text}</label>
            </div>
          )) : <p className="text-sm text-gray-500">선택된 과목에 대한 성취기준이 없습니다.</p>}
        </div>
      </div>
      
      {/* 선택된 성취기준별 상세 설정 */}
      {student.standardEvaluations.length > 0 && (
        <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 border-t pt-4">선택된 성취기준 상세 설정</h4>
            {student.standardEvaluations.map((se) => {
                const standard = currentStandards.find(s => s.id === se.standardId);
                if (!standard) return null;
                return (
                    <div key={se.standardId} className="p-4 border border-indigo-200 rounded-lg bg-indigo-50/50 space-y-3">
                        <p className="text-sm font-semibold text-indigo-800">
                           <span className="font-mono bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 text-xs mr-2">{standard.id}</span>
                           {standard.text}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={`level-${student.id}-${se.standardId}`} className="block text-xs font-medium text-gray-600 mb-1">성취 수준</label>
                                <select
                                    id={`level-${student.id}-${se.standardId}`}
                                    value={se.achievementLevel}
                                    onChange={(e) => handleStandardEvaluationChange(se.standardId, { achievementLevel: e.target.value })}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option>상 (매우 잘함)</option>
                                    <option>중 (잘함)</option>
                                    <option>하 (보통)</option>
                                    <option>노력 요함</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor={`attitude-${student.id}-${se.standardId}`} className="block text-xs font-medium text-gray-600 mb-1">태도</label>
                                <select
                                    id={`attitude-${student.id}-${se.standardId}`}
                                    value={se.attitude}
                                    onChange={(e) => handleStandardEvaluationChange(se.standardId, { attitude: e.target.value })}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option>좋음</option>
                                    <option>보통</option>
                                    <option>미흡함</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`focus-${student.id}-${se.standardId}`} className="block text-xs font-medium text-gray-600 mb-1">평어 생성 중심</label>
                            <select
                                id={`focus-${student.id}-${se.standardId}`}
                                value={se.generationFocus}
                                onChange={(e) => handleStandardEvaluationChange(se.standardId, { generationFocus: e.target.value })}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>성취 수준 & 태도 같은 비율</option>
                                <option>성취 수준 중심</option>
                                <option>태도 중심</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`info-${student.id}-${se.standardId}`} className="block text-xs font-medium text-gray-600 mb-1">참고할 추가 정보 (선택)</label>
                            <textarea
                                id={`info-${student.id}-${se.standardId}`}
                                rows={1}
                                value={se.additionalInfo}
                                onChange={(e) => handleStandardEvaluationChange(se.standardId, { additionalInfo: e.target.value })}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="예: 수학 퍼즐 풀기 좋아함."
                            />
                        </div>
                    </div>
                )
            })}
        </div>
      )}


      {/* 평어 생성 버튼 */}
      <button
        onClick={() => onGenerateComment(student.id)}
        disabled={isGenerationDisabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <SparklesIcon />
        {student.isGenerating ? '생성 중...' : student.comment ? '새로운 평어 생성' : '평어 생성'}
      </button>

      {/* 생성된 평어 */}
      {student.error && (
          <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-red-600">{student.error}</p>
          </div>
      )}
      {student.comment && !student.error && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">생성 결과:</h4>
          <textarea
            value={student.comment}
            onChange={(e) => onDataChange(student.id, { comment: e.target.value })}
            readOnly={student.isConfirmed}
            rows={5}
            className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 read-only:bg-gray-100 read-only:ring-0 read-only:border-gray-200 transition-colors"
          />
          <div className="flex justify-end items-center gap-2 mt-2">
            {student.isConfirmed ? (
              <>
                <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <CheckCircleIcon />
                  확인됨
                </span>
                <button
                  onClick={() => onDataChange(student.id, { isConfirmed: false })}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
                >
                  <PencilIcon />
                  수정
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onGenerateComment(student.id)}
                  disabled={student.isGenerating}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  <RefreshIcon />
                  재생성
                </button>
                <button
                  onClick={() => onDataChange(student.id, { isConfirmed: true })}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                >
                  <CheckCircleIcon />
                  확인
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
