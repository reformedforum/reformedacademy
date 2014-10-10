module.exports = function (grunt) {
    grunt.initConfig({
        bowercopy: {
            options: {
                // Task-specific options go here
            },
            static: {
                options: {
                    destPrefix: 'reformedacademy/static/'
                },
                files: {
                    // Keys are destinations (prefixed with `options.destPrefix`)
                    // Values are sources (prefixed with `options.srcPrefix`); One source per destination
                    // e.g. 'bower_components/chai/lib/chai.js' will be copied to 'test/js/libs/chai.js'
                    'js/jquery.min.js': 'jquery/dist/jquery.min.js',
                    'js/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'css/bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'js/toastr.min.js': 'toastr/toastr.min.js',
                    'css/toastr.min.css': 'toastr/toastr.min.css',
                    'css/font-awesome.min.css': 'font-awesome/css/font-awesome.min.css',
                    'fonts/FontAwesome.otf': 'font-awesome/fonts/FontAwesome.otf',
                    'fonts/fontawesome-webfont.eot': 'font-awesome/fonts/fontawesome-webfont.eot',
                    'fonts/fontawesome-webfont.svg': 'font-awesome/fonts/fontawesome-webfont.svg',
                    'fonts/fontawesome-webfont.ttf': 'font-awesome/fonts/fontawesome-webfont.ttf',
                    'fonts/fontawesome-webfont.woff': 'font-awesome/fonts/fontawesome-webfont.woff'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.registerTask('default', []);
}
