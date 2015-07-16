/* global module */
'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true,
                ignores: ['node_module/**/*', 'libraries/**/*']
            },
            all: ['source/*.js', 'mainserver.js', 'gruntfile.js']
        },
        jscs: {
            src: ['source/*.js', 'mainserver.js', 'gruntfile.js'],
            options: {
                config: '../.jscsrc'
            }
        },
        browserify: {
            dist: {
                files: {
                    'bundle.js': ['source/main.js']
                }
            }
        },
        uglify: {
            options: {
                mangle: 'sort',
                compress: true
            },
            myTarget: {
                files: {
                    'bundle.min.js': ['bundle.js']
                }
            }
        },
        exec: {
            deploy: 'rm -r public/* && cp -r  bundle*.js *.html *.css views images libraries public'
        },
        less: {
            development: {
                files: {
                    'main.css': 'main.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'jscs', 'less', 'browserify', 'uglify', 'exec:deploy']);
    grunt.registerTask('bundle', ['browserify', 'uglify']);
};