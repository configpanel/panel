import { default as config } from '@configpanel/tailwind-config';
import typography from '@tailwindcss/typography';

export default {
  ...config,
  theme: {
    ...config.theme,
    extend: {
      ...config.theme?.extend,
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          }
        }
      }
    },
  },
  plugins: [
    typography,
  ],
};