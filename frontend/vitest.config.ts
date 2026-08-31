import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    browser: {
      enabled: false,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
      headless: false,
      screenshotFailures: true,
    },
    // Kein "include": Die Angular CLI übernimmt das Auffinden der Spec-Dateien
    // und warnt, wenn die Option hier gesetzt ist.
  },
});
