"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createPlant } from '@/lib/api';
import { uploadImage } from '@/lib/supabase';

export default function NewPlantPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    locationName: '',
    latitude: 37.540,
    longitude: 127.079,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert('사진을 선택해주세요.');
    if (imageFile.size > 10 * 1024 * 1024) return alert('10MB 이하의 이미지만 업로드 가능합니다.');
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (lat < -90 || lat > 90) return alert('위도는 -90 ~ 90 범위여야 합니다.');
    if (lng < -180 || lng > 180) return alert('경도는 -180 ~ 180 범위여야 합니다.');
    setLoading(true);
    try {
      const imageUrl = await uploadImage(imageFile, 'plants');

      const plantData = {
        ...form,
        mainImageUrl: imageUrl,
        allowedRadiusMeter: 50,
        thresholdHours: 24,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=plant-${Date.now()}`
      };

      await createPlant(plantData);
      alert('식물이 등록되었습니다.');
      router.push('/admin');
    } catch (err) {
      console.error(err);
      const goAdmin = confirm('등록에 실패했습니다. 이미지 업로드 또는 서버 연결을 확인해주세요.\n\n관리자 페이지로 돌아가시겠습니까?');
      if (goAdmin) router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="flex items-center gap-2 text-slate-900 mb-6">
        <Link href="/admin" className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">새 식물 등록</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">식물 이름</label>
          <input required type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500" placeholder="예: 중앙도서관 선인장" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">상세 위치</label>
          <input required type="text" name="locationName" value={form.locationName} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500" placeholder="예: 중앙도서관 1층 로비" />
        </div>
        <div className="flex items-center justify-between mt-2 mb-1">
          <label className="block text-sm font-medium text-slate-700">위치 좌표 (위도/경도)</label>
          <button
            type="button"
            onClick={() => {
              if (!navigator.geolocation) return alert('위치 정보를 지원하지 않습니다.');
              navigator.geolocation.getCurrentPosition(pos => {
                setForm(prev => ({...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude}));
              }, () => alert('스마트폰(또는 PC)의 위치 권한을 허용해주세요.'));
            }}
            className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition"
          >
            내 현재 위치로 채우기
          </button>
        </div>
        <div className="flex gap-2">
          <input required type="number" step="0.000001" name="latitude" value={form.latitude} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500" placeholder="위도" />
          <input required type="number" step="0.000001" name="longitude" value={form.longitude} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500" placeholder="경도" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">대표 사진 업로드</label>
          <input required type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              const reader = new FileReader();
              reader.onloadend = () => setImagePreview(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-green-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          {imagePreview && (
            <img src={imagePreview} alt="미리보기" className="mt-2 w-full h-48 object-cover rounded-xl" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">식물 설명</label>
          <textarea required name="description" value={form.description} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-green-500" rows={3} placeholder="식물에 대한 소개글을 적어주세요." />
        </div>

        <button type="submit" disabled={loading} className="mt-4 w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg active:scale-[0.98] transition disabled:opacity-70">
          {loading ? '업로드 중...' : '식물 등록하기'}
        </button>
      </form>
    </main>
  );
}
