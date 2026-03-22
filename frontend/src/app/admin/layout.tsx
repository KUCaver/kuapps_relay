"use client";

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('relay_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '쿨라워24' || password === 'znffkdnj24') {
      sessionStorage.setItem('relay_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // Prevent hydration mismatch flash
  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <h1 className="text-xl font-bold mb-2 text-center text-slate-900">관리자 인증</h1>
          <p className="text-xs text-slate-500 mb-6 text-center">건국대학교 캠퍼스 가드닝 담당자 전용</p>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요" 
            className="w-full text-slate-900 p-3 rounded-xl border border-slate-200 mb-4 focus:outline-none focus:border-green-500"
          />
          <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl transition hover:bg-slate-800">
            접속하기
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
