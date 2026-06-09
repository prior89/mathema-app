import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../lib/api';
import {
  setPushDeepLinkHandler,
  syncPushRegistration,
} from '../native/push-bridge';

/**
 * Sync FCM registration when auth user changes (PR-28).
 * Respects User.pushRemindersEnabled from onboarding / settings PATCH.
 */
export function usePushSync() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setPushDeepLinkHandler((path) => navigate(path));
    return () => setPushDeepLinkHandler(null);
  }, [navigate]);

  useEffect(() => {
    if (!ready || !user || !tokens.get()) return;
    const enabled = user.pushRemindersEnabled !== false;
    syncPushRegistration({ enabled }).catch(() => {});
  }, [ready, user?.id, user?.pushRemindersEnabled]);
}