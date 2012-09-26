/**
 * Resources
 *
 * https://gist.github.com/2489540
 *
 */

/*jshint node: true */
/*global config:true, task:true, process:true*/
module.exports = function( grunt ) {

    // readOptionalJSON
    // by Ben Alman
    // https://gist.github.com/2876125
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
        "dist/dongle.unobstrusive.js",
        "dist/dongle.unobstrusive.min.js"
    ];

    grunt.initConfig({
        pkg: "<json:package.json>",
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
                {
                    "dist/images/": "src/images/*.*"
                }
            }
        },
        
        concat:
        {
            "components":
            {
                src: ["src/js/wcontextmenu.js",
                      "src/js/wgrid.js",
                      "src/js/winputfile.js",
                      "src/js/wselectbox.js",
                      "src/js/wsimplegrid.js",
                      "src/js/wswitchbutton.js"],
                dest: "dist/js/dongle.components.js"
            },
            "components.unobstrusive":
            {
                src: ["src/js/wbutton.unobstrusive.js",
                      "src/js/wmultiselect.unobstrusive.js",
                      "src/js/wslider.unobstrusive.js",
                      "src/js/wspinbutton.unobstrusive.js",
                      "src/js/wswitchbutton.unobstrusive.js"],
                dest: "dist/js/dongle.components.unobstrusive.js"
            },
            "validators":
            {
                src: ["src/js/wrequiredif.unobstrusive.js"],
                dest: "dist/js/dongle.validators.js"
            },
            "loader":
            {
                src: ["src/js/wloader.unobstrusive.js"],
                dest: "dist/js/dongle.loader.js"
            },
            "actionbox":
            {
                src: ["src/js/wactionbox.js"],
                dest: "dist/js/dongle.actionbox.js"
            },
            "components-css":
            {
                src: ["src/css/wcontextmenu.css",
                      "src/css/wgrid.css",
                      "src/css/winputfile.css",
                      "src/css/wmultiselect.css",
                      "src/css/wselectbox.css",
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

        min: {
            "dist/js/dongle.components.min.js": [ "<banner>", "dist/js/dongle.components.js" ],
            "dist/js/dongle.components.unobstrusive.min.js": [ "<banner>", "dist/js/dongle.components.unobstrusive.js" ],
            "dist/js/dongle.loader.min.js": [ "<banner>", "dist/js/dongle.loader.js" ],
            "dist/js/dongle.actionbox.min.js": [ "<banner>", "dist/js/dongle.actionbox.js" ],
            "dist/js/dongle.validators.min.js": [ "<banner>", "dist/js/dongle.validators.js" ]
        },
        
        cssmin:
        {
            "dist/css/dongle.components.min.css": ["<banner>", "dist/css/dongle.components.css"],
            "dist/css/dongle.loader.min.css": ["<banner>", "dist/css/dongle.loader.css"]
        },

        lint: {
            dist: "src/**/*.js",
            grunt: "grunt.js",
            tests: "test/unit/*.js"
        },
        
        jshint: {
            options: {
                //evil: true
            }
        },
        
        qunit: {
            files: ['test/index.html']
        },
        
        uglify: {}
    });
    
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib');
    grunt.registerTask( "default", "concat copy cssmin min lint qunit" );
    grunt.registerTask( "travis", "concat copy cssmin min lint qunit" );
};