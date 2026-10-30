import React, { useEffect } from 'react';
import type { Team } from '@/types';
import { MascotAvatar } from './MascotAvatar';
import { getStageForScore } from '@/data/digimon-catalog';
import { fireSideCannons } from '@/services/sound';
import { Trophy, RotateCcw, X, Award } from 'lucide-react';

interface SessionSummaryModalProps {
  isOpen: boolean;
  teams: Team[];
  onClose: () => void;
  onResetSession: () => void;
  onStartNewSession?: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  teams,
  onClose,
  onResetSession,
  onStartNewSession,
}) => {
  useEffect(() => {
    if (isOpen) {
      fireSideCannons();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const champion = sorted[0];
  const totalClassPoints = teams.reduce((sum, t) => sum + t.score, 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 8, 16, 0.9)',
        backdropFilter: 'blur(16px)',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 28px',
          position: 'relative',
          border: '2px solid var(--primary)',
          background: '#ffffff',
          boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.25)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            borderRadius: '0px',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(227, 31, 38, 0.08)',
              border: '1px solid rgba(227, 31, 38, 0.25)',
              borderRadius: '0px',
              padding: '6px 16px',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            <Trophy size={18} />
            <span>TỔNG KẾT TIẾT HỌC ROBOTICS MINDX</span>
          </div>

          <h2 className="font-game" style={{ fontSize: '2.4rem', color: 'var(--text-main)' }}>
            VINH DANH NHÀ VÔ ĐỊCH
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Cả lớp đã đạt tổng cộng <strong>{totalClassPoints} điểm</strong> trong buổi học hôm nay!
          </p>
        </div>

        {/* Champion Spotlight Box */}
        {champion && (
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(227, 31, 38, 0.06) 100%)',
              border: '2px solid var(--primary)',
              borderRadius: '0px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px -5px rgba(227, 31, 38, 0.15)',
              marginBottom: 28,
              position: 'relative',
            }}
          >
            {(() => {
              const championEgg = Boolean(champion.isEgg || champion.score < 0 || champion.unlockedLevel === 0);
              const championStageInfo = getStageForScore(champion.family, champion.score, championEgg, 20);

              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <MascotAvatar
                      family={champion.family}
                      level={championStageInfo.level}
                      stage={championStageInfo.stage}
                      size={165}
                      glow
                      action="happy"
                    />
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', marginBottom: 4 }}>
                    <Award size={20} />
                    <span style={{ fontWeight: 800, letterSpacing: '0.06em' }}>QUÁN QUÂN BUỔI HỌC</span>
                  </div>

                  <h3 className="font-game" style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: 2 }}>
                    {champion.name}
                  </h3>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: championEgg ? '#dc2626' : 'var(--text-dim)', marginBottom: 8 }}>
                    {championEgg ? 'Digitama' : championStageInfo.stage.name}
                  </div>
                </>
              );
            })()}

            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                background: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.2rem',
                padding: '4px 18px',
                borderRadius: '0px',
              }}
            >
              {champion.score} ĐIỂM
            </div>
          </div>
        )}

        {/* Full Team Standings Table */}
        <h4 className="font-game" style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: 12 }}>
          BẢNG XẾP HẠNG CHI TIẾT
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {sorted.map((t, idx) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '0px',
                background: idx === 0 ? 'rgba(227, 31, 38, 0.06)' : '#ffffff',
                border: idx === 0 ? '1px solid rgba(227, 31, 38, 0.35)' : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  className="font-game"
                  style={{
                    fontSize: '1.2rem',
                    width: 28,
                    color: idx === 0 ? 'var(--primary)' : '#64748b',
                  }}
                >
                  #{idx + 1}
                </span>

                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {getStageForScore(t.family, t.score, Boolean(t.isEgg || t.score < 0 || t.unlockedLevel === 0), 20).stage.name}
                  </div>
                </div>
              </div>

              <div className="font-game" style={{ fontSize: '1.4rem', color: idx === 0 ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                {t.score} PTS
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onClose}
            style={{ padding: '12px' }}
          >
            Quay lại bảng điểm
          </button>

          <button
            type="button"
            className="btn-action btn-primary"
            onClick={() => {
              if (onStartNewSession) {
                onStartNewSession();
              } else {
                onResetSession();
                onClose();
              }
            }}
            style={{ padding: '12px' }}
          >
            <RotateCcw size={18} />
            Bắt đầu buổi học mới
          </button>
        </div>
      </div>
    </div>
  );
};
