import { useEffect, useState } from 'react';

/**
 * Hook for Telegram Mini App integration.
 *
 * - Expands the app to full screen automatically.
 * - Signals tg.ready() so Telegram hides the loading indicator.
 * - Disables vertical swipes to prevent accidental closure.
 * - Exposes the Telegram user object and color scheme.
 * - Sets CSS custom properties from Telegram safe-area insets when available.
 */
export function useTelegram() {
  const tg = window.Telegram?.WebApp ?? null;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!tg) {
      setIsReady(true);
      return;
    }

    // Expand to full screen
    tg.expand();

    // Prevent swipe-down-to-close on scroll
    tg.disableVerticalSwipes?.();

    // Apply Telegram-provided safe-area insets as CSS variables (newer SDK)
    const applyInsets = () => {
      const root = document.documentElement;
      if (tg.safeAreaInsets) {
        root.style.setProperty('--safe-top', `${tg.safeAreaInsets.top}px`);
        root.style.setProperty('--safe-bottom', `${tg.safeAreaInsets.bottom}px`);
      }
      if (tg.contentSafeAreaInsets) {
        root.style.setProperty('--content-safe-top', `${tg.contentSafeAreaInsets.top}px`);
        root.style.setProperty('--content-safe-bottom', `${tg.contentSafeAreaInsets.bottom}px`);
      }
    };

    applyInsets();

    // Keep insets up-to-date if orientation changes
    tg.onEvent?.('safeAreaChanged', applyInsets);
    tg.onEvent?.('contentSafeAreaChanged', applyInsets);

    // Tell Telegram the app has finished loading
    tg.ready();
    setIsReady(true);

    return () => {
      tg.offEvent?.('safeAreaChanged', applyInsets);
      tg.offEvent?.('contentSafeAreaChanged', applyInsets);
    };
  }, [tg]);

  return {
    /** Raw Telegram.WebApp object, or null outside Telegram */
    tg,
    /** true when running inside Telegram */
    isInTelegram: !!tg,
    /** true after tg.ready() has been called */
    isReady,
    /** Telegram user from initDataUnsafe, or null */
    user: tg?.initDataUnsafe?.user ?? null,
    /** 'dark' | 'light' — Telegram client theme */
    colorScheme: tg?.colorScheme ?? 'dark',
  };
}
