import React, { useState } from 'react';
import type { ClassroomSession } from '@/types';
import { Podium } from './Podium';
import { TeamCard } from './TeamCard';
import { TeamLane } from './TeamLane';
import { Maximize, Minimize, Settings, ListOrdered, LayoutGrid } from 'lucide-react';

interface ProjectorViewProps {
  session: ClassroomSession;
  onExitProjector: () => void;
}

export const ProjectorView: React.FC<ProjectorViewProps> = ({ session, onExitProjector }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewStyle, setViewStyle] = useState<'lanes' | 'podium'>('lanes');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const sortedTeams = [...session.teams].sort((a, b) => b.score - a.score);
  const leaderId = sortedTeams[0]?.id;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px 28px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 1600,
        margin: '0 auto',
      }}
    >
      {/* Immersive Classroom Banner Header */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 className="font-game" style={{ fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            ĐẤU TRƯỜNG TIẾN HÓA DIGIMON
          </h1>
        </div>

        {/* Projector Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Switch style */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(226, 232, 240, 0.8)',
              borderRadius: '0px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewStyle('lanes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: '0px',
                border: 'none',
                background: viewStyle === 'lanes' ? 'var(--primary)' : 'transparent',
                color: viewStyle === 'lanes' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <ListOrdered size={14} /> Lanes
            </button>
            <button
              type="button"
              onClick={() => setViewStyle('podium')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: '0px',
                border: 'none',
                background: viewStyle === 'podium' ? 'var(--primary)' : 'transparent',
                color: viewStyle === 'podium' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={14} /> Podium
            </button>
          </div>

          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={toggleFullscreen}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            title="Bật/Tắt toàn màn hình"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          </button>

          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onExitProjector}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Settings size={15} /> Bảng giáo viên
          </button>
        </div>
      </div>

      {viewStyle === 'lanes' ? (
        /* ARENA LANES MODE ON PROJECTOR */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <h2 className="font-game" style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>
              BẢNG XẾP HẠNG ĐỐI KHÁNG TRỰC TIẾP ({session.teams.length} ĐỘI)
            </h2>
          </div>

          <div className="arena-lanes-container">
            {sortedTeams.map((team, idx) => (
              <TeamLane
                key={team.id}
                team={team}
                rank={idx + 1}
                isLeader={idx === 0}
                onScore={() => {}}
                isTeacherView={false}
              />
            ))}
          </div>
        </div>
      ) : (
        /* PODIUM + CARDS MODE ON PROJECTOR */
        <div>
          <div style={{ marginBottom: 24 }}>
            <Podium teams={session.teams} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <h2 className="font-game" style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>
              BẢNG ĐIỂM CÁC ĐỘI ({session.teams.length})
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {session.teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isLeader={team.id === leaderId}
                onScore={() => {}}
                isTeacherView={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
