var gulp = require('gulp');
var sass = null;//require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var mainbowerfile = require("main-bower-files");
var inject = require('gulp-inject');
var del = require('del');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");



gulp.task("clean:html", function () {
    return del("+(test|dist)/html");
});

gulp.task("clean:js", function () {
    return del("+(test|dist)/js");
});

gulp.task("clean:css", function () {
    return del('+(test|dist)/css');
});
gulp.task("clean:fonts", function () {
    return del("+(test|dist)/fonts")
});

gulp.task('test:assets', function () {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./test/assets/'));
});
gulp.task('build:assets', ['test:assets'], function () {
    return gulp.src('./test/assets/**/*')
        .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('test:bower', ['test:bower:js', 'test:bower:css', 'test:bower:fonts']);

gulp.task('test:bower:js', ['clean:js'], function () {
    return gulp.src(mainbowerfile(['**/*.js']))
        .pipe(concat('app.js', { newLine: ';' }))
        .pipe(gulp.dest('./test/js/'));
});

gulp.task('test:bower:css', ['clean:css'], function () {
    return gulp.src(mainbowerfile(['**/*.css']))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./test/css/'));
});

gulp.task('test:bower:fonts', ['clean:fonts'], function () {
    return gulp.src(mainbowerfile(['**/*.{eot,svg,ttf,woff,woff2,otf}']))
        .pipe(gulp.dest('./test/fonts/'));
});

gulp.task('test:html', ['clean:html'], function () {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./test'));
});
gulp.task('build:html', ['test:index'], function () {
    return gulp.src(['./test/**/*.html', '!./test/footer.html', '!./test/header.html', '!./test/message.html', '!./test/docs/docs-nav.html', '!./test/docs/tmpl.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('test:js', ['test:bower:js'], function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./test/js'));
});
gulp.task('build:js', ['test:js'], function () {
    return gulp.src('./test/js/**/*.js')
        .pipe(concat('app.js', { newLine: ';' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('test:css', ['test:bower:css'], function () {
    return gulp.src('./src/css/**/*.css')
        .pipe(gulp.dest('./test/css'));
});
gulp.task('build:css', ['test:css'], function () {
    return gulp.src('./test/css/**/*.css')
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('test:fonts', ['test:bower:fonts'], function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./test/fonts'));
});
gulp.task('build:fonts', ['test:fonts'], function () {
    return gulp.src('./test/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('test:index', ['test:html', 'test:js', 'test:css'], function () {
    var target = gulp.src(['./test/**/*.html', '!./test/footer.html', '!./test/header.html', '!./test/message.html', '!./test/docs/docs-nav.html', '!./test/docs/tmpl.html']);
    var sources = gulp.src(['./test/js/**/*.js', './test/css/**/*.css'], { read: false });

    return target
        .pipe(inject(gulp.src('./test/header.html'), {
            starttag: '<!-- inject:header:{{ext}} -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(gulp.src('./test/footer.html'), {
            starttag: '<!-- inject:footer:{{ext}} -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(gulp.src('./test/message.html'), {
            starttag: '<!-- inject:message:{{ext}} -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(gulp.src('./test/docs/docs-nav.html'), {
            starttag: '<!-- inject:docs-nav:{{ext}} -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./test'));
});
gulp.task('build:index', ['build:html', 'build:js', 'build:css'], function () {
    var target = gulp.src(['./dist/**/*.html']);
    var sources = gulp.src(['./dist/js/**/*.js', './dist/css/**/*.css'], { read: false });
    return target
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test:sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./test/css'));
});

gulp.task('test:sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('test', ['test:index', 'test:fonts', 'test:assets'], function () {
    browserSync.init({
        server: "./test",
        notify: false,
        port: 9000,
    });
    //gulp.start('test:sass:watch');
    gulp.watch(['./src/**/*.html', './src/css/**/*.css', './src/js/**/*.js'], ['test:index']);
    gulp.watch(['./test/**/*.html', './test/css/**/*.css', './test/js/**/*.js']).on('change', browserSync.reload);
});

gulp.task('build', ['build:index', 'build:fonts', 'build:assets'], function () {
    browserSync.init({
        server: "./dist",
        notify: false,
        port: 9000,
    });
})

gulp.task('default', ['test']);