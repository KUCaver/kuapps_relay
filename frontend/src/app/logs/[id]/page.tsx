"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Share2, ArrowRight } from 'lucide-react';
import { getLogById, getPlantById } from '@/lib/api';
import type { Plant, PlantLog } from '@/lib/types';

const PLACEHOLDER_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="24">🌱</text></svg>';

export default function LogCompletePage() {
  const { id } = useParams();
  const router = useRouter();

  const [log, setLog] = useState<PlantLog | null>(null);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getLogById(Number(id)).then(logData => {
      setLog(logData);
      return getPlantById(logData.plantId).then(setPlant);
    })
      .catch(() => setError('기록 정보를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">생성 중...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 text-sm mb-3">{error}</p>
      <button onClick={fetchData} className="text-sm text-green-600 underline">다시 시도</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">🎉 업로드 성공!</h1>
        <p className="text-slate-500">당신은 {plant?.name}의<br/><strong className="text-green-600 text-lg">{log?.guardianOrder}번째 수호자</strong>입니다.</p>
      </div>

      {/* Guardian Card */}
      <div className="w-full max-w-sm bg-white p-4 rounded-3xl shadow-xl border border-slate-100 mb-8 transform rotate-1 hover:rotate-0 transition duration-300">
        <div className="w-full h-64 bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
          <img
            src={log?.imageUrl || plant?.mainImageUrl || PLACEHOLDER_IMG}
            alt="record"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-[10px] font-medium">
            {log?.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-slate-900">{plant?.name} 수호자 인증샷</h2>
          <p className="text-xs text-slate-500 mt-1">
            {log?.relayMessage ? `"${log.relayMessage}"` : "오늘의 푸르름을 지켜냈습니다 🌱"}
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <button className="w-full bg-slate-100 text-slate-800 font-semibold flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 active:scale-[0.98] transition hover:bg-slate-200">
          <Share2 className="w-5 h-5" />
          카드 공유하기
        </button>
        <button
          onClick={() => router.push(`/plants/${plant?.id}`)}
          className="w-full bg-green-600 text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition hover:bg-green-700"
        >
          식물 상태 페이지로 <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
}
