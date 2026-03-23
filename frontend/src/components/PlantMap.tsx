"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Plant } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  NORMAL: '#22c55e',
  THIRSTY: '#f59e0b',
  DANGER: '#ef4444',
};

function createPlantIcon(status: string) {
  const color = STATUS_COLORS[status] || '#22c55e';
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 32px; height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    ">🌱</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px; height: 16px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 6px rgba(59,130,246,0.2), 0 2px 4px rgba(0,0,0,0.2);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface PlantMapProps {
  plants: Plant[];
  userLocation: { lat: number; lng: number } | null;
  onPlantClick: (id: number) => void;
}

export default function PlantMap({ plants, userLocation, onPlantClick }: PlantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // 기본 중심: 건국대학교
    const defaultCenter: [number, number] = [37.5407, 127.0786];
    const center = userLocation
      ? [userLocation.lat, userLocation.lng] as [number, number]
      : plants.length > 0
        ? [plants[0].latitude, plants[0].longitude] as [number, number]
        : defaultCenter;

    const map = L.map(mapRef.current, {
      center,
      zoom: 16,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // 사용자 위치 마커
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>내 위치</b>');
    }

    // 식물 마커
    plants.forEach((plant) => {
      if (!plant.latitude || !plant.longitude) return;
      const marker = L.marker([plant.latitude, plant.longitude], {
        icon: createPlantIcon(plant.currentStatus),
      }).addTo(map);

      marker.bindPopup(`
        <div style="text-align:center; min-width: 120px;">
          <b style="font-size:14px;">${plant.name}</b><br/>
          <span style="font-size:11px; color:#64748b;">📍 ${plant.locationName}</span><br/>
          <button onclick="window.__onPlantClick(${plant.id})" style="
            margin-top:6px; padding:4px 12px;
            background:#22c55e; color:white;
            border:none; border-radius:8px;
            font-size:12px; font-weight:600;
            cursor:pointer;
          ">상세보기</button>
        </div>
      `);
    });

    // 모든 마커가 보이도록 fit bounds
    if (plants.length > 0) {
      const bounds = L.latLngBounds(
        plants
          .filter(p => p.latitude && p.longitude)
          .map(p => [p.latitude, p.longitude] as [number, number])
      );
      if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [plants, userLocation]);

  // 팝업 내 버튼 클릭 핸들러
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__onPlantClick = (id: number) => onPlantClick(id);
    return () => { delete (window as unknown as Record<string, unknown>).__onPlantClick; };
  }, [onPlantClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
    />
  );
}
