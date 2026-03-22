"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { getPlants } from '@/lib/api';
import { PlantStatusBadge } from '@/components/PlantStatusBadge';

export default function AdminDashboard() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlants().then(setPlants).finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-4 md:p-8 flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-900">
          <Link href="/" className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">관리자 대시보드</h1>
        </div>
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
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">이름</th>
                  <th className="px-4 py-3 font-medium">상태</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">위치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plants.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/plants/${p.id}`} className="hover:underline">{p.name}</Link>
                    </td>
                    <td className="px-4 py-3"><PlantStatusBadge status={p.currentStatus} /></td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{p.locationName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
