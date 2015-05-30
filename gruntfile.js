module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            files: ['test/*.html']
        },

        browserify: {
            build: {
                src: ["src/Cool.js"],
                dest: "dist/Cool.js",
                options: {
                    browserifyOptions: {
                        standalone: "Cool"
                    }
                }
            },

            tests: {
                src: ["test/_*.js"],
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
                    'dist/Cool.js',
                    'src/_UMD/_tail'
                ],
                dest: 'dist/Cool.js'
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-concat');



    grunt.registerTask("test", ["browserify:build", "concat:umd", "browserify:tests", "qunit"]);
};