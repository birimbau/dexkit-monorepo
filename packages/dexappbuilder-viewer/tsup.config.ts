import { defineConfig } from 'tsup';

/*const replaceNodeBuiltIns = () => {
  const replace = {
    'path': require('path-browserify')
  }
  const filter = RegExp(`^(${Object.keys(replace).join("|")})$`);
  return {
    name: "replaceNodeBuiltIns",
    //@ts-ignore
    setup(build) {
      //@ts-ignore
      build.onResolve({ filter }, arg => ({
        //@ts-ignore
        path: replace[arg.path],
      }));
    },
  };
}*/

export default defineConfig({
  replaceNodeEnv: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  esbuildOptions(options) {
    options.alias = {
      'react/jsx-runtime.js': 'react/jsx-runtime'
    }
  },
  // shims: true,
  // minify: true,
  // esbuildPlugins: [replaceNodeBuiltIns()],
  // plugins: [replaceNodeBuiltIns()],
  //platform: 'browser'
})