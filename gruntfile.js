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
                        standalone: "Coool"
                    }
                }
            },

            tests: {
                src: ["test/_*.js", "test/traits/_*.js"],
                dest: "test/all.js"
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



    grunt.registerTask("test", ["browserify:build", "concat:umd", "browserify:tests", "qunit"]);
};