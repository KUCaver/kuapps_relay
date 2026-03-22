"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { getPlants, deletePlant, changePlantStatus } from '@/lib/api';
import { PlantStatusBadge } from '@/components/PlantStatusBadge';

export default function AdminDashboard() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlants = () => {
    setLoading(true);
    getPlants().then(setPlants).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlants(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" 식물을 정말 삭제하시겠습니까? 관련 로그도 모두 삭제됩니다.`)) return;
    try {
      await deletePlant(id);
      setPlants(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('삭제 실패');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await changePlantStatus(id, status);
      fetchPlants();
    } catch {
      alert('상태 변경 실패');
    }
  };

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-900">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">관리자 대시보드</h1>
        </div>
        <button onClick={fetchPlants} className="p-2 hover:bg-slate-200 rounded-full transition" title="새로고침">
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <span className="text-sm text-slate-500 mb-1">총 관리 식물</span>
          <span className="text-3xl font-bold text-slate-900">{plants.length}</span>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex flex-col justify-center items-center">
          <span className="text-sm text-red-600 mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> 주의/위험</span>
          <span className="text-3xl font-bold text-red-700">
            {plants.filter(p => p.currentStatus !== 'NORMAL').length}
          </span>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">식물 목록</h3>
          <Link href="/admin/plants/new" className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> 식물 등록
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">로딩 중...</div>
        ) : plants.length === 0 ? (
          <div className="text-center text-slate-400 py-8">등록된 식물이 없습니다.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {plants.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/plants/${p.id}`} className="font-semibold text-slate-900 hover:underline">
                    {p.name}
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlantStatusBadge status={p.currentStatus} />
                    <span className="text-xs text-slate-400">{p.locationName}</span>
                  </div>
                  <select
                    value={p.currentStatus}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="THIRSTY">THIRSTY</option>
                    <option value="DANGER">DANGER</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
