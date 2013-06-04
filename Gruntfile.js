/*jshint node: true */
/*global config:true, task:true, process:true*/


module.exports = function( grunt ) {

    'use strict';

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-qunit-cov');

    function readOptionalJSON( filepath ) {
        var data = {};
        try {
            data = grunt.file.readJSON( filepath );
            grunt.verbose.write( "Reading " + filepath + "..." ).ok();
        } catch(e) {}
        return data;
    }

    var task = grunt.task;
    var file = grunt.file;
    var utils = grunt.utils;
    var log = grunt.log;
    var verbose = grunt.verbose;
    var fail = grunt.fail;
    var option = grunt.option;
    var config = grunt.config;
    var template = grunt.template;
    var distpaths = [
        "dist/dongle.js",
        "dist/dongle.min.js",
        "dist/dongle.unobtrusive.js",
        "dist/dongle.unobtrusive.min.js"
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dst: readOptionalJSON("dist/.destination.json"),
        meta: {
            banner: "/*! Dongle v<%= pkg.version %> <%= pkg.homepage %> | <%= pkg.licenses[0].url %> */"
        },
        compare_size: {
            files: distpaths
        },
        
        copy:
        {
            dist:
            {
                files:
                [
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images/'}
                ]
            }
        },
        
        concat:
        {
            "components":
            {
                src: ["src/js/components.core.js",
                      "src/js/wbutton.js",
                      "src/js/wcontextmenu.js",
                      "src/js/wgrid.js",
                      "src/js/winputfile.js",
                      "src/js/wselect.js",
                      "src/js/wselect.filter.js",
                      "src/js/wslider.js",
                      "src/js/wspinbutton.js",
                      "src/js/wsimplegrid.js",
                      "src/js/wswitchbutton.js"],
                dest: "dist/js/dongle.components.js"
            },
            "components.unobtrusive":
            {
                src: ["src/js/wbutton.unobtrusive.js",
                      "src/js/winputfile.unobtrusive.js",
                      "src/js/wslider.unobtrusive.js",
                      "src/js/wspinbutton.unobtrusive.js",
                      "src/js/wswitchbutton.unobtrusive.js"],
                dest: "dist/js/dongle.components.unobtrusive.js"
            },
            "validators":
            {
                src: ["src/js/wrequiredif.unobtrusive.js",
                      "src/js/wrequired.unobtrusive.js"],
                dest: "dist/js/dongle.validators.js"
            },
            "loader":
            {
                src: ["src/js/wloader.unobtrusive.js"],
                dest: "dist/js/dongle.loader.js"
            },
            "actionbox":
            {
                src: ["src/js/wactionbox.js"],
                dest: "dist/js/dongle.actionbox.js"
            },
            "components-css":
            {
                src: ["src/css/wbutton.css",
                      "src/css/wcontextmenu.css",
                      "src/css/wgrid.css",
                      "src/css/winputfile.css",
                      "src/css/wselect.css",
                      "src/css/wselect.filter.css",
                      "src/css/wslider.css",
                      "src/css/wsimplegrid.css",
                      "src/css/wspinbutton.css",
                      "src/css/wswitchbutton.css"],
                dest: "dist/css/dongle.components.css"
            },
            "loader-css":
            {
                src: ["src/css/wloader.css"],
                dest: "dist/css/dongle.loader.css"
            }             
        },  

        uglify: {
            options: {
                compress: true,
                banner: "/*! Dongle v<%= pkg.version %> <%= pkg.homepage %> | <%= pkg.licenses[0].url %> */"
            },
            target:
            {
                files:
                {
                    "dist/js/dongle.components.min.js": [ "dist/js/dongle.components.js" ],
                    "dist/js/dongle.components.unobtrusive.min.js": [ "dist/js/dongle.components.unobtrusive.js" ],
                    "dist/js/dongle.loader.min.js": [ "dist/js/dongle.loader.js" ],
                    "dist/js/dongle.actionbox.min.js": [ "dist/js/dongle.actionbox.js" ],
                    "dist/js/dongle.validators.min.js": [ "dist/js/dongle.validators.js" ]
                }
            }
        },
        
        cssmin:
        {
            combine:
            {
                files:
                {
                    "dist/css/dongle.components.min.css": ["<banner>", "dist/css/dongle.components.css"],
                    "dist/css/dongle.loader.min.css": ["<banner>", "dist/css/dongle.loader.css"]
                }
            }
        },
        

        jshint: {
            beforeconcat: [ 'js/*.js', 'test/js/*.js' ]
        },
                
        qunit: {
            files: ['test/*.html']
        },
        
        phantomjs: {
            timeout: 60000
        },
        
        "qunit-cov":
        {
            test:
            {
                minimum: 0.7,
                srcDir: 'dist',
                outDir: 'testResults',
                depDirs: ['3rd', 'test', 'src'],
                testFiles: ['test/*.html']
            }
        }
    });    
    grunt.registerTask( "default", ['concat', 'copy', 'cssmin', 'uglify', 'jshint', 'qunit'] );
    grunt.registerTask( "full", ['concat', 'copy', 'cssmin', 'uglify', 'jshint', 'qunit-cov'] );
    grunt.registerTask( "cov", 'qunit-cov' );
};