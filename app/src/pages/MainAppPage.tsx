/* MainAppPage — sage-themed mobile shell (ported from prototype features-a + features-b).
 * Wraps 5 main tabs (Home / Learn / Notes / Mocks / Me) in a phone-shaped viewport.
 * Each tab is its own route under /app/*.
 */
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from '../components/main/HomeScreen';
import { LearnScreen } from '../components/main/LearnScreen';
import { ConceptLessonScreen } from '../components/main/ConceptLessonScreen';
import { NotesListScreen } from '../components/main/NotesListScreen';
import { MocksScreen } from '../components/main/MocksScreen';
import { MockExamPlayScreen } from '../components/main/MockExamPlayScreen';
import { MockResultDetailScreen } from '../components/main/MockResultDetailScreen';
import { MeScreen } from '../components/main/MeScreen';
import { ReportScreen } from '../components/main/ReportScreen';
import { SettingsScreen } from '../components/main/SettingsScreen';
import { AdminIngestScreen } from '../components/admin/AdminIngestScreen';
import { AdminDraftListScreen } from '../components/admin/AdminDraftListScreen';
import { AdminDraftEditorScreen } from '../components/admin/AdminDraftEditorScreen';
import '../styles/onboarding.css';

export default function MainAppPage() {
  // 인도 PoC 앱 surface — 한국어 잔존 차단. 사용자가 명시적으로 KO 토글 안 했다면 EN 강제.
  useEffect(() => {
    const saved = localStorage.getItem('mathema.lang');
    if (saved === 'ko') {
      localStorage.setItem('mathema.lang', 'en');
      window.location.reload();
    } else if (!saved) {
      localStorage.setItem('mathema.lang', 'en');
    }
  }, []);
  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="learn" element={<LearnScreen />} />
            <Route path="learn/:code" element={<ConceptLessonScreen />} />
            <Route path="notes" element={<NotesListScreen />} />
            <Route path="mocks" element={<MocksScreen />} />
            <Route path="mocks/play/:resultId" element={<MockExamPlayScreen />} />
            <Route path="mocks/result/:resultId" element={<MockResultDetailScreen />} />
            <Route path="me" element={<MeScreen />} />
            <Route path="me/settings" element={<SettingsScreen />} />
            <Route path="report" element={<ReportScreen />} />
            <Route path="admin/ingest" element={<AdminIngestScreen />} />
            <Route path="admin/drafts" element={<AdminDraftListScreen />} />
            <Route path="admin/drafts/:id" element={<AdminDraftEditorScreen />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
