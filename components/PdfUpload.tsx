
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

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
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">평가 계획 업로드</h2>
      <p className="text-gray-600 mb-6">과목, 성취기준, 평가요소가 포함된 PDF 파일을 업로드해주세요.</p>

      <label
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-400 focus:outline-none"
      >
        <span className="flex items-center space-x-2">
          <UploadIcon />
          <span className="font-medium text-gray-600">
            {file ? file.name : '파일을 드래그하거나 클릭하여 선택하세요 (.pdf)'}
          </span>
        </span>
        <input type="file" name="file_upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
      </label>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <button
        onClick={handleUploadClick}
        disabled={!file || loading}
        className="mt-6 w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
      >
        {loading ? '처리 중...' : '업로드 및 분석 시작'}
      </button>
    </div>
  );
};

export default PdfUpload;
