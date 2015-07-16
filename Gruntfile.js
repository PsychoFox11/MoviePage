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
            all: ['*.js']
        },
        jscs: {
            src: '*.js',
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
            my_target: {
                files: {
                    'bundle.min.js': ['bundle.js']
                }
            }
        },
        exec: {
            deploy: 'cp -r  *.js *.html *.css views deploy'
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

grunt.registerTask('default', ['jshint', 'jscs', 'exec:deploy']);

grunt.registerTask('bundle', ['browserify', 'uglify']);
};