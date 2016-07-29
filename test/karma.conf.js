module.exports = function(config){
  config.set({

    basePath: '../',

    files: [
      'public/**/*',
      'test/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
};
