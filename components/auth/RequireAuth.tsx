import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute 컴포넌트
 * 인증된 사용자만 접근할 수 있도록 보호하는 컴포넌트
 *
 * @param children - 인증된 사용자에게 보여줄 컴포넌트
 * @param fallback - 인증되지 않은 사용자에게 보여줄 컴포넌트 (기본값: null)
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback = null }) => {
  const { user, loading } = useAuth();

  // 로딩 중일 때 로딩 UI 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-200 flex items-center justify-center">
        <div className="card-neo p-12 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-black border-t-violet-400 rounded-full animate-spin"></div>
            <p className="text-2xl font-bold">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 인증되지 않은 사용자는 fallback 컴포넌트 또는 null 표시
  if (!user) {
    return <>{fallback}</>;
  }

  // 인증된 사용자는 children 컴포넌트 표시
  return <>{children}</>;
};

export default RequireAuth;
