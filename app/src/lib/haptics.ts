/* Thin fire-and-forget wrappers around @capacitor/haptics.
 * The plugin's web fallback uses navigator.vibrate, which throws on
 * desktop browsers without vibration hardware — swallow everything so
 * haptics can never break the answer flow. */
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export function hapticSelect(): void {
  Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}

export function hapticResult(correct: boolean): void {
  Haptics.notification({
    type: correct ? NotificationType.Success : NotificationType.Error,
  }).catch(() => {});
}
