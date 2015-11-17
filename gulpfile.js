var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var del = require('del');


gulp.task('default', ['build-scripts', 'build-styles', 'copy']);


gulp.task('copy', function(){
	gulp.src('src/scripts/lib/require.js')
		.pipe(gulp.dest('lib/scripts/'));
	gulp.src('src/scripts/lib/less.min.js')
		.pipe(gulp.dest('lib/scripts/'));
	gulp.src('src/app.html')
		.pipe(gulp.dest('lib'));
	gulp.src('favicon.ico')
		.pipe(gulp.dest('lib'));
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('lib/fonts'));
	gulp.src('src/images/**/*')
		.pipe(gulp.dest('lib/images'));
})

gulp.task('watch', ['default'], function(){
	gulp.watch('src/scripts/**/*', ['build-js']);
	gulp.watch('src/styles/**/*', ['build-styles']);
});

gulp.task('build-styles', function(){
	gulp.src('src/styles/**/*')
		.pipe(gulp.dest('lib/styles'));
});

gulp.task('build-scripts', function(){
	return gulp.src('src/scripts/app.js')
		.pipe(requirejsOptimize({
			baseUrl: ".",
			name: 'src/scripts/app',
			paths: {
				app: 'src/scripts',
				jquery: 'src/scripts/lib/jquery',
				underscore: 'src/scripts/lib/underscore',
				backbone: 'src/scripts/lib/backbone',
				'backbone-relational': 'src/scripts/lib/backbone-relational',
				text: 'src/scripts/lib/text'
			},
			shim: {
				underscore: {
					exports: '_'
				},
				backbone: {
					deps: ["underscore", "jquery"],
					exports: "Backbone"
				},
				'backbone-relational': {
					deps: ["backbone"]
				}
			}
		}))
		.pipe(gulp.dest('lib/scripts'));
})

gulp.task('clean', function(){
	del(['lib/**/*']).then(function (paths) {
		console.log('Deleted files/folders:\n', paths.join('\n'));
	});
})