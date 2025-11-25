import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { EvaluationData, StudentData, AchievementStandard, StandardEvaluation } from './types';
import { parsePdf } from './services/pdfParserService';
import { generateComment as generateCommentFromApi } from './services/geminiService';
import { useSettings } from './contexts/SettingsContext';
import { useAuth } from './contexts/AuthContext';
import PdfUpload from './components/PdfUpload';
import StudentCard from './components/StudentCard';
import ReviewData from './components/ReviewData';
import Settings from './components/Settings';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { HeaderIcon, DownloadIcon, CheckAllIcon, RestartIcon } from './components/icons';

const App: React.FC = () => {
  const { settings, isConfigured } = useSettings();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'generate'>('upload');
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  
  const [studentCount, setStudentCount] = useState<number>(1);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number } | null>(null);
  const [autoSelectCount, setAutoSelectCount] = useState<number>(2);
  
  // Bulk settings state
  const [bulkAchievementLevel, setBulkAchievementLevel] = useState<string>('상 (매우 잘함)');
  const [bulkAttitude, setBulkAttitude] = useState<string>('좋음');
  const [bulkGenerationFocus, setBulkGenerationFocus] = useState<string>('성취 수준 & 태도 같은 비율');
  
  useEffect(() => {
    if (evaluationData && currentStep === 'generate') {
      const firstSubject = evaluationData.subjects[0] || '';
      if (!currentSubject) {
        setCurrentSubject(firstSubject);
      }
      
      setStudents(prevStudents => {
        const newStudents: StudentData[] = [];
        const subjectToUse = currentSubject || firstSubject;
        for (let i = 1; i <= studentCount; i++) {
          const existingStudent = prevStudents.find(s => s.id === i);
          if (existingStudent) {
            newStudents.push({ ...existingStudent, subject: subjectToUse });
          } else {
            newStudents.push({
              id: i,
              subject: subjectToUse,
              standardEvaluations: [],
              comment: '',
              isGenerating: false,
              error: null,
              isConfirmed: false,
            });
          }
        }
        return newStudents.slice(0, studentCount);
      });
    }
  }, [studentCount, evaluationData, currentSubject, currentStep]);

  const handlePdfUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzingPdf(true);
    setPdfError(null);
    try {
      if (!settings.geminiApiKey) {
        throw new Error("Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.");
      }
      const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey });

      const data = await parsePdf(file, ai);
      setEvaluationData(data);
      setCurrentStep('review');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setPdfError(`PDF 파일 처리 중 오류가 발생했습니다: ${errorMessage}`);
      console.error(error);
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  const handleReanalyze = () => {
    if (uploadedFile) {
      handlePdfUpload(uploadedFile);
    }
  };

  const handleConfirmReview = () => {
    setCurrentStep('generate');
  };
  
  const handleStartOver = () => {
    setCurrentStep('upload');
    setEvaluationData(null);
    setUploadedFile(null);
    setPdfError(null);
    setStudentCount(1);
    setStudents([]);
    setCurrentSubject('');
    setIsGeneratingAll(false);
  };


  const handleGlobalSubjectChange = (newSubject: string) => {
    setCurrentSubject(newSubject);
    setStudents(prev => prev.map(s => ({
        ...s,
        subject: newSubject,
        standardEvaluations: [],
        comment: '',
        error: null,
        isConfirmed: false
    })));
  };

  const handleStudentDataChange = (id: number, updatedData: Partial<StudentData>) => {
    setStudents(prev => 
      prev.map(student => {
        if (student.id === id) {
          const finalUpdate = { ...student, ...updatedData };
          if ('comment' in updatedData && student.comment !== updatedData.comment) {
            finalUpdate.isConfirmed = false;
          }
          return finalUpdate;
        }
        return student;
      })
    );
  };

  const handleGenerateComment = async (id: number) => {
    const student = students.find(s => s.id === id);
    if (!student || !evaluationData) return;

    handleStudentDataChange(id, { isGenerating: true, error: null, isConfirmed: false });

    try {
      if (!settings.geminiApiKey) {
        throw new Error("Gemini API 키가 설정되지 않았습니다. 설정 페이지에서 API 키를 입력해주세요.");
      }
      const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey });
      const allStandards = Object.values(evaluationData.standards).reduce<AchievementStandard[]>((acc, val) => acc.concat(val as AchievementStandard[]), []);
      const comment = await generateCommentFromApi(ai, student, allStandards);
      handleStudentDataChange(id, { comment, isGenerating: false });
    } catch (error) {
      console.error('Error generating comment:', error);
      handleStudentDataChange(id, { error: '평어 생성 중 오류가 발생했습니다.', isGenerating: false });
    }
  };

  const handleAutoSelectAll = () => {
    if (!evaluationData || !currentSubject) return;

    const standardsForSubject = evaluationData.standards[currentSubject] || [];
    if (standardsForSubject.length === 0) return;

    setStudents(prev => 
      prev.map(student => {
        const shuffled = [...standardsForSubject].sort(() => 0.5 - Math.random());
        const selectedStandards = shuffled.slice(0, autoSelectCount);
        const newStandardEvaluations: StandardEvaluation[] = selectedStandards.map(s => ({
            standardId: s.id,
            achievementLevel: bulkAchievementLevel,
            attitude: bulkAttitude,
            generationFocus: bulkGenerationFocus,
            additionalInfo: '',
        }));
        return {
          ...student,
          standardEvaluations: newStandardEvaluations,
        };
      })
    );
  };
  
  const handleAutoSelect = (id: number) => {
    if (!evaluationData) return;
    const student = students.find(s => s.id === id);
    if (!student) return;

    const standardsForSubject = evaluationData.standards[student.subject] || [];
    if (standardsForSubject.length > 0) {
        const shuffled = [...standardsForSubject].sort(() => 0.5 - Math.random());
        const selectedStandards = shuffled.slice(0, autoSelectCount);
        const newStandardEvaluations: StandardEvaluation[] = selectedStandards.map(s => ({
            standardId: s.id,
            achievementLevel: bulkAchievementLevel,
            attitude: bulkAttitude,
            generationFocus: bulkGenerationFocus,
            additionalInfo: '',
        }));
        handleStudentDataChange(id, { standardEvaluations: newStandardEvaluations });
    }
  };

  const handleBulkApply = () => {
    setStudents(prev => prev.map(student => {
        if (student.standardEvaluations.length === 0) return student;

        const newEvaluations = student.standardEvaluations.map(se => ({
            ...se,
            achievementLevel: bulkAchievementLevel,
            attitude: bulkAttitude,
            generationFocus: bulkGenerationFocus
        }));

        return {
            ...student,
            standardEvaluations: newEvaluations,
            isConfirmed: false
        };
    }));
    alert('선택된 모든 학생의 설정이 일괄 변경되었습니다.');
  };

  const handleGenerateAllComments = async () => {
    setIsGeneratingAll(true);
    const studentsToGenerate = students.filter(s => s.standardEvaluations.length > 0 && !s.comment);
    const total = studentsToGenerate.length;

    setGenerationProgress({ current: 0, total });

    for (let i = 0; i < studentsToGenerate.length; i++) {
      await handleGenerateComment(studentsToGenerate[i].id);
      setGenerationProgress({ current: i + 1, total });
    }

    setIsGeneratingAll(false);
    setGenerationProgress(null);
  };
  
  const handleConfirmAllComments = () => {
    setStudents(prev =>
      prev.map(student =>
        student.comment && !student.isConfirmed
          ? { ...student, isConfirmed: true }
          : student
      )
    );
  };

  const handleDownloadComments = () => {
    const headers = ["학생 번호", "과목", "생성된 평어"];
    const sanitize = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const rows = students
      .filter(s => s.comment && s.isConfirmed)
      .map(s => [s.id, sanitize(s.subject), sanitize(s.comment)].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "교과별_평어.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'upload':
        return <PdfUpload onUpload={handlePdfUpload} loading={isAnalyzingPdf} error={pdfError} />;
      case 'review':
        if (evaluationData) {
          return (
            <ReviewData
              evaluationData={evaluationData}
              onConfirm={handleConfirmReview}
              onReanalyze={handleReanalyze}
              isReanalyzing={isAnalyzingPdf}
            />
          );
        }
        return null;
      case 'generate':
        if (evaluationData) {
            const commentedStudents = students.filter(s => s.comment);
            const canDownload = commentedStudents.length > 0 && commentedStudents.every(s => s.isConfirmed);
            const canConfirmAll = students.some(s => s.comment && !s.isConfirmed);

          return (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">학생 정보 및 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <label htmlFor="studentCount" className="font-medium text-gray-700 mr-2">학생 수:</label>
                      <input
                        type="number"
                        id="studentCount"
                        value={studentCount}
                        onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label htmlFor="globalSubject" className="font-medium text-gray-700 mr-2">전체 과목:</label>
                      <select
                        id="globalSubject"
                        value={currentSubject}
                        onChange={(e) => handleGlobalSubjectChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {evaluationData.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleConfirmAllComments}
                      disabled={!canConfirmAll}
                      title={!canConfirmAll ? "확정할 평어가 없습니다." : "모든 평어를 확정합니다."}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md shadow-sm hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckAllIcon />
                      전체 평어 확정
                    </button>
                    <button
                      onClick={handleDownloadComments}
                      disabled={!canDownload}
                      title={!canDownload ? "모든 평어를 생성하고 '확인'해야 활성화됩니다." : ""}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <DownloadIcon />
                      CSV 다운로드
                    </button>
                  </div>
                </div>

                {/* Bulk Settings Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">일괄 설정 (자동 선택 및 일괄 적용 시 사용)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">성취 수준</label>
                            <select
                                value={bulkAchievementLevel}
                                onChange={(e) => setBulkAchievementLevel(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>상 (매우 잘함)</option>
                                <option>중 (잘함)</option>
                                <option>하 (보통)</option>
                                <option>노력 요함</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">태도</label>
                            <select
                                value={bulkAttitude}
                                onChange={(e) => setBulkAttitude(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>좋음</option>
                                <option>보통</option>
                                <option>미흡함</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">평어 생성 중심</label>
                            <select
                                value={bulkGenerationFocus}
                                onChange={(e) => setBulkGenerationFocus(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>성취 수준 & 태도 같은 비율</option>
                                <option>성취 수준 중심</option>
                                <option>태도 중심</option>
                            </select>
                        </div>
                        <button
                            onClick={handleBulkApply}
                            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm h-[38px]"
                        >
                            현재 학생들에게 일괄 적용
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2 items-center justify-between border-t pt-6 border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAutoSelectAll}
                      className="flex-shrink-0 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      전체 성취기준 자동선택
                    </button>
                    <select
                      id="autoSelectCount"
                      value={autoSelectCount}
                      onChange={(e) => setAutoSelectCount(parseInt(e.target.value, 10))}
                      className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                    <label htmlFor="autoSelectCount" className="text-sm font-medium text-gray-700 flex-shrink-0">개씩</label>
                  </div>
                  {isGeneratingAll && generationProgress ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner size="md" message={`평어 생성 중... ${generationProgress.current}/${generationProgress.total}`} />
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateAllComments}
                      disabled={isGeneratingAll}
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      전체 평어 생성
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {students.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    evaluationData={evaluationData}
                    isGeneratingAll={isGeneratingAll}
                    onDataChange={handleStudentDataChange}
                    onGenerateComment={handleGenerateComment}
                    onAutoSelect={handleAutoSelect}
                  />
                ))}
              </div>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  // Settings 페이지 렌더링
  if (currentPage === 'settings') {
    return <Settings onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen bg-yellow-200 text-gray-800 font-sans">
      <header className="bg-white border-black border-b-4">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <HeaderIcon />
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 border-black border-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-200 shadow-neo-md">
                이발소 - 교과별 평어 생성기
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setCurrentPage('settings')}
                className="btn-neo-secondary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                ⚙️ 설정
              </button>
              {currentStep !== 'upload' && (
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-1.5 sm:gap-2 btn-neo-secondary px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none"
                >
                    <RestartIcon />
                    <span className="hidden sm:inline">처음부터 다시 시작</span>
                    <span className="sm:hidden">재시작</span>
                </button>
              )}
            </div>
        </div>
      </header>

      {/* API 키 미설정 경고 */}
      {!isConfigured && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4">
          <div className="card-neo p-4 sm:p-6 bg-orange-200 border-black border-4">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-black mb-2">Gemini API 키가 설정되지 않았습니다!</h3>
                <p className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                  평어 생성 기능을 사용하려면 먼저 Gemini API 키를 설정해야 합니다.
                </p>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="btn-neo-primary px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
                >
                  지금 설정하러 가기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;