// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // Exporting the configuration
// export default defineConfig({
//   plugins: [react()],
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'prop-types': 'prop-types/prop-types.js'
    }
  }
})