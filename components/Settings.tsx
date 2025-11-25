import React, { useState } from 'react';
import { useSettings, GeminiModel } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { settings, updateSettings, isConfigured } = useSettings();
  const { user, logout } = useAuth();

  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>(settings.selectedModel);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setSaveMessage({ type: 'error', text: 'API 키를 입력해주세요.' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateSettings({
        geminiApiKey: apiKey,
        selectedModel,
      });
      setSaveMessage({ type: 'success', text: '설정이 저장되었습니다! ✓' });

      // 3초 후 메시지 자동 제거
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setSaveMessage({ type: 'error', text: '설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 p-3 sm:p-6 md:p-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {onBack && (
              <button
                onClick={onBack}
                className="btn-neo-secondary text-sm sm:text-base md:text-lg px-3 py-2 sm:px-4"
              >
                ← 뒤로
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black border-black border-3 sm:border-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white shadow-neo-lg rotate-[-0.5deg] sm:rotate-[-1deg]">
              ⚙️ 설정
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-neo-danger text-sm sm:text-base md:text-lg w-full sm:w-auto"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="card-neo p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 bg-gradient-to-br from-cyan-200 to-violet-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 border-black border-b-3 sm:border-b-4 pb-2 inline-block">
            👤 사용자 정보
          </h2>
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <p className="text-base sm:text-lg md:text-xl font-bold break-words">
              이름: <span className="text-violet-400">{user?.displayName || '사용자'}</span>
            </p>
            <p className="text-base sm:text-lg md:text-xl font-bold break-all">
              이메일: <span className="text-cyan-400">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Gemini API Settings Card */}
        <div className="card-neo p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 bg-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-6 border-black border-b-3 sm:border-b-4 pb-2 inline-block">
            🤖 Gemini API 설정
          </h2>

          {!isConfigured && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-200 border-black border-2 rounded-md">
              <p className="font-bold text-sm sm:text-base md:text-lg">
                ⚠️ API 키를 설정해야 평어 생성 기능을 사용할 수 있습니다!
              </p>
            </div>
          )}

          {/* API Key Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">
              🔑 Gemini API 키
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="여기에 API 키를 입력하세요"
                className="input-neo flex-1 font-mono text-sm sm:text-base md:text-lg"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="btn-neo-secondary text-sm sm:text-base w-full sm:w-auto"
              >
                <span>{showApiKey ? '🙈 숨기기' : '👁️ 보기'}</span>
              </button>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
              💡 <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-600 underline break-words"
              >
                Google AI Studio
              </a>에서 무료로 API 키를 발급받을 수 있습니다.
            </p>
          </div>

          {/* Model Selection */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">
              🎯 AI 모델 선택
            </label>
            <div className="space-y-2 sm:space-y-3">
              <label className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-black border-2 rounded-md cursor-pointer hover:bg-lime-100 transition-colors">
                <input
                  type="radio"
                  name="model"
                  value="gemini-2.5-flash"
                  checked={selectedModel === 'gemini-2.5-flash'}
                  onChange={(e) => setSelectedModel(e.target.value as GeminiModel)}
                  className="w-5 h-5 sm:w-6 sm:h-6 mt-1 sm:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm sm:text-base md:text-lg font-bold">Gemini 2.5 Flash (기본 권장)</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">빠른 응답 속도, 안정적인 성능</p>
                </div>
              </label>

              <label className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-black border-2 rounded-md cursor-pointer hover:bg-lime-100 transition-colors">
                <input
                  type="radio"
                  name="model"
                  value="gemini-2.0-flash-exp"
                  checked={selectedModel === 'gemini-2.0-flash-exp'}
                  onChange={(e) => setSelectedModel(e.target.value as GeminiModel)}
                  className="w-5 h-5 sm:w-6 sm:h-6 mt-1 sm:mt-0 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm sm:text-base md:text-lg font-bold">Gemini 2.0 Flash (실험적)</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">최신 실험 버전, 향상된 성능</p>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button & Message */}
          <div className="flex flex-col gap-4 pt-4 border-t-2 border-black">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-neo-primary w-full text-lg sm:text-xl"
            >
              <span>{isSaving ? '💾 저장 중...' : '💾 설정 저장'}</span>
            </button>

            {saveMessage && (
              <div
                className={`p-4 border-black border-2 rounded-md font-bold text-base sm:text-lg text-center ${
                  saveMessage.type === 'success'
                    ? 'bg-lime-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {saveMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="card-neo p-8 bg-gradient-to-br from-pink-200 to-orange-200">
          <h3 className="text-2xl font-black mb-4">
            📌 안내사항
          </h3>
          <ul className="space-y-3 text-lg font-medium">
            <li>✓ API 키는 안전하게 암호화되어 저장됩니다</li>
            <li>✓ Gemini 2.5 Flash 모델을 권장합니다 (기본값)</li>
            <li>✓ API 키는 본인만 볼 수 있습니다</li>
            <li>✓ 설정은 자동으로 저장되며 모든 기기에서 동기화됩니다</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Settings;
