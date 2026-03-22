"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { getPlants } from '@/lib/api';
import { PlantStatusBadge } from '@/components/PlantStatusBadge';
import type { Plant } from '@/lib/types';

const PLACEHOLDER_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="24">🌱</text></svg>';

export default function LandingPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = () => {
    setLoading(true);
    setError(null);
    getPlants()
      .then(setPlants)
      .catch(() => setError('식물 목록을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlants(); }, []);

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6">
      <header className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-green-600">
          <Leaf className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Relay Bloom</h1>
        </div>
      </header>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <h2 className="text-lg font-semibold mb-2">캠퍼스 식물 릴레이 가드닝</h2>
        <p className="text-sm text-slate-500 mb-4">
          식물에 부착된 QR코드를 스캔하여 30초 만에 관리 상태를 기록하고, 다음 사람에게 릴레이하세요!
        </p>
        <Link href="/admin" className="text-xs text-green-600 underline">
          관리자 페이지로 이동
        </Link>
      </section>

      <section>
        <h3 className="font-semibold mb-4 text-slate-800">최근 활동 식물</h3>
        {loading ? (
          <div className="text-center text-slate-400 py-8">로딩 중...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button onClick={fetchPlants} className="text-sm text-green-600 underline">다시 시도</button>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center text-slate-400 py-8">등록된 식물이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {plants.map(p => (
              <Link href={`/plants/${p.id}`} key={p.id}>
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={p.mainImageUrl || PLACEHOLDER_IMG}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-500 mb-1">{p.locationName}</p>
                    <PlantStatusBadge status={p.currentStatus} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
