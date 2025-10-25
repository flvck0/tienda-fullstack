// frontend/karma.conf.cjs
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.spec.js', watched: true },
      { pattern: 'src/**/*.spec.jsx', watched: true },
    ],
    preprocessors: {
      'src/**/*.spec.jsx': ['esbuild'],
      'src/**/*.spec.js':  ['esbuild'],
      'src/**/*.jsx':      ['esbuild'],
      'src/**/*.js':       ['esbuild'],
    },
    esbuild: {
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'text',
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.webp': 'dataurl',
        '.svg': 'dataurl',
      },
      target: 'es2018',
      sourcemap: 'inline',
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: '.' }, { type: 'text-summary' }]
    },
    browsers: ['ChromeHeadless'],
    singleRun: false,
    client: { jasmine: { random: true }, clearContext: false }
  });
};
