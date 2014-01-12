/*global module*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: ['index.js', 'lib/**/*.js', 'test/**/*.js', 'config/**/*.js'],
      tasks: ['default', 'timestamp']
    },
    jshint: {
      files: ['gruntFile.js', 'index.js', 'lib/**/*.js', 'test/**/*.js', 'config/**/*.js'],
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: {
          describe: false,
          it: false,
          before: false,
          after: false
        }
      }
    },
    jsbeautifier: {
      'default': {
        src: '<%= jshint.files %>',
        options: {
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      },
      release: {
        src: '<%= jsbeautifier.default.src %>',
        options: {
          mode: 'VERIFY_ONLY',
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    mochacov: {
      travis: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      cov: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html'
        }
      },
      options: {
        files: ['test/**/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint',
    'jsbeautifier:default',
    'mochaTest'
  ]);
  grunt.registerTask('cov', ['mochacov:cov']);
  grunt.registerTask('release', ['jshint',
    'jsbeautifier:release',
    'mochaTest',
    'mochacov:travis'
  ]);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });
};
