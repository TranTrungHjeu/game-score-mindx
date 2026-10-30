import React, { useState } from 'react';
import type { ClassroomSession, DigimonAction } from '@/types';
import { TeamLane } from './TeamLane';
import { TeamCard } from './TeamCard';
import { Podium } from './Podium';
import {
  Award,
  RotateCcw,
  Volume2,
  VolumeX,
  Monitor,
  Settings,
  Zap,
  Flame,
  LayoutGrid,
  ListOrdered,
  Trophy,
} from 'lucide-react';

interface TeacherViewProps {
  session: ClassroomSession;
  onScore: (teamId: string, delta: number) => void;
  onMegaEvolve: (teamId: string) => void;
  onReplayEvolution: (teamId: string) => void;
  onAwardQuestion: (questionId: string, teamId: string | null) => void;
  onTriggerAction?: (teamId: string, action: DigimonAction) => void;
  onUndo: () => void;
  canUndo: boolean;
  onToggleAudio: () => void;
  onOpenSummary: () => void;
  onOpenSetup: () => void;
  onSwitchToProjector: () => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  session,
  onScore,
  onMegaEvolve,
  onReplayEvolution,
  onAwardQuestion,
  onTriggerAction,
  onUndo,
  canUndo,
  onToggleAudio,
  onOpenSummary,
  onOpenSetup,
  onSwitchToProjector,
}) => {
  // Layout mode: 'lanes' (Phương án C - mặc định) hoặc 'cards' (Lưới thẻ)
  const [layoutMode, setLayoutMode] = useState<'lanes' | 'cards'>('lanes');

  // Sorted teams by score descending (Rank 1 to N)
  const sortedTeams = [...session.teams].sort((a, b) => b.score - a.score);
  const leader = sortedTeams[0];
  const secondPlace = sortedTeams[1];
  const leadDiff = leader && secondPlace ? leader.score - secondPlace.score : 0;
  const totalPoints = session.teams.reduce((acc, t) => acc + t.score, 0);

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* 1. Top Controls Toolbar */}
      <header
        className="glass-panel"
        style={{
          padding: '14px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left branding */}
        <div>
          <div
            className="font-game"
            style={{
              fontSize: '1.45rem',
              color: 'var(--text-main)',
              letterSpacing: '0.02em',
            }}
          >
            MINDX DIGIMON ARENA
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Layout switcher: Lanes vs Cards */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(226, 232, 240, 0.8)',
              borderRadius: '0px',
              padding: '3px',
              border: '1px solid rgba(203, 213, 225, 0.8)',
            }}
          >
            <button
              type="button"
              onClick={() => setLayoutMode('lanes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: '0px',
                border: 'none',
                background: layoutMode === 'lanes' ? 'var(--primary)' : 'transparent',
                color: layoutMode === 'lanes' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              title="Đấu trường đối kháng (Arena Lanes)"
            >
              <ListOrdered size={14} /> Lanes
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: '0px',
                border: 'none',
                background: layoutMode === 'cards' ? 'var(--primary)' : 'transparent',
                color: layoutMode === 'cards' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              title="Lưới thẻ truyền thống (Cards)"
            >
              <LayoutGrid size={14} /> Thẻ
            </button>
          </div>

          {/* Undo Button */}
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onUndo}
            disabled={!canUndo}
            style={{ opacity: canUndo ? 1 : 0.45, padding: '8px 14px', fontSize: '0.85rem' }}
            title="Hoàn tác lượt cộng/trừ điểm vừa rồi"
          >
            <RotateCcw size={15} /> Hoàn tác
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onToggleAudio}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title={session.audioEnabled ? 'Tắt âm thanh đấu trường' : 'Bật âm thanh đấu trường'}
          >
            {session.audioEnabled ? <Volume2 size={15} color="var(--primary)" /> : <VolumeX size={15} color="var(--text-dim)" />}
            {session.audioEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}
          </button>

          {/* Projector Mode */}
          <button
            type="button"
            className="btn-action btn-primary"
            onClick={onSwitchToProjector}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Mở màn hình chiếu lớn cho học sinh quan sát"
          >
            <Monitor size={15} /> Máy chiếu
          </button>

          {/* Session Summary */}
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onOpenSummary}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Tổng kết điểm và trao cúp chiến thắng"
          >
            <Award size={15} /> Tổng kết
          </button>

          {/* Settings / Setup */}
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onOpenSetup}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Cấu hình chia đội & linh vật cho buổi học mới"
          >
            <Settings size={15} /> Buổi học mới
          </button>
        </div>
      </header>

      {/* 2. Live Arena Status Ticker - Gọn gàng 2 thẻ cốt lõi */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Leading team highlight */}
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '0px',
              background: 'rgba(227, 31, 38, 0.1)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--primary)',
            }}
          >
            <Trophy size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              ĐỘI DẪN ĐẦU ĐẤU TRƯỜNG
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {leader ? (
                <>
                  {leader.name} ({leader.score} PTS)
                  {leadDiff > 0 && (
                    <span style={{ color: 'var(--primary)', fontSize: '0.82rem', marginLeft: 8 }}>
                      (+{leadDiff} PTS)
                    </span>
                  )}
                </>
              ) : (
                'Chưa có dữ liệu'
              )}
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div
          className="glass-panel"
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '0px',
              background: 'rgba(227, 31, 38, 0.15)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--primary)',
            }}
          >
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              TỔNG ĐIỂM TIẾT HỌC
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {totalPoints} PTS
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Battle Arena Display */}
      {layoutMode === 'lanes' ? (
        /* ================= OPTION C: ARENA LANES ================= */
        <section style={{ marginBottom: 36 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flame size={22} color="var(--primary)" />
              <h2 className="font-game" style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                ĐẤU TRƯỜNG ARENA LANES ({session.teams.length} ĐỘI)
              </h2>
            </div>
          </div>

          {/* Lanes Container */}
          <div className="arena-lanes-container">
            {sortedTeams.map((team, idx) => (
              <TeamLane
                key={team.id}
                team={team}
                rank={idx + 1}
                isLeader={idx === 0}
                onScore={onScore}
                onMegaEvolve={onMegaEvolve}
                onReplayEvolution={onReplayEvolution}
                onTriggerAction={onTriggerAction}
                isTeacherView
              />
            ))}
          </div>
        </section>
      ) : (
        /* ================= OPTION A / CARDS GRID WITH PODIUM ================= */
        <section style={{ marginBottom: 36 }}>
          <div style={{ marginBottom: 28 }}>
            <Podium teams={session.teams} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <h2 className="font-game" style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
              DANH SÁCH THẺ ĐỘI ({session.teams.length})
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 20,
            }}
          >
            {sortedTeams.map((team, idx) => (
              <TeamCard
                key={team.id}
                team={team}
                isLeader={idx === 0}
                onScore={onScore}
                onMegaEvolve={onMegaEvolve}
                onReplayEvolution={onReplayEvolution}
                onTriggerAction={onTriggerAction}
                isTeacherView
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Thử Thách Boss Mega / Bonus Questions Section */}
      {session.questions && session.questions.length > 0 && (
        <section className="glass-panel" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '0px',
                background: 'rgba(227, 31, 38, 0.1)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary)',
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-game" style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>
                NHIỆM VỤ THỬ THÁCH
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.questions.map((q, idx) => {
              const awardedTeam = session.teams.find((t) => t.id === q.winnerTeamId);

              return (
                <div
                  key={q.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '14px 20px',
                    borderRadius: '0px',
                    background: awardedTeam
                      ? 'rgba(227, 31, 38, 0.06)'
                      : 'rgba(255, 255, 255, 0.6)',
                    border: awardedTeam
                      ? '1px solid rgba(227, 31, 38, 0.35)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                    <span
                      style={{
                        fontWeight: 800,
                        color: 'var(--primary)',
                        fontSize: '0.85rem',
                        padding: '3px 8px',
                        background: 'rgba(227, 31, 38, 0.08)',
                        borderRadius: '0px',
                      }}
                    >
                      THỬ THÁCH #{idx + 1}
                    </span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {q.prompt}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Đội chiến thắng:
                    </span>
                    <select
                      value={q.winnerTeamId || ''}
                      onChange={(e) => onAwardQuestion(q.id, e.target.value || null)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '0px',
                        background: '#ffffff',
                        border: '1px solid var(--border-medium)',
                        color: awardedTeam ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">-- Chọn đội hoàn thành --</option>
                      {session.teams.map((t) => (
                        <option key={`opt-team-${t.id}`} value={t.id}>
                          {t.name} ({t.family.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
