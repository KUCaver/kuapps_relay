"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Leaf, Map, List, MapPin, Navigation } from 'lucide-react';
import { getPlants } from '@/lib/api';
import { PlantStatusBadge } from '@/components/PlantStatusBadge';
import type { Plant } from '@/lib/types';

// Leaflet은 SSR 불가 → dynamic import
const PlantMap = dynamic(() => import('@/components/PlantMap'), { ssr: false });

const PLACEHOLDER_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23e2e8f0" width="64" height="64"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="24">🌱</text></svg>';

/** 두 좌표 사이 거리 (미터) - Haversine 공식 */
function getDistanceM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function LandingPage() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchPlants = () => {
    setLoading(true);
    setError(null);
    getPlants()
      .then(setPlants)
      .catch(() => setError('식물 목록을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchPlants();
    requestLocation();
  }, []);

  // 가까운 순 정렬
  const sortedPlants = useMemo(() => {
    if (!userLocation) return plants;
    return [...plants].sort((a, b) => {
      const distA = getDistanceM(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
      const distB = getDistanceM(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [plants, userLocation]);

  const handlePlantClick = useCallback((id: number) => {
    router.push(`/plants/${id}`);
  }, [router]);

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
        {/* Header with view toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            {userLocation ? (
              <>
                <Navigation className="w-4 h-4 text-blue-500" />
                가까운 식물
              </>
            ) : '최근 활동 식물'}
          </h3>
          <div className="flex items-center gap-2">
            {!userLocation && !locationLoading && (
              <button
                onClick={requestLocation}
                className="text-xs text-blue-500 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition"
              >
                <MapPin className="w-3 h-3" /> 내 위치
              </button>
            )}
            {locationLoading && (
              <span className="text-xs text-slate-400">위치 확인 중...</span>
            )}
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition ${view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                title="목록 보기"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('map')}
                className={`p-1.5 rounded-md transition ${view === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                title="지도 보기"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">
            <div className="animate-pulse mb-2">🌱</div>
            <p>서버 연결 중...</p>
            <p className="text-xs mt-1 text-slate-300">처음 접속 시 최대 30초 정도 걸릴 수 있어요</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button onClick={fetchPlants} className="text-sm text-green-600 underline">다시 시도</button>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center text-slate-400 py-8">등록된 식물이 없습니다.</div>
        ) : view === 'map' ? (
          <PlantMap plants={plants} userLocation={userLocation} onPlantClick={handlePlantClick} />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedPlants.map(p => {
              const dist = userLocation
                ? getDistanceM(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
                : null;
              return (
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
                      <div className="flex items-center gap-2">
                        <PlantStatusBadge status={p.currentStatus} />
                        {dist !== null && (
                          <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                            📍 {formatDistance(dist)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
