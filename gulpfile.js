var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

//define the default task and add the watch tassk to it
gulp.task('default', ['watch']);

//onfigure the jshint taks
gulp.task('jshint', function(){
    return gulp.src('starter/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch',function(){
    gulp.watch('starter/**/*.js', ['jshint']);
})