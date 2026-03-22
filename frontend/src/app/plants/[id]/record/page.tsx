"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Camera as CameraIcon, ImagePlus } from 'lucide-react';
import { createPlantLog, getPlantById } from '@/lib/api';
import { uploadImage, dataUrlToFile } from '@/lib/supabase';
import type { Plant } from '@/lib/types';

export default function RecordPage() {
  const { id } = useParams();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [plantError, setPlantError] = useState(false);

  // Form State
  const [watered, setWatered] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [hasIssue, setHasIssue] = useState(false);
  const [issueNote, setIssueNote] = useState('');
  const [relayMessage, setRelayMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getPlantById(Number(id))
        .then(setPlant)
        .catch(() => setPlantError(true))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setCameraError(false);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setPhoto(canvasRef.current.toDataURL('image/jpeg', 0.8));
        stopCamera();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const retake = () => {
    setPhoto(null);
    if (!cameraError) {
      startCamera();
    }
  };

  const extractCoords = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleSubmit = async () => {
    if (!photo) return alert('사진을 먼저 촬영해주세요.');
    setSubmitting(true);

    const coords = await extractCoords();

    try {
      const file = await dataUrlToFile(photo);
      const imageUrl = await uploadImage(file, 'logs');

      const res = await createPlantLog(Number(id), {
        imageUrl,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        watered,
        isHealthy,
        hasIssue,
        issueNote,
        relayMessage
      });

      router.push(`/logs/${res.id}`);
    } catch {
      stopCamera();
      const goHome = confirm('업로드에 실패했습니다. 식물이 삭제되었거나 서버에 문제가 있을 수 있습니다.\n\n메인 화면으로 이동하시겠습니까?');
      if (goHome) {
        router.push('/');
      } else {
        setSubmitting(false);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">로딩 중...</div>;

  if (plantError) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <p className="text-red-500 text-sm mb-4">식물 정보를 불러올 수 없습니다. 삭제되었거나 존재하지 않는 식물입니다.</p>
      <button onClick={() => router.push('/')} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-xl">메인으로 이동</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => { stopCamera(); router.back(); }} className="p-2 bg-black/50 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold">{plant?.name} 기록하기</span>
        <div className="w-9" />
      </header>

      {/* Camera Viewport */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden -mt-[72px]">
        {!photo ? (
          <>
            {cameraError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-sm text-slate-400 text-center">
                  카메라에 접근할 수 없습니다.<br/>갤러리에서 사진을 선택해주세요.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  <ImagePlus className="w-5 h-5" />
                  갤러리에서 선택
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {plant?.mainImageUrl && (
                  <img src={plant.mainImageUrl} className="ghost-overlay" alt="ghost overlay" />
                )}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 bg-white/20 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm"
                    title="갤러리에서 선택"
                  >
                    <ImagePlus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={takePhoto}
                    className="w-16 h-16 bg-white/20 rounded-full border-4 border-white shadow-xl flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-200" />
                  </button>
                  <div className="w-12" />
                </div>
              </>
            )}
          </>
        ) : (
          <img src={photo} className="w-full h-full object-cover" alt="captured" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Form Area */}
      {photo && (
        <div className="bg-white text-slate-900 rounded-t-3xl -mt-6 z-10 p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">상태 체크</h3>
            <button onClick={retake} className="text-sm text-slate-500 underline py-1 px-2">다시 찍기</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${watered ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200'} transition`}>
              <input type="checkbox" className="hidden" checked={watered} onChange={e => setWatered(e.target.checked)} />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${watered ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                {watered && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium">💧 물 주기 완료</span>
            </label>

            <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isHealthy ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200'} transition`}>
              <input type="checkbox" className="hidden" checked={isHealthy} onChange={e => setIsHealthy(e.target.checked)} />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${isHealthy ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                {isHealthy && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium">✨ 상태 양호</span>
            </label>

            <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${hasIssue ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200'} transition`}>
              <input type="checkbox" className="hidden" checked={hasIssue} onChange={e => setHasIssue(e.target.checked)} />
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${hasIssue ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                {hasIssue && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium">⚠️ 특이사항 있음</span>
            </label>
          </div>

          {hasIssue && (
            <textarea
              placeholder="어떤 특이사항이 있나요? (예: 잎이 시들었어요)"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-green-500"
              value={issueNote}
              onChange={e => setIssueNote(e.target.value)}
            />
          )}

          <textarea
            placeholder="다음 수호자에게 한 줄 메시지 남기기"
            className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-green-500 mt-2"
            value={relayMessage}
            onChange={e => setRelayMessage(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-2 bg-green-600 text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition disabled:opacity-70"
          >
            {submitting ? '업로드 중...' : '기록 완료하기'}
          </button>
        </div>
      )}
    </main>
  );
}
