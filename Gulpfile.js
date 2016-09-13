'use strict'

const gulp = require('gulp'),
      connect = require('gulp-connect'),
      markdown = require('gulp-markdown-it')

function applyTemplate(templateFile) {
    const fs = require('fs')
    const tap = require('gulp-tap')

    return tap(function(vinyl) {
        if (!vinyl.contents) return     // Ignore directories
        const template = fs.readFileSync(templateFile)
                           .toString().split('@@CONTENT@@')
        const begin = template[0], end = template[1]
        vinyl.contents = Buffer.concat([
            new Buffer(begin), vinyl.contents, new Buffer(end)])
    })
}

gulp.task('build', function() {
    const mdOpts = {
        plugins: [ 'markdown-it-katex' ]
    }
    return gulp
        .src('src/**/*')
        .pipe(markdown(mdOpts))
        .pipe(connect.reload())
        .pipe(applyTemplate('template.html'))
        .pipe(gulp.dest('.build/www/'))
})

gulp.task('serve', ['build'], function() {
    const watch = require('gulp-watch')

    connect.server({
        root: '.build/www',
        livereload: true
        })
    watch(['./template.html*', 'src/**/*'], function() { gulp.start('build') } )
})
