module.exports = function(grunt) {

  // Plugins
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-merge-json');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-remfallback');
  grunt.loadNpmTasks('grunt-svg2png');
  grunt.loadNpmTasks('grunt-svgmin');

  // Tasks
  grunt.registerTask('default', ['svgmin', 'svg2png', 'sass', 'autoprefixer', 'remfallback', 'csso', 'concat:js', 'uglify:production', 'concat:json', 'watch']);
  grunt.registerTask('styles', ['sass', 'autoprefixer', 'remfallback', 'csso']);

  // The order matters!
  var jsFiles = [
    'assets/vendor/jquery/jquery.js',
    'assets/vendor/handlebars/handlebars.js',
    'assets/js/vendor/**/*.js',
    'assets/js/src/*.js',
    'assets/js/src/**/*.js'
  ];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %>*/\n',

    concat: {
      js: {
        options: {
          stripBanners: true,
          separator: ';'
        },
        src: jsFiles,
        dest: 'assets/js/<%= pkg.name %>.js'
      },

      json: {
        options: {
          separator: ',',
          banner: "[",
          footer: "]"
        },
        src: "assets/js/src/rooms/**/*.json",
        dest: "rooms.json"
      }
    },

    uglify: {
      production: {
        options: {
          report: 'min',
          banner: '<%= banner %>'
        },
        files: {
          'assets/js/<%= pkg.name %>.min.js': jsFiles
        }
      }
    },

    // Make our SVGs smaller
    svgmin: {
      options: { // Configuration that will be passed directly to SVGO
        plugins: [{
            removeViewBox: false
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/images/src', // Src matches are relative to this path.
          src: ['**/*.svg'], // Actual pattern(s) to match.
          dest: 'assets/images/', // Destination path prefix.
          ext: '.min.svg' // Dest filepaths will have this extension.
        }],
      },
    },

    // Make PNG copies of our SVGs
    svg2png: {
      all: {
        files: [
            { src: ['assets/images/src/**/*.svg'], dest: 'assets/images/' },
        ],
      },
    },

    // Compile SASS
    sass: {
      dist: {
        options: {
          compass: true,
        },
        files: {
          'assets/css/style.css': 'assets/scss/style.scss',
        },
      },
    },

    // Automatically add required CSS prefixes
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'ie 8'],
      },
      dist: {
        src: 'assets/css/style.css',
      },
    },

    // Add rem px fallbacks
    remfallback: {
      options: {
        log: true,
        replace: false,
      },
      dist: {
        files: {
          'assets/css/style.css': ['assets/css/style.css']
        },
      },
    },

    csso: {
      dist: {
        files: {
          'assets/css/style.min.css': ['assets/css/style.css'],
        },
      },
    },

    watch: {
      javascriptDev: {
        files: ['assets/js/**/*', '!assets/js/Wayfinder.js', '!assets/js/Wayfinder.min.js'],
        tasks: ['concat:js', 'uglify:production', 'concat:json'],
        options: {
          livereload: false
        }
      },

      css: {
        files: [
          'assets/scss/**/*'
        ],
        // Run Sass, autoprefixer, and CSSO
        tasks: ['sass', 'autoprefixer', 'remfallback', 'csso'],
        options: {
          interrupt: true,
          spawn: false,
        },
      },

      images: {
        files: [
          'assets/images/**/*'
        ],
        tasks: ['svgmin', 'svg2png', 'styles'],
        options: {
          interrupt: true,
          spawn: false,
        },
      },
    }
  });

};
