"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, RefreshCw, ShieldCheck, ShieldX, ShieldAlert } from 'lucide-react';
import { getPlantById, getPlantLogs, deleteLog, validateLog } from '@/lib/api';
import type { Plant, PlantLog } from '@/lib/types';

const PLACEHOLDER_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="24">🌱</text></svg>';

const VALIDATION_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: '승인', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: '반려', color: 'bg-red-100 text-red-700' },
  FLAGGED: { label: '신고', color: 'bg-orange-100 text-orange-700' },
};

export default function AdminPlantLogsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [logs, setLogs] = useState<PlantLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getPlantById(Number(id)), getPlantLogs(Number(id))])
      .then(([p, l]) => { setPlant(p); setLogs(l); })
      .catch(() => setError('데이터를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleDeleteLog = async (logId: number, order: number) => {
    if (!confirm(`${order}번째 수호자의 기록을 삭제하시겠습니까?`)) return;
    try {
      await deleteLog(logId);
      setLogs(prev => prev.filter(l => l.id !== logId));
    } catch {
      alert('삭제에 실패했습니다.');
      fetchData();
    }
  };

  const handleValidate = async (logId: number, status: string) => {
    try {
      const updated = await validateLog(logId, status);
      setLogs(prev => prev.map(l => l.id === logId ? { ...l, validationStatus: updated.validationStatus } : l));
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <div className="flex gap-3">
        <button onClick={fetchData} className="text-sm text-green-600 underline">다시 시도</button>
        <button onClick={() => router.push('/admin')} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl">관리자로 돌아가기</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <Link href="/admin" className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">{plant?.name}</h1>
            <p className="text-xs text-slate-400">참여자 기록 관리 · {logs.length}개</p>
          </div>
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-slate-200 rounded-full transition" title="새로고침">
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </header>

      {logs.length === 0 ? (
        <div className="text-center text-slate-400 py-12">아직 참여자 기록이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log) => {
            const v = VALIDATION_LABELS[log.validationStatus] || VALIDATION_LABELS.PENDING;
            return (
              <div key={log.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Image */}
                <div className="flex gap-3 p-4">
                  {log.imageUrl && (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={log.imageUrl}
                        alt={`${log.guardianOrder}번째 기록`}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-900">
                        {log.guardianOrder}번째 수호자
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.color}`}>
                        {v.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1.5">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('ko-KR') : ''}
                    </p>
                    <div className="flex gap-1.5 flex-wrap mb-1">
                      {log.watered && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">💧 물 줌</span>}
                      {log.isHealthy && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">✨ 양호</span>}
                      {log.hasIssue && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">⚠️ 이슈</span>}
                    </div>
                    {(log.relayMessage || log.issueNote) && (
                      <p className="text-xs text-slate-600 truncate">
                        {log.relayMessage || log.issueNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center border-t border-slate-100 divide-x divide-slate-100">
                  <button
                    onClick={() => handleValidate(log.id, 'APPROVED')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition ${log.validationStatus === 'APPROVED' ? 'bg-green-50 text-green-700' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> 승인
                  </button>
                  <button
                    onClick={() => handleValidate(log.id, 'REJECTED')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition ${log.validationStatus === 'REJECTED' ? 'bg-red-50 text-red-700' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <ShieldX className="w-3.5 h-3.5" /> 반려
                  </button>
                  <button
                    onClick={() => handleValidate(log.id, 'FLAGGED')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium transition ${log.validationStatus === 'FLAGGED' ? 'bg-orange-50 text-orange-700' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'}`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> 신고
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log.id, log.guardianOrder)}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
