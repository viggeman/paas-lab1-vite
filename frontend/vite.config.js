import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000',
//     },
//   },
// });

// vite.config.js

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    // Dev-specific config
    return {
      plugins: [react()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
          },
        },
      },
    };
  } else {
    // Prod-specific config
    return {
      plugins: [react()],
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
    };
  }
});
