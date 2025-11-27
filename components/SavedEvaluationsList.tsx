import React, { useState, useEffect } from 'react';
import { getSavedEvaluations, deleteEvaluation, type SavedEvaluation } from '../services/evaluationStorageService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface SavedEvaluationsListProps {
  userId: string;
  onLoad: (evaluation: SavedEvaluation) => void;
  onClose: () => void;
}

const SavedEvaluationsList: React.FC<SavedEvaluationsListProps> = ({ userId, onLoad, onClose }) => {
  const [evaluations, setEvaluations] = useState<SavedEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvaluations();
  }, [userId]);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSavedEvaluations(userId);
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장된 분석 결과를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`"${fileName}" 분석 결과를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteEvaluation(id);
      setEvaluations(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card-neo bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b-3 border-black">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">📂 저장된 분석 결과</h2>
            <button
              onClick={onClose}
              className="btn-neo-secondary px-4 py-2"
            >
              ✕ 닫기
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600">
            이전에 분석한 평가 계획서를 불러와서 평어 생성을 계속할 수 있습니다.
          </p>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="저장된 분석 결과를 불러오는 중..." />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : evaluations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-bold text-gray-600">저장된 분석 결과가 없습니다.</p>
              <p className="text-sm font-medium text-gray-500 mt-2">
                평가 계획서를 업로드하고 분석한 후 저장할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="card-neo p-5 bg-gradient-to-r from-cyan-50 to-violet-50 hover:shadow-neo-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-black mb-2 truncate">
                        📄 {evaluation.fileName}
                      </h3>
                      <div className="space-y-1 text-sm font-medium text-gray-600">
                        <p>
                          📚 과목: {evaluation.evaluationData.subjects.join(', ')}
                        </p>
                        <p>
                          📊 성취기준: {Object.values(evaluation.evaluationData.standards)
                            .reduce((sum, standards) => sum + standards.length, 0)}개
                        </p>
                        <p>
                          🕐 저장일: {formatDate(evaluation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => onLoad(evaluation)}
                        className="btn-neo-primary px-4 py-2 text-sm whitespace-nowrap"
                      >
                        ✅ 불러오기
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id, evaluation.fileName)}
                        disabled={deletingId === evaluation.id}
                        className="btn-neo-danger px-4 py-2 text-sm whitespace-nowrap"
                      >
                        {deletingId === evaluation.id ? '삭제 중...' : '🗑️ 삭제'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedEvaluationsList;
