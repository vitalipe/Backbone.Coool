


function fetchBuildID() {
    var shell = require('shelljs');

    var result = shell.exec('git rev-parse HEAD', {silent: true});
    return result.code === 0 ? result.output.replace(/(\r\n|\n|\r|↵)/gm, "") : "UNKNOWN";
}


module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        buildID : fetchBuildID(),

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
                src: ["test/_*.js", "test/traits/_*.js", "test/types/_*.js"],
                dest: "test/all.js"
            }
        },

        concat: {
            options: {
                separator: "\n\n",
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> [<%= buildID %>] - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },

            umd: {
                src: [
                    'src/_UMD/_head',
                    'dist/Coool.js',
                    'src/_UMD/_tail'
                ],
                dest: 'dist/Coool.js'
            }
        },

        uglify: {
            prod: {
                options : {
                    preserveComments : 'some'
                },
                files: {
                    'dist/Coool.min.js': ['dist/Coool.js']
                }
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exorcise');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask("compile", ["browserify:build", "concat:umd"]);
    grunt.registerTask("test", ["compile", "browserify:tests", "qunit"]);
    grunt.registerTask("build", ["compile", "uglify:prod"]);
};