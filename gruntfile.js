module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            files: ['test/*.html']
        },

        browserify: {
            build: {
                src: ["src/Coool.js"],
                dest: "dist/Coool.js",
                options: {
                    browserifyOptions: {
                        standalone: "Coool",
                        debug : true
                    }
                }
            },

            tests: {
                src: ["test/_*.js", "test/traits/_*.js", "test/types/_*.js"],
                dest: "test/all.js"
            }
        },

        exorcise: {
            maps: {
                files: {
                    'dist/Coool.js.map': ["dist/Coool.js"]
                }
            }
        },

        concat: {
            options: {
                separator: "\n\n"
            },
            umd: {
                src: [
                    'src/_UMD/_head',
                    'dist/Coool.js',
                    'src/_UMD/_tail'
                ],
                dest: 'dist/Coool.js'
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exorcise');



    grunt.registerTask("test", ["browserify:build", "concat:umd", "exorcise:maps", "browserify:tests", "qunit"]);
};