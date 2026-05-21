/* Learn tab — NCERT concept lesson hub. Lists chapters per class. */
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetchConceptLessons, fetchMe, type NcertClass } from '../../lib/queries';
import { Glyph } from '../onboarding/Glyph';
import { TabBar } from './TabBar';

const GRADE_TO_CLASS: Record<string, NcertClass> = {
  CLASS_7: 'CLASS_7', CLASS_8: 'CLASS_8', CLASS_9: 'CLASS_9',
  CLASS_10: 'CLASS_10', CLASS_11: 'CLASS_11', CLASS_12: 'CLASS_12',
};

const CLASS_LABEL: Record<NcertClass, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

export function LearnScreen() {
  const nav = useNavigate();
  const me = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const defaultClass: NcertClass = GRADE_TO_CLASS[me.data?.gradeLevel ?? 'CLASS_11'] ?? 'CLASS_11';
  const [ncertClass, setNcertClass] = useState<NcertClass>(defaultClass);
  const lessons = useQuery({ queryKey: ['lessons', ncertClass], queryFn: () => fetchConceptLessons(ncertClass) });

  const classes: NcertClass[] = ['CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'];

  return (
    <div className="screen">
      {/* Sticky top -- Library label + "Concept lessons" title + class filter
          chips stay frozen so the student can switch class without losing
          the heading or scrolling back up. Only the chapter list scrolls. */}
      <div className="app-head" style={{ paddingBottom: 0, flexShrink: 0 }}>
        <div>
          <div className="hello" style={{ fontSize: 12, color: 'var(--p-muted)' }}>Library</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.01em' }}>Concept lessons</div>
        </div>
      </div>
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        {/* Class filter — 4 chips visible per viewport, rest swipeable */}
        <div className="filter-row">
          {classes.map((c) => (
            <span
              key={c}
              className={`filter-chip ${ncertClass === c ? 'active' : ''}`}
              style={{
                flex: '0 0 calc((100% - 18px) / 4)',
                textAlign: 'center',
              }}
              onClick={() => setNcertClass(c)}
            >
              {CLASS_LABEL[c]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '0 22px' }}>
        {lessons.isLoading && <Empty msg="Loading chapters…" />}
        {lessons.data && lessons.data.length === 0 && <Empty msg="No chapters seeded for this class yet." />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          {(lessons.data ?? []).map((l) => (
            <div key={l.chapterCode} className="plan-card" onClick={() => nav(`/app/learn/${l.chapterCode}`)}>
              <div className="badge" style={{ background: 'var(--p-primary-tint)', color: 'var(--p-primary)' }}>
                {l.chapterNumber}
              </div>
              <div className="info">
                <div className="ttl">{l.title}</div>
                <div className="sub">{l.bigIdea}</div>
              </div>
              <Glyph.ChevronR accent="var(--p-muted)" size={16} />
            </div>
          ))}
        </div>

        <div style={{ height: 16 }} />
      </div>
      <TabBar />
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="card" style={{ padding: 14, textAlign: 'center', color: 'var(--p-muted)', fontSize: 12.5, margin: '12px 0' }}>
      {msg}
    </div>
  );
}
