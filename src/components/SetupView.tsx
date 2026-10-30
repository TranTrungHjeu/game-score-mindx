import React, { useState } from 'react';
import type { MascotFamily, Team } from '@/types';
import { DIGIMON_FAMILIES, ELEMENT_CONFIG, getFullEvolutionChain, getEvolutionMilestones } from '@/data/digimon-catalog';
import { MascotAvatar } from './MascotAvatar';
import { Users, Plus, Trash2, ArrowRight, X, Settings, Eye } from 'lucide-react';

interface SetupViewProps {
  initialTeams: Team[];
  onStartSession: (configuredTeams: Team[], questions: string[]) => void;
  onCancel?: () => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ initialTeams, onStartSession, onCancel }) => {
  const [teamCount, setTeamCount] = useState<number>(Math.max(2, Math.min(6, initialTeams.length || 3)));
  const [teamConfigs, setTeamConfigs] = useState<Array<{ name: string; family: MascotFamily }>>(() => {
    return Array.from({ length: 6 }, (_, idx) => {
      const existing = initialTeams[idx];
      const matched = existing?.family?.id
        ? DIGIMON_FAMILIES.find((f) => f.id === existing.family.id) || existing.family
        : existing?.family || DIGIMON_FAMILIES[idx % DIGIMON_FAMILIES.length];
      const cleanFamily = {
        ...matched,
        name: matched.name.replace(/\s*\([^)]*\)/g, '').trim(),
      };
      return {
        name: existing?.name || `Đội ${idx + 1}`,
        family: cleanFamily,
      };
    });
  });

  const [questions, setQuestions] = useState<string[]>([
    'Lắp ráp xong khung robot bánh xích',
    'Lập trình cảm biến siêu âm tránh vật cản',
    'Thử thách tốc độ vượt sa bàn mê cung',
  ]);

  // Modal for selecting a Digimon for a specific team
  const [selectingForTeamIndex, setSelectingForTeamIndex] = useState<number | null>(null);
  // Modal for previewing a family's full evolution chain
  const [previewFamily, setPreviewFamily] = useState<MascotFamily | null>(null);

  const handleStart = () => {
    const activeConfigs = teamConfigs.slice(0, teamCount);
    const configuredTeams: Team[] = activeConfigs.map((cfg, idx) => ({
      id: `team-${idx + 1}-${Date.now()}`,
      name: cfg.name.trim() || `Đội ${idx + 1}`,
      family: cfg.family,
      score: 0,
      unlockedLevel: 1,
      megaActive: false,
    }));

    onStartSession(configuredTeams, questions.filter((q) => q.trim().length > 0));
  };

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'rgba(227, 31, 38, 0.15)',
            border: '1px solid rgba(227, 31, 38, 0.35)',
            borderRadius: '0px',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          <Settings size={15} />
          <span>THIẾT LẬP PHIÊN HỌC MỚI</span>
        </div>

        <h1 className="font-game" style={{ fontSize: '2.8rem', color: 'var(--text-main)' }}>
          ĐẤU TRƯỜNG TIẾN HÓA DIGIMON
        </h1>
      </div>

      {/* Step 1: Team Count Selector */}
      <section className="glass-panel" style={{ padding: '24px 28px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={24} color="#38bdf8" />
            <div>
              <h2 className="font-game" style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                1. CHỌN SỐ LƯỢNG ĐỘI
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={`btn-count-${num}`}
                type="button"
                onClick={() => setTeamCount(num)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '0px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: teamCount === num ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  background: teamCount === num ? 'linear-gradient(135deg, var(--primary), #b9151b)' : 'rgba(241, 245, 249, 0.9)',
                  color: teamCount === num ? '#ffffff' : 'var(--text-main)',
                  boxShadow: teamCount === num ? '0 0 16px rgba(227, 31, 38, 0.35)' : 'none',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Step 2: Configure Each Team Card Grid */}
      <section style={{ marginBottom: 36 }}>
        <h2 className="font-game" style={{ fontSize: '1.45rem', color: 'var(--text-main)', marginBottom: 16 }}>
          2. CẤU HÌNH TÊN ĐỘI & DIGIMON LINH VẬT ({teamCount} ĐỘI)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {Array.from({ length: teamCount }).map((_, idx) => {
            const config = teamConfigs[idx];
            const element = ELEMENT_CONFIG[config.family.element];

            return (
              <div
                key={`team-cfg-${idx}`}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  border: `2px solid ${config.family.accent}44`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    className="font-game"
                    style={{ fontSize: '1.1rem', color: config.family.accent }}
                  >
                    ĐỘI #{idx + 1}
                  </span>

                  <span className="badge-element">
                    {element.label}
                  </span>
                </div>

                {/* Team Name Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Tên đại diện đội:
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => {
                      const newConfigs = [...teamConfigs];
                      newConfigs[idx].name = e.target.value;
                      setTeamConfigs(newConfigs);
                    }}
                    placeholder={`Tên đội ${idx + 1}`}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '0px',
                      background: '#ffffff',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-main)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Mascot Preview & Change Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px',
                    borderRadius: '0px',
                    background: 'rgba(241, 245, 249, 0.85)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <MascotAvatar family={config.family} level={1} size={80} />

                  {(() => {
                    const stages = getFullEvolutionChain(config.family);
                    const lowestStage = stages[0];
                    const finalStage = stages[stages.length - 1];

                    return (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lowestStage.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>
                          Tối đa ➔ {finalStage.name}
                        </div>

                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn-action btn-secondary"
                            onClick={() => setSelectingForTeamIndex(idx)}
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          >
                            Đổi Digimon...
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewFamily(config.family)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '5px 10px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              background: '#ffffff',
                              border: '1px solid var(--border-medium)',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              borderRadius: '0px',
                            }}
                            title="Xem chi tiết các mốc tiến hóa từ nhỏ đến tối đa"
                          >
                            <Eye size={13} color="var(--primary)" />
                            <span>Xem ({stages.length} cấp)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 3: Bonus / Mega Questions */}
      <section className="glass-panel" style={{ padding: '24px 28px', marginBottom: 36 }}>
        <h2 className="font-game" style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: 4 }}>
          3. CÂU HỎI & NHIỆM VỤ THỬ THÁCH (MEGA QUESTIONS)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Khi học sinh hoàn thành các thử thách này, giáo viên có thể mở khóa Tiến hóa Tối Thượng (Mega).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {questions.map((q, qIdx) => (
            <div key={`q-item-${qIdx}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', width: 65 }}>
                Câu {qIdx + 1}:
              </span>
              <input
                type="text"
                value={q}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIdx] = e.target.value;
                  setQuestions(updated);
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '0px',
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                title="Xóa câu hỏi"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn-action btn-secondary"
          onClick={() => setQuestions([...questions, `Nhiệm vụ thử thách ${questions.length + 1}`])}
          style={{ fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Thêm câu hỏi thử thách
        </button>
      </section>

      {/* Start Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {onCancel && (
          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={onCancel}
            style={{ padding: '14px 28px', fontSize: '1.1rem' }}
          >
            Hủy & Quay lại
          </button>
        )}

        <button
          type="button"
          className="btn-action btn-primary"
          onClick={handleStart}
          style={{ padding: '16px 48px', fontSize: '1.25rem', borderRadius: '0px' }}
        >
          Bắt Đầu Tiết Học Ngay <ArrowRight size={22} />
        </button>
      </div>

      {/* Modal: Digimon Catalog Picker */}
      {selectingForTeamIndex !== null && (
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
              maxWidth: 1100,
              width: '100%',
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              border: '2px solid rgba(56, 189, 248, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 className="font-game" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
                  CHỌN DIGIMON CHO ĐỘI #{selectingForTeamIndex + 1}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Chọn Digimon linh vật đại diện ({DIGIMON_FAMILIES.length} Digimon kèm chuỗi tiến hóa từ Nhỏ đến Tối đa)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectingForTeamIndex(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: 8,
                }}
                title="Đóng"
              >
                <X size={24} />
              </button>
            </div>

            {/* Digimon Grid */}
            <div
              id="digimon-picker-grid"
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16,
                paddingRight: 6,
              }}
            >
              {DIGIMON_FAMILIES.map((family) => {
                const isSelected = teamConfigs[selectingForTeamIndex]?.family.id === family.id;
                const stages = getFullEvolutionChain(family);
                const lowestStage = stages[0];
                const finalStage = stages[stages.length - 1];

                return (
                  <div
                    key={`pick-${family.id}`}
                    onClick={() => {
                      const newConfigs = [...teamConfigs];
                      newConfigs[selectingForTeamIndex].family = family;
                      setTeamConfigs(newConfigs);
                      setSelectingForTeamIndex(null);
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: '0px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                      background: isSelected ? 'rgba(227, 31, 38, 0.08)' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 0 16px rgba(227, 31, 38, 0.25)' : 'none',
                    }}
                  >
                    {/* Top Row: Stage Badge & Small Preview Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          background: lowestStage.stageName === 'Baby' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(227, 31, 38, 0.08)',
                          border: lowestStage.stageName === 'Baby' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(227, 31, 38, 0.3)',
                          color: lowestStage.stageName === 'Baby' ? '#0284c7' : 'var(--primary)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {lowestStage.stageName === 'Baby' ? 'Ấu thơ' : 'Cấp 1'}
                      </span>

                      {/* Small Button to view evolution path */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFamily(family);
                        }}
                        title="Xem chi tiết hướng tiến hóa từ nhỏ đến tối đa"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          background: 'rgba(241, 245, 249, 0.95)',
                          border: '1px solid var(--border-medium)',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          borderRadius: '0px',
                        }}
                      >
                        <Eye size={13} color="var(--primary)" />
                        <span>Xem tiến hóa ({stages.length} cấp)</span>
                      </button>
                    </div>

                    {/* Large Center Area: Big Sprite Image to WOW Students */}
                    <div
                      style={{
                        height: 140,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 0',
                        background: 'radial-gradient(circle, rgba(241, 245, 249, 0.7) 0%, transparent 72%)',
                      }}
                    >
                      <img
                        src={lowestStage.artworkPath || lowestStage.animatedPath}
                        alt={lowestStage.name}
                        onError={(e) => {
                          const current = e.currentTarget.getAttribute('src');
                          if (lowestStage.animatedPath && current !== lowestStage.animatedPath) {
                            e.currentTarget.src = lowestStage.animatedPath;
                          } else {
                            e.currentTarget.src = '/assets/digimon/sprites/agumon.png';
                          }
                        }}
                        style={{
                          width: 110,
                          height: 110,
                          objectFit: 'contain',
                          imageRendering: 'pixelated',
                          filter: 'drop-shadow(0 6px 14px rgba(15, 23, 42, 0.15))',
                          transition: 'transform 0.25s ease',
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Area: Name & Final Form */}
                    <div style={{ textAlign: 'center' }}>
                      <div
                        className="font-game"
                        style={{
                          fontSize: '1.35rem',
                          color: 'var(--text-main)',
                          lineHeight: 1.2,
                          marginBottom: 4,
                        }}
                      >
                        {lowestStage.name}
                      </div>

                      <div
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          marginBottom: 2,
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        Đạt tối đa ➔ <strong>{finalStage.name}</strong>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        {family.elementLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Evolution Chain Preview Modal */}
      {previewFamily && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '20px',
          }}
          onClick={() => setPreviewFamily(null)}
        >
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 900,
              width: '100%',
              padding: '32px 28px',
              border: '2px solid var(--primary)',
              borderRadius: '0px',
              background: '#ffffff',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(227, 31, 38, 0.25)',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setPreviewFamily(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: 6,
              }}
              title="Đóng"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 className="font-game" style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: 6 }}>
                HƯỚNG TIẾN HÓA: {previewFamily.name.toUpperCase()}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: 0 }}>
                {previewFamily.elementLabel} • {getFullEvolutionChain(previewFamily).length} Cấp độ tiến hóa theo mốc điểm
              </p>
            </div>

            {/* Stages Row */}
            {(() => {
              const previewStages = getFullEvolutionChain(previewFamily);
              const previewMilestones = getEvolutionMilestones(previewStages.length, 20);

              return (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${previewStages.length}, 1fr)`,
                      gap: 12,
                      alignItems: 'center',
                      margin: '24px 0',
                      overflowX: 'auto',
                      paddingBottom: 8,
                    }}
                  >
                    {previewStages.map((st, idx) => {
                      const milestone = previewMilestones[idx];
                      const isFinal = idx === previewStages.length - 1;
                      return (
                        <div
                          key={`preview-stg-${st.name}-${idx}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '16px 8px',
                            background: isFinal ? 'rgba(227, 31, 38, 0.06)' : 'rgba(241, 245, 249, 0.8)',
                            border: isFinal ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                            borderRadius: '0px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: isFinal ? 'var(--primary)' : '#0284c7',
                              textTransform: 'uppercase',
                              marginBottom: 6,
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {idx === 0 ? 'Cấp 1' : `Cấp ${idx + 1}`}
                          </div>

                          <div
                            style={{
                              width: 72,
                              height: 72,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '6px 0 10px',
                            }}
                          >
                            <img
                              src={st.artworkPath || st.animatedPath}
                              alt={st.name}
                              onError={(e) => {
                                const current = e.currentTarget.getAttribute('src');
                                if (st.animatedPath && current !== st.animatedPath) {
                                  e.currentTarget.src = st.animatedPath;
                                } else {
                                  e.currentTarget.src = '/assets/digimon/sprites/agumon.png';
                                }
                              }}
                              style={{
                                maxWidth: 68,
                                maxHeight: 68,
                                objectFit: 'contain',
                                imageRendering: 'pixelated',
                              }}
                            />
                          </div>

                          <div
                            className="font-game"
                            style={{
                              fontSize: '1.05rem',
                              color: isFinal ? 'var(--primary)' : 'var(--text-main)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              marginBottom: 4,
                            }}
                            title={st.name}
                          >
                            {st.name}
                          </div>

                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: 'var(--text-dim)',
                              background: '#ffffff',
                              padding: '2px 8px',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {milestone === 0 ? '0 PTS' : `${milestone} PTS`}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Select Button */}
                  {selectingForTeamIndex !== null && (
                    <button
                      type="button"
                      className="btn-action btn-primary"
                      onClick={() => {
                        const newConfigs = [...teamConfigs];
                        newConfigs[selectingForTeamIndex].family = previewFamily;
                        setTeamConfigs(newConfigs);
                        setPreviewFamily(null);
                        setSelectingForTeamIndex(null);
                      }}
                      style={{ width: '100%', padding: '14px', fontSize: '1.1rem', borderRadius: '0px', marginTop: 12 }}
                    >
                      Chọn Digimon này cho Đội #{selectingForTeamIndex + 1}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
