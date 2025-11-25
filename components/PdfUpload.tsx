import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PdfUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ onUpload, loading, error }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUpload(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto card-neo p-4 sm:p-6 md:p-8 bg-white text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 text-black border-black border-b-3 sm:border-b-4 pb-2 inline-block">📄 평가 계획 업로드</h2>
      <p className="text-sm sm:text-base text-gray-800 font-medium mb-4 sm:mb-6">과목, 성취기준, 평가요소가 포함된 PDF 파일을 업로드해주세요.</p>

      <label
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="flex justify-center w-full h-40 sm:h-44 md:h-48 px-3 sm:px-4 transition bg-gradient-to-br from-cyan-100 to-violet-100 border-3 sm:border-4 border-black border-dashed appearance-none cursor-pointer hover:bg-lime-200 hover:shadow-neo-md"
      >
        <span className="flex items-center space-x-2">
          <UploadIcon />
          <span className="font-bold text-black text-sm sm:text-base break-words">
            {file ? `✅ ${file.name}` : '📂 파일을 드래그하거나 클릭하여 선택하세요 (.pdf)'}
          </span>
        </span>
        <input type="file" name="file_upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
      </label>

      {error && (
        <div className="mt-3 sm:mt-4">
          <ErrorMessage
            message={error}
            onRetry={() => {
              if (file) onUpload(file);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="mt-4 sm:mt-6 flex justify-center">
          <LoadingSpinner size="lg" message="PDF 분석 중..." />
        </div>
      ) : (
        <button
          onClick={handleUploadClick}
          disabled={!file}
          className="btn-neo-primary mt-4 sm:mt-6 w-full px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg"
        >
          🚀 업로드 및 분석 시작
        </button>
      )}
    </div>
  );
};

export default PdfUpload;
