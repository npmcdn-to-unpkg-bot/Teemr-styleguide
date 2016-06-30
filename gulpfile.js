
// Imports

var gulp        = require('gulp');
var sass        = require('gulp-sass');
var styleguide  = require('sc5-styleguide');

// Path definitions

var sourcePath      = 'source';
var htmlWild        = sourcePath + '/**/*.html';
var styleSourcePath = sourcePath + '/sass';
var scssWild        = styleSourcePath + '/**/*.scss';
var scssRoot        = styleSourcePath + '/screen.scss';
var overviewPath    = sourcePath + '/overview.md';

var buildPath = 'build';
var styleBuildPath = buildPath + '/styles';
var styleguideAppRoot = '/styleguide';
var styleguideBuildPath = buildPath + styleguideAppRoot;

var tmpPath = 'tmp';
var styleguideTmpPath = tmpPath + '/styleguide';

// Building the application
//
// In reality the app would ofcourse be a lot more complex.
// Here the app simply consists of some HTML so we get to examine how
// the styles would be used in the application. A key relevation is
// that the markup needs to be written into the app. There is no magic
// that would bring the markup for a page into the app from the pages
// section in the styleguide.

gulp.task('html', function() {
    return gulp.src(htmlWild)
        .pipe(gulp.dest(buildPath));
});

gulp.task('scss', function() {
    return gulp.src(scssRoot)
        .pipe(sass())
        .pipe(gulp.dest(styleBuildPath));
});

gulp.task('images', function() {
  gulp.src([sourcePath + '/images/**'])
    // Do image sprites, optimizations etc.
    .pipe(gulp.dest(buildPath + '/images'))
    .pipe(gulp.dest(styleguideTmpPath + '/images'));
});

gulp.task('javascript', function() {
  gulp.src([sourcePath + '/javascript/**'])
    // Do image sprites, optimizations etc.
    .pipe(gulp.dest(buildPath + '/javascript'))
    .pipe(gulp.dest(styleguideTmpPath + '/javascript'));
});
// Building styleguide for static hosting to be displayed as a part of the application
//
// Here we build the styleguide so it can be included in a web folder within the app.
// The benefit for including the styleguide at /styleguide path of the app is that
// everyone can always find a master copy of the style guide. Another benefit is that
// this copy will be load balanced by the web server, so it can handle heavy loads.
// All interactive features are disabled to prevent users from tampering with the
// styles.

gulp.task('staticStyleguide:generate', function() {
  return gulp.src(scssWild)
    .pipe(styleguide.generate({
        title: 'Teemr',
        rootPath: styleguideBuildPath,
        appRoot: styleguideAppRoot,
        overviewPath: overviewPath,
        sideNav: true
      }))
    .pipe(gulp.dest(styleguideBuildPath));
});

gulp.task('staticStyleguide:applystyles', function() {
  return gulp.src(scssRoot)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(styleguideBuildPath));
});

gulp.task('staticStyleguide', ['staticStyleguide:generate', 'staticStyleguide:applystyles']);

// Running styleguide development server to view the styles while you are working on them
//
// This task runs the interactive style guide for use by developers. It runs a built-in server
// and contains all the interactive features and should be updated automatically whenever the
// styles are modified.

