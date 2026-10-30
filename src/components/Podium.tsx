import React from 'react';
import type { Team } from '@/types';
import { MascotAvatar } from './MascotAvatar';
import { getStageForScore } from '@/data/digimon-catalog';
import { Crown, Medal, Award } from 'lucide-react';

interface PodiumProps {
  teams: Team[];
  onScoreClick?: (teamId: string, delta: number) => void;
}

export const Podium: React.FC<PodiumProps> = ({ teams }) => {
  // Sort teams descending by score
  const sorted = [...teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.unlockedLevel || 1) - (a.unlockedLevel || 1);
  });

  const leader = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  if (!leader) return null;

  const podiumSlots = [
    { team: second, rank: 2, height: 110, color: '#64748b', label: 'HẠNG 2', IconComponent: Medal },
    { team: leader, rank: 1, height: 145, color: 'var(--primary)', label: 'DẪN ĐẦU', IconComponent: Crown },
    { team: third, rank: 3, height: 90, color: '#64748b', label: 'HẠNG 3', IconComponent: Award },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 20px 20px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-card)',
      }}
    >
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Crown size={22} color="var(--primary)" />
          <span className="font-game" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            BẬC XẾP HẠNG BỤC VINH DANH
          </span>
        </div>
        {leader && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(227, 31, 38, 0.08)',
              border: '1px solid rgba(227, 31, 38, 0.25)',
              borderRadius: '0px',
              padding: '4px 12px',
              fontSize: '0.82rem',
              color: 'var(--primary)',
            }}
          >
            <span>Đang dẫn đầu: <strong>{leader.name}</strong></span>
          </div>
        )}
      </div>

      {/* 3 Pedestal Lanes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr 1fr',
          gap: 16,
          alignItems: 'flex-end',
          minHeight: 330,
          paddingTop: 10,
        }}
      >
        {podiumSlots.map(({ team, rank, height, color, label, IconComponent }) => {
          if (!team) {
            return (
              <div
                key={`empty-rank-${rank}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: 0.3,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: height * 0.7,
                    borderRadius: '0px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px dashed rgba(255,255,255,0.1)',
                  }}
                />
              </div>
            );
          }

          const isLeader = rank === 1;
          const isEgg = Boolean(team.isEgg || team.score < 0 || team.unlockedLevel === 0);
          const stageInfo = getStageForScore(team.family, team.score, isEgg, 20);

          return (
            <div
              key={team.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Leader Crown Badge */}
              {isLeader && (
                <div
                  style={{
                    position: 'absolute',
                    top: -24,
                    zIndex: 10,
                    animation: 'pulseGlow 2s infinite',
                  }}
                >
                  <Crown size={28} color="var(--primary)" fill="var(--primary)" />
                </div>
              )}

              {/* Avatar Quái thú Lớn & Nổi Bật */}
              <div style={{ marginBottom: 12 }}>
                <MascotAvatar
                  family={team.family}
                  level={stageInfo.level}
                  stage={stageInfo.stage}
                  size={isLeader ? 160 : 128}
                  glow={isLeader}
                  action={isLeader ? 'happy' : 'idle'}
                />
              </div>

              {/* Team Name & Points */}
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <div
                  className="font-game"
                  style={{
                    fontSize: isLeader ? '1.35rem' : '1.1rem',
                    color: 'var(--text-main)',
                  }}
                >
                  {team.name}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isEgg ? '#dc2626' : 'var(--text-dim)', marginTop: 2 }}>
                  {isEgg ? 'Digitama' : stageInfo.stage.name}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    padding: '2px 10px',
                    borderRadius: '0px',
                    background: isLeader ? 'var(--primary)' : '#ffffff',
                    border: isLeader ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                    fontSize: isLeader ? '1rem' : '0.85rem',
                    fontWeight: 800,
                    color: isLeader ? '#ffffff' : 'var(--text-main)',
                  }}
                >
                  {team.score} ĐIỂM
                </div>
              </div>

              {/* Pedestal Box */}
              <div
                style={{
                  width: '100%',
                  height,
                  borderRadius: '0px',
                  background: isLeader
                    ? 'linear-gradient(180deg, #ffffff 0%, rgba(227, 31, 38, 0.08) 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                  borderTop: isLeader ? '3px solid var(--primary)' : '1px solid var(--border-medium)',
                  borderLeft: isLeader ? '2px solid rgba(227, 31, 38, 0.35)' : '1px solid var(--border-subtle)',
                  borderRight: isLeader ? '2px solid rgba(227, 31, 38, 0.35)' : '1px solid var(--border-subtle)',
                  boxShadow: isLeader ? '0 10px 25px -5px rgba(227, 31, 38, 0.15)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <IconComponent size={isLeader ? 26 : 20} color={color} />
                <span
                  className="font-game"
                  style={{
                    fontSize: isLeader ? '1.5rem' : '1.15rem',
                    fontWeight: 900,
                    color,
                    letterSpacing: '0.05em',
                  }}
                >
                  #{rank}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
