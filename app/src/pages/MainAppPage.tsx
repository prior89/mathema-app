/* MainAppPage — phone-frame shell for the 6-tab learning app.
 * Tabs (Home / Mastery / Study / Notes / Test / Me) map to the PDCA loop.
 * Each tab is its own route under /app/*. The mocks/play|result routes are
 * retained as internal session keys for Study's chapter test only — the Test
 * tab routes to /app/review (ReviewQueueScreen), not /app/mocks/*.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from '../components/main/HomeScreen';
import { LearnScreen } from '../components/main/LearnScreen';
import { ConceptLessonScreen } from '../components/main/ConceptLessonScreen';
import { NotesListScreen } from '../components/main/NotesListScreen';
import { StudyScreen } from '../components/main/StudyScreen';
import { TestScreen } from '../components/main/TestScreen';
import { ReviewQueueScreen } from '../components/main/ReviewQueueScreen';
import { SoloProblemScreen } from '../components/main/SoloProblemScreen';
import { MockExamPlayScreen } from '../components/main/MockExamPlayScreen';
import { MockResultDetailScreen } from '../components/main/MockResultDetailScreen';
import { StudyPracticeScreen } from '../components/main/StudyPracticeScreen';
import { KoreanStudyPracticeScreen } from '../components/main/KoreanStudyPracticeScreen';
import { MeScreen } from '../components/main/MeScreen';
import { ReportScreen } from '../components/main/ReportScreen';
import { SettingsScreen } from '../components/main/SettingsScreen';
import { AdminIngestScreen } from '../components/admin/AdminIngestScreen';
import { AdminDraftListScreen } from '../components/admin/AdminDraftListScreen';
import { AdminDraftEditorScreen } from '../components/admin/AdminDraftEditorScreen';
import { AdminKoreanStudyProblemNewScreen } from '../components/admin/AdminKoreanStudyProblemNewScreen';
import { AdminMasterySetScreen } from '../components/admin/AdminMasterySetScreen';
import { AdminReportsScreen } from '../components/admin/AdminReportsScreen';
import '../styles/onboarding.css';

// Paywall is code-split — only loads when the user navigates to /app/paywall.
const PaywallPage = lazy(() => import('./PaywallPage'));

export default function MainAppPage() {
  // 2026-05-27 fix: the unconditional `localStorage.lang = 'ko'` block was
  // vestigial from the standalone mathema-kr build. After the IN+KR merge it
  // forced *every* /app entry into Korean — even India users with
  // country='IN'. App.tsx <I18nCountrySync /> is now the single source of
  // truth (country='KR'→ko, otherwise→en), so this override is removed.
  return (
    <div className="mathema-app">
      <div className="mathema-viewport">
        <div className="mathema-phone">
          <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="learn" element={<LearnScreen />} />
            <Route path="learn/:code" element={<ConceptLessonScreen />} />
            <Route path="study" element={<StudyScreen />} />
            <Route path="test" element={<TestScreen />} />
            <Route path="review" element={<ReviewQueueScreen />} />
            <Route path="notes" element={<NotesListScreen />} />
            <Route path="practice/:problemId" element={<SoloProblemScreen />} />
            {/* Study tab single-step practice (5-choice MC + handwriting pad).
                Stateless — chapterCode in the URL drives the one-at-a-time
                fetch loop; no resultId / MockExamResult row is needed. */}
            <Route path="practice-set/:chapterCode" element={<StudyPracticeScreen />} />
            <Route path="ko-practice-set/:chapterCode" element={<KoreanStudyPracticeScreen />} />
            {/* Internal session routes — shared by Study + Test. Keep mocks/* path
                stable so existing localStorage session keys keep working. */}
            <Route path="mocks/play/:resultId" element={<MockExamPlayScreen />} />
            <Route path="mocks/result/:resultId" element={<MockResultDetailScreen />} />
            {/* Legacy tab redirects — old Solver / Mocks tabs were absorbed. */}
            <Route path="solve" element={<Navigate to="/app/notes" replace />} />
            <Route path="helper" element={<Navigate to="/app/notes" replace />} />
            <Route path="mocks" element={<Navigate to="/app/test" replace />} />
            <Route path="me" element={<MeScreen />} />
            <Route path="me/settings" element={<SettingsScreen />} />
            {/* Play Billing paywall — Android only at runtime; web build shows
                an "Android only" notice. Lazy + Suspense so the billing bundle
                doesn't ship with the main shell. */}
            <Route
              path="paywall"
              element={
                <Suspense fallback={<div style={{ padding: 32 }}>Loading...</div>}>
                  <PaywallPage />
                </Suspense>
              }
            />
            <Route path="report" element={<ReportScreen />} />
            <Route path="admin/ingest" element={<AdminIngestScreen />} />
            <Route path="admin/drafts" element={<AdminDraftListScreen />} />
            <Route path="admin/drafts/:id" element={<AdminDraftEditorScreen />} />
            <Route path="admin/ko-study-problems/new" element={<AdminKoreanStudyProblemNewScreen />} />
            <Route path="admin/mastery-set" element={<AdminMasterySetScreen />} />
            <Route path="admin/reports" element={<AdminReportsScreen />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
