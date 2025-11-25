import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.0-flash-exp';

interface UserSettings {
  geminiApiKey: string;
  selectedModel: GeminiModel;
}

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  isConfigured: boolean;
}

const defaultSettings: UserSettings = {
  geminiApiKey: '',
  selectedModel: 'gemini-2.5-flash',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // Firestore에서 사용자 설정 로드
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        setSettings(defaultSettings);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const settingsRef = doc(db, 'users', user.uid, 'settings', 'gemini');
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as UserSettings;
          setSettings(data);
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('설정 로드 오류:', error);
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // 설정 업데이트 및 Firestore 저장
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      const settingsRef = doc(db, 'users', user.uid, 'settings', 'gemini');
      await setDoc(settingsRef, updatedSettings);
    } catch (error) {
      console.error('설정 저장 오류:', error);
      throw error;
    }
  };

  // API 키가 설정되어 있는지 확인
  const isConfigured = settings.geminiApiKey.trim().length > 0;

  const value = {
    settings,
    loading,
    updateSettings,
    isConfigured,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
