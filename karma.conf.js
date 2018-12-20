const webpack = require('./webpack.config');

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['mocha'],
    browsers: ['ChromeHeadless'],
    files: [
      { pattern: 'src/*.spec.js', watched: false },
      { pattern: 'src/**/*.spec.js', watched: false }
    ],

    preprocessors: {
      // add webpack as preprocessor
      'src/*.spec.js': [ 'webpack', 'sourcemap' ],
      'src/**/*.spec.js': [ 'webpack', 'sourcemap' ]
    },

    webpack,

    webpackMiddleware: {
      stats: 'errors-only'
    }
  });
};