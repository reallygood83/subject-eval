import React, { useEffect } from 'react';
import { YouTubeIcon } from './icons';

interface YouTubeSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number; // 밀리초 단위
}

const YouTubeSubscribeModal: React.FC<YouTubeSubscribeModalProps> = ({
  isOpen,
  onClose,
  autoCloseDelay = 5000 // 기본 5초
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const handleDontShowAgain = () => {
    localStorage.setItem('hideYouTubeModal', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="card-neo bg-gradient-to-br from-red-50 to-pink-50 max-w-md w-full p-6 sm:p-8 animate-slideUp">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg border-2 border-black">
              <YouTubeIcon />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black">
              잠깐만요! 👋
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-black text-gray-600 hover:text-black transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 메시지 */}
        <div className="mb-6">
          <p className="text-base sm:text-lg font-bold text-gray-800 mb-3">
            🎉 <span className="text-pink-600">이발소</span>가 도움이 되셨나요?
          </p>
          <p className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed mb-2">
            유튜브 <span className="font-black text-red-600">"배움의 달인"</span> 채널을 구독하시면
            더 많은 <span className="font-bold">교육 도구</span>와 <span className="font-bold">자료</span>를
            지속적으로 만나보실 수 있습니다! 😊
          </p>
          <p className="text-xs sm:text-sm font-medium text-gray-600 italic">
            💡 구독자님들께는 신규 기능을 가장 먼저 알려드려요!
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-3">
          <a
            href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black border-black border-3 shadow-neo-md hover:shadow-neo-lg transition-all text-base sm:text-lg"
          >
            <YouTubeIcon />
            <span>🎬 유튜브 구독하러 가기</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold border-black border-2 shadow-neo-sm hover:shadow-neo-md transition-all text-sm"
            >
              나중에 할게요
            </button>
            <button
              onClick={handleDontShowAgain}
              className="flex-1 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-medium border-black border-2 shadow-neo-sm hover:shadow-neo-md transition-all text-xs sm:text-sm"
            >
              다시 보지 않기
            </button>
          </div>
        </div>

        {/* 자동 닫힘 안내 */}
        <p className="text-xs text-center text-gray-500 mt-4 font-medium">
          ⏱️ {autoCloseDelay / 1000}초 후 자동으로 닫힙니다
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default YouTubeSubscribeModal;
