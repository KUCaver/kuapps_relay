import React from 'react';

type Status = 'NORMAL' | 'THIRSTY' | 'DANGER';

export function PlantStatusBadge({ status }: { status: Status }) {
  const config = {
    NORMAL: { color: 'bg-green-100 text-green-800 border-green-200', text: '정상 (Normal)' },
    THIRSTY: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: '주의 (Thirsty)' },
    DANGER: { color: 'bg-red-100 text-red-800 border-red-200', text: '위험 (Danger)' }
  };

  const { color, text } = config[status] || config.NORMAL;

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${color}`}>
      {text}
    </span>
  );
}
