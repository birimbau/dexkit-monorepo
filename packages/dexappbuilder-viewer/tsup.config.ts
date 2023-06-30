import { defineConfig } from 'tsup'

export default defineConfig({
  replaceNodeEnv: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  esbuildOptions(options) {
    options.alias = {
      'react/jsx-runtime.js': 'react/jsx-runtime'
    }
  }



})