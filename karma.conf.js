const webpack = require('./webpack.config');

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['mocha', 'coverage'],
    browsers: ['ChromeHeadless'],
    files: [
      { pattern: 'src/**/*.js', watched: false }
    ],

    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/**/!(*spec).js': ['webpack', 'sourcemap', 'coverage'],
    },

    webpack,

    webpackServer: { noInfo: true },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'html', dir: 'coverage/' },
      ]
    }
  });
};