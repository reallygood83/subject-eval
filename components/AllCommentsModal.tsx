import React from 'react';
import type { StudentData } from '../types';

interface AllCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentData[];
}

const AllCommentsModal: React.FC<AllCommentsModalProps> = ({ isOpen, onClose, students }) => {
  if (!isOpen) return null;

  const commentedStudents = students.filter(s => s.comment);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">전체 평어 확인</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-800 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2">
          {commentedStudents.length > 0 ? (
            commentedStudents.map(student => (
              <div key={student.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">학생 {student.id} ({student.subject})</h3>
                    {student.isConfirmed ? (
                         <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">확인됨</span>
                    ) : (
                         <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">미확인</span>
                    )}
                </div>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{student.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">생성된 평어가 없습니다.</p>
          )}
        </div>
        <div className="mt-6 text-right border-t pt-4">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCommentsModal;
