module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! madasecu <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: grunt.file.readJSON('themejs.json'),
        dest: '../../../public/vendor/ryadmin/js/script.min.js'
      }
    },
    cssmin: {
	  options: {
	    shorthandCompacting: false,
	    roundingPrecision: -1
	  },
	  target: {
	    files: {
	      '../../../public/vendor/ryadmin/css/style.min.css': grunt.file.readJSON('themecss.json')
	    }
	  }
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin']);

};
