import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { user, loading, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-3 sm:p-6 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 sm:mb-12 md:mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black border-black border-3 sm:border-4 px-6 py-3 sm:px-8 sm:py-4 bg-white shadow-neo-lg rotate-[-0.5deg] sm:rotate-[-1deg]">
            이발소
          </h1>
          <button
            className="btn-neo-primary text-base sm:text-lg w-full sm:w-auto"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '로딩 중...' : user ? `${user.displayName || '사용자'}님` : '구글 로그인'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
        <div className="card-neo p-6 sm:p-10 md:p-12 bg-gradient-to-br from-cyan-200 to-violet-200">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            AI가 만드는<br />
            <span className="text-pink-400 border-black border-b-3 sm:border-b-4">따뜻한 평어</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
            초등학교 선생님들을 위한 스마트한 학생 평가 도구
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="btn-neo-primary text-base sm:text-lg md:text-xl px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto">
              무료로 시작하기 →
            </button>
            <button className="btn-neo-secondary text-base sm:text-lg md:text-xl px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto">
              더 알아보기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-10 md:mb-12 text-center border-black border-b-3 sm:border-b-4 pb-3 sm:pb-4 inline-block w-full">
          왜 이발소일까요?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="card-neo p-6 sm:p-8 bg-lime-200 hover:shadow-neo-md transition-all duration-200">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎯</div>
            <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">정확한 성취기준</h4>
            <p className="text-base sm:text-lg font-medium">
              PDF에서 성취기준을 자동으로 추출하여 정확한 평가 기준을 제공합니다
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-neo p-6 sm:p-8 bg-orange-200 hover:shadow-neo-md transition-all duration-200">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">✨</div>
            <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">AI 기반 생성</h4>
            <p className="text-base sm:text-lg font-medium">
              Gemini AI가 학생별 맞춤 평어를 자동으로 생성해드립니다
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-neo p-6 sm:p-8 bg-pink-200 hover:shadow-neo-md transition-all duration-200">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">⚡</div>
            <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">시간 절약</h4>
            <p className="text-base sm:text-lg font-medium">
              수작업으로 몇 시간 걸리던 작업을 단 몇 분으로 단축합니다
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-10 md:mb-12 text-center border-black border-b-3 sm:border-b-4 pb-3 sm:pb-4 inline-block w-full">
          간단한 3단계
        </h3>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="flex-1">
            <div className="card-neo p-6 sm:p-8 bg-cyan-200">
              <div className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4 text-violet-400 border-black border-3 sm:border-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                1
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">PDF 업로드</h4>
              <p className="text-base sm:text-lg font-medium">
                교육 평가 계획서 PDF를 업로드하면 성취기준을 자동으로 추출합니다
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex-1">
            <div className="card-neo p-6 sm:p-8 bg-violet-200">
              <div className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4 text-pink-400 border-black border-3 sm:border-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                2
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">학생 설정</h4>
              <p className="text-base sm:text-lg font-medium">
                학생별 성취 수준, 태도, 생성 중심을 간단히 설정합니다
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex-1">
            <div className="card-neo p-6 sm:p-8 bg-lime-200">
              <div className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4 text-orange-400 border-black border-3 sm:border-4 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                3
              </div>
              <h4 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">평어 생성</h4>
              <p className="text-base sm:text-lg font-medium">
                AI가 자동으로 생성한 평어를 확인하고 CSV로 다운로드합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
        <div className="card-neo p-8 sm:p-12 md:p-16 bg-gradient-to-br from-pink-200 to-orange-200 text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
            지금 바로 시작하세요!
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
            무료로 평어솜을 체험해보세요
          </p>
          <button className="btn-neo-primary text-lg sm:text-xl md:text-2xl px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 w-full sm:w-auto">
            무료로 시작하기 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto pt-8 sm:pt-10 md:pt-12 border-t-3 sm:border-t-4 border-black">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm sm:text-base md:text-lg font-bold text-center sm:text-left">
            © 2025 이발소 (Eval Place). All rights reserved.
          </p>
          <div className="flex gap-3 sm:gap-4">
            <a href="#" className="text-sm sm:text-base md:text-lg font-bold hover:text-violet-400 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-sm sm:text-base md:text-lg font-bold hover:text-violet-400 transition-colors">
              이용약관
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
