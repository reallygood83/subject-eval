import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="max-w-6xl mx-auto pt-8 sm:pt-10 md:pt-12 border-t-3 sm:border-t-4 border-black">
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="card-neo px-4 py-2 sm:px-6 sm:py-3 bg-violet-200 inline-block">
          <p className="text-sm sm:text-base md:text-lg font-black text-center">
            교원 AI 사용성 연구회
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <p className="text-sm sm:text-base md:text-lg font-bold text-center sm:text-left">
            © 2025 이발소 (Eval Place). All rights reserved.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            <span className="text-gray-700">Jong-Yeon Lee, Moon-Jung Kim</span>
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
      </div>
    </footer>
  );
};

export default Footer;
