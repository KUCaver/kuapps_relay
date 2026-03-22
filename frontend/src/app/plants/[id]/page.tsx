"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Clock } from 'lucide-react';
import { getPlantById, getPlantLogs } from '@/lib/api';
import { PlantStatusBadge } from '@/components/PlantStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Plant, PlantLog } from '@/lib/types';

const PLACEHOLDER_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="24">🌱</text></svg>';

export default function PlantDetailPage() {
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
    Promise.all([
      getPlantById(Number(id)),
      getPlantLogs(Number(id))
    ])
      .then(([plantData, logsData]) => {
        setPlant(plantData);
        setLogs(logsData);
      })
      .catch(() => setError('식물 정보를 불러올 수 없습니다. 삭제되었거나 존재하지 않는 식물입니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;
  if (error || !plant) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <p className="text-red-500 text-sm mb-4">{error || '식물 정보를 불러올 수 없습니다.'}</p>
      <div className="flex gap-3">
        <button onClick={fetchData} className="text-sm text-green-600 underline">다시 시도</button>
        <button onClick={() => router.push('/')} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl">메인으로 이동</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="fixed top-0 w-full max-w-md bg-white/80 backdrop-blur-md z-10 p-4 border-b border-slate-100 flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold text-lg flex-1 truncate">{plant.name}</h1>
      </header>

      <div className="pt-16 relative">
        <div className="w-full h-64 bg-slate-200">
          <img
            src={plant.mainImageUrl || PLACEHOLDER_IMG}
            alt={plant.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
          />
        </div>

        <div className="p-4 md:p-6 bg-white rounded-t-3xl -mt-6 relative z-0 flex flex-col gap-6 shadow-sm min-h-[60vh]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{plant.name}</h2>
              <PlantStatusBadge status={plant.currentStatus} />
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <span>📍 {plant.locationName}</span>
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed text-sm">
              {plant.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 성장 타임라인
            </h3>

            {logs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">아직 기록이 없습니다. 첫 수호자가 되어주세요!</p>
            ) : (
              <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 pl-10">
                    <div className="absolute left-2.5 top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white" />
                    <div className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-slate-500">
                          {log.guardianOrder}번째 수호자
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ko })}
                        </span>
                      </div>

                      {log.imageUrl && (
                        <div className="w-full h-32 bg-slate-200 rounded-lg mb-2 overflow-hidden">
                          <img
                            src={log.imageUrl}
                            alt="log"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                          />
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap mb-2">
                        {log.watered && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">💧 물 줌</span>}
                        {log.isHealthy && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">✨ 상태 양호</span>}
                        {log.hasIssue && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">⚠️ 특이사항</span>}
                      </div>

                      {(log.relayMessage || log.issueNote) && (
                        <p className="text-xs text-slate-700 bg-white p-2 border border-slate-100 rounded-md">
                          {log.relayMessage || log.issueNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full max-w-md p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <Link
          href={`/plants/${id}/record`}
          className="w-full bg-green-600 text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition"
        >
          <Camera className="w-5 h-5" />
          상태 기록하기
        </Link>
      </div>
    </main>
  );
}
