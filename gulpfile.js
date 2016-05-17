var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');

gulp.task('jade', () => {
    return gulp.src([
        'src/jade/*.jade',
        '!src/jade/_*jade'
    ])
        .pipe(plumber())
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())
});

gulp.task('stylus', () => {
    return gulp.src('src/stylus/style.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
});

gulp.task('default', ['jade', 'stylus'], () => {

    connect.server({
        root: 'dist',
        livereload: true
    });

    gulp.watch(['src/jade', 'src/jade/**/*.jade'], ['jade']);
    gulp.watch(['src/stylus', 'src/stylus/**/*.styl'], ['stylus']);

})
