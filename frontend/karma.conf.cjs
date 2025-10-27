// frontend/karma.conf.cjs
function resolveIstanbulPlugin() {
  try {
    const m = require('esbuild-plugin-istanbul');
    if (m && typeof m.istanbul === 'function') return m.istanbul;
    if (m && typeof m.default === 'function') return m.default;
    if (typeof m === 'function') return m;
  } catch {}
  return null;
}
const istanbulFn = resolveIstanbulPlugin();

module.exports = function (config) {
  const useCoverage = Boolean(istanbulFn);

  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    // ⬇️ usa .js porque tus archivos están en .js
    files: [
      { pattern: 'src/test/setup.js', watched: false },
      { pattern: 'src/test/**/*.spec.js', watched: false },
    ],

    preprocessors: {
      'src/test/setup.js':         ['esbuild'],
      'src/test/**/*.spec.js':     ['esbuild'],
    },

    esbuild: {
      jsx: 'automatic',
      loader: {
        '.js':   'jsx',
        '.jsx':  'jsx',
        '.css':  'text',
        '.png':  'dataurl',
        '.jpg':  'dataurl',
        '.jpeg': 'dataurl',
        '.webp': 'dataurl',
        '.svg':  'dataurl',
      },
      target: 'es2018',
      sourcemap: 'inline',
      plugins: useCoverage ? [
        istanbulFn({
          include: ['src/**/*.{js,jsx}'],
          exclude: ['src/test/**', '**/*.spec.*'],
          produceSourceMap: true,
        }),
      ] : [],
      define: { 'process.env.NODE_ENV': '"test"' },
    },

    reporters: useCoverage ? ['progress', 'kjhtml', 'coverage'] : ['progress', 'kjhtml'],
    coverageReporter: useCoverage ? {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: '.' }, { type: 'text-summary' }],
    } : undefined,

    browsers: ['ChromeHeadless'],
    singleRun: true,
    client: { jasmine: { random: true }, clearContext: false },
  });

  if (!useCoverage) {
    console.warn('[karma] Aviso: no se pudo cargar "esbuild-plugin-istanbul". Tests SIN cobertura por ahora.');
  }
};