gulp.task('styleguide:generate', function() {
  return gulp.src(scssWild)
    .pipe(styleguide.generate({
        title: 'Teemr',
        server: true,
        rootPath: styleguideTmpPath,
        overviewPath: overviewPath,
        // sideNav: true,
        previousSection: true,
        nextSection: true,
        disableHtml5Mode: true,
        extraHead: [
            '<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>',
            '<link rel="stylesheet" type="text/css" href="/screen.css">',
            '<link rel="icon" type="text/xml" href="/images/sprites.svg">',
            '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>',
            '<script src="/javascript/jquery.plugins.js"></script>',
            '<script src="/javascript/jquery.modules.js"></script>',
            '<script src="/javascript/fonts.js"></script>'
        ],
        beforeBody: '<svg style="display: none;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><symbol id="icon-comment" viewBox="0 0 21 21"><title>Comment</title><defs><path id="a" d="M17.95 5.018v8.23c0 1.125-.894 2.02-2.018 2.02H10.36s0 .022-.023.022l-2.59 2.59c-.253.253-.688.07-.688-.297v-2.316H5.017C3.894 15.267 3 14.373 3 13.25V5.017C3 3.894 3.894 3 5.018 3h10.914c1.1 0 2.018.894 2.018 2.018z"/><mask id="b" width="14.95" height="14.998" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-loop" viewBox="0 0 21 21"><title>Loop</title><defs><path id="a" d="M18.518 16.254l-5.07-5.07c.517-.9.815-1.942.815-3.052 0-3.38-2.75-6.132-6.13-6.132C4.75 2 2 4.75 2 8.132c0 3.38 2.75 6.132 6.132 6.132 1.074 0 2.085-.278 2.962-.766l5.09 5.09c.32.322.744.483 1.167.483.424 0 .846-.16 1.168-.482.643-.644.643-1.69 0-2.334z"/><mask id="b" width="17" height="17.071" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-pen" viewBox="0 0 21 21"><title>Pen</title><defs><path id="a" d="M2.747 18.66c1.34-1.324 4.836-4.818 5.913-5.895.226-.227.358-.265.66-.15.53.17 1.134.055 1.55-.36.585-.586.585-1.53 0-2.116-.586-.587-1.53-.587-2.116 0-.434.415-.548 1.038-.34 1.567.094.264.076.397-.132.604-1.077 1.078-4.61 4.592-5.95 5.933-.303.302-.416.17-.265-.283C3.01 14.975 5.24 8.174 6.015 7.4c1.776-1.776 4.345-1.568 5.478-1.757.246-.038.472-.19.7-.378l3.57 3.552c-.208.226-.34.453-.378.7-.208 1.132 0 3.663-1.776 5.44-.813.755-7.576 3.022-10.58 3.985-.472.132-.586.038-.283-.283zM16.31 8.627l-.17-.17-3.59-3.59-.188-.188c-.283-.284-.245-.813.114-1.153l1.21-1.21c.32-.377.85-.414 1.15-.13l3.968 3.966c.283.283.246.812-.113 1.152l-1.208 1.228c-.36.34-.888.397-1.172.095z"/><mask id="b" width="16.991" height="17" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-pin" viewBox="0 0 21 21"><title>Pin</title><defs><path id="a" d="M11.767 2.16c-.316-.253-.78-.2-1.03.116l-.305.383c-.084.104-.157.24-.217.39-.06.15-.102.3-.128.446l-.008.05c-.01.057-.016.11-.02.165 0 .02 0 .038-.002.056-.002.068 0 .133.007.194l.032.265c.043.354.282.812.555 1.087l-2.046 2.57c-1.552-1.235-3.683-.054-4.714.667l-.04.027c-.023.016-.044.03-.065.047l-.057.04-.068.052-.04.03-.07.052c-.05.04-.07.056-.09.07l-.074.06-.055.046-.048.04c-.306.263-.3.682.017.933l3.528 2.808-3.69 5.132s-.378.448.106.924c.484.477.935-.095.935-.095l4.173-4.75 3.53 2.808c.315.25.725.164.912-.193l.026-.048c.01-.017.02-.036.03-.058l.04-.08c.016-.03.03-.064.048-.1.02-.038.036-.076.054-.115.02-.05.04-.09.06-.135l.063-.15c.484-1.164 1.176-3.49-.36-4.712l-.053-.042 2.045-2.57c.33.205.83.335 1.184.297l.267-.028c.044-.006.09-.015.138-.025.083-.02.13-.034.177-.05.056-.02.102-.04.147-.058l.045-.02.12-.06.046-.026c.036-.02.07-.04.105-.062.018-.01.035-.022.052-.034.154-.108.27-.21.356-.316l.304-.383c.25-.315.198-.78-.117-1.03L11.767 2.16z"/><mask id="b" width="14.845" height="17" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-rows" viewBox="0 0 21 21"><title>Rows</title><defs><path id="a" d="M2 4c0-1.105.89-2 2-2h13c1.105 0 2 .888 2 2 0 1.105-.89 2-2 2H4c-1.105 0-2-.888-2-2zm0 6c0-1.105.89-2 2-2h13c1.105 0 2 .888 2 2 0 1.105-.89 2-2 2H4c-1.105 0-2-.888-2-2zm0 6c0-1.105.89-2 2-2h13c1.105 0 2 .888 2 2 0 1.105-.89 2-2 2H4c-1.105 0-2-.888-2-2z"/><mask id="b" width="17" height="16" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-star" viewBox="0 0 21 21"><title>Star</title><defs><path id="a" d="M19.137 11.078c-.474.653-1.328 1.653-1.9 2.223l-5.7 5.703c-.57.57-1.503.57-2.073 0L3.762 13.3c-.57-.57-1.425-1.57-1.9-2.222 0 0-.862-1.188-.862-2.742C1 5.39 3.39 3 6.336 3c1.516 0 2.885.632 3.856 1.647l.108.113c.11.13.29.13.4 0l.108-.113C11.778 3.632 13.148 3 14.664 3 17.61 3 20 5.39 20 8.336c0 1.554-.863 2.742-.863 2.742z"/><mask id="b" width="19" height="16.431" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol><symbol id="icon-tiles" viewBox="0 0 21 21"><title>Tiles</title><defs><path id="a" d="M11.5 13.006c0-1.108.894-2.006 1.993-2.006h4.514c1.1 0 1.993.887 1.993 2.006v2.988C20 17.102 19.106 18 18.007 18h-4.514c-1.1 0-1.993-.887-1.993-2.006v-2.988zm-10.5 0C1 11.898 1.894 11 2.993 11h4.514c1.1 0 1.993.887 1.993 2.006v2.988C9.5 17.102 8.606 18 7.507 18H2.993C1.893 18 1 17.113 1 15.994v-2.988zm10.5-9C11.5 2.898 12.394 2 13.493 2h4.514C19.107 2 20 2.887 20 4.006v2.988C20 8.102 19.106 9 18.007 9h-4.514c-1.1 0-1.993-.887-1.993-2.006V4.006zm-10.5 0C1 2.898 1.894 2 2.993 2h4.514c1.1 0 1.993.887 1.993 2.006v2.988C9.5 8.102 8.606 9 7.507 9H2.993C1.893 9 1 8.113 1 6.994V4.006z"/><mask id="b" width="19" height="16" x="0" y="0" fill="#fff"><use xlink:href="#a"/></mask></defs><use fill="#FFF" fill-rule="evenodd" stroke="#B29C7D" stroke-width="2" mask="url(#b)" xlink:href="#a"/></symbol></svg><div></div>',
        afterBody: '<div></div>'
      }))
    .pipe(gulp.dest(styleguideTmpPath));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src(scssRoot)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(styleguideTmpPath));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Developer mode

gulp.task('dev', ['html', 'scss', 'images', 'javascript', 'styleguide'], function() {
    gulp.watch(htmlWild, ['html']);
    gulp.watch(scssWild, ['scss', 'styleguide']);
    console.log(
        '\nDeveloper mode!\n\nSC5 Styleguide available at http://localhost:3000/\n'
    );
});

// The basic build task

gulp.task('default', ['html', 'scss', 'images', 'staticStyleguide'], function() {
    console.log(
        '\nBuild complete!\n\nFresh build available in directory: ' +
        buildPath + '\n\nCheckout the build by commanding\n' +
        '(cd ' + buildPath + '; python -m SimpleHTTPServer)\n' +
        'and pointing yout browser at http://localhost:8000/\n' +
        'or http://localhost:8000/styleguide/ for the styleguide\n\n' +
        'Run gulp with "gulp dev" for developer mode and style guide!\n'
    );
});
