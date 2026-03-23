"use client";

import { useEffect, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { getComments, createComment, deleteComment } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Comment } from '@/lib/types';

interface CommentSectionProps {
  logId: number;
  isAdmin?: boolean;
}

export default function CommentSection({ logId, isAdmin = false }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬스토리지에서 닉네임 복원
    const saved = localStorage.getItem('relay-bloom-nickname');
    if (saved) setNickname(saved);

    getComments(logId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [logId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      localStorage.setItem('relay-bloom-nickname', nickname.trim());
      const newComment = await createComment(logId, nickname.trim(), content.trim());
      setComments(prev => [...prev, newComment]);
      setContent('');
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('이 댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-semibold text-slate-800 text-sm">
        💬 댓글 {comments.length > 0 && <span className="text-slate-400 font-normal">({comments.length})</span>}
      </h4>

      {loading ? (
        <p className="text-xs text-slate-400">댓글 불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-400">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {comments.map(c => (
            <div key={c.id} className="bg-white border border-slate-100 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">{c.nickname}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: ko }) : ''}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-0.5 text-red-300 hover:text-red-500 transition"
                      title="댓글 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={50}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-green-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="댓글을 남겨보세요..."
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={300}
            className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            disabled={submitting || !nickname.trim() || !content.trim()}
            className="px-3 bg-green-600 text-white rounded-lg disabled:opacity-50 transition hover:bg-green-700"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
