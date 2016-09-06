module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'create-windows-installer': {
      x64: {
        appDirectory: '/Users/theospalart/Documents/electron-quick-start',
        outputDirectory: '/Users/theospalart/Documents/electron-quick-start',
        authors: 'My App Inc.',
        exe: 'AudioRecorder.exe'
      },
      ia32: {
        appDirectory: '/Users/theospalart/Documents/electron-quick-start',
        outputDirectory: '/Users/theospalart/Documents/electron-quick-start',
        authors: 'My App Inc.',
        exe: 'AudioRecorder.exe'
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/main-recorder.js',
        dest: 'build/main.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  grunt.loadNpmTasks('grunt-electron-installer');

};
