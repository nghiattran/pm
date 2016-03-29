var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var changed = require('gulp-changed');

var tsProject = ts.createProject({
	declaration: true,
	noExternalResolve: true
});
 
gulp.task('scripts', function() {
	console.log("Compiling ts")
	var tsResult = gulp.src(['ts/*.ts', 'ts/**/*.ts'])
		.pipe(changed('tmp', {extension: '.js'}))
		.pipe(ts(tsProject));
 
 	return tsResult.js.pipe(gulp.dest('tmp'))
	// return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
	// 	// tsResult.dts.pipe(gulp.dest('tmp')),
	// 	tsResult.js.pipe(gulp.dest('tmp'))
	// ]);
})

gulp.task('watch', ['scripts'], function() {
    gulp.watch(['ts/*.ts' , 'ts/**/*.ts'], ['scripts']);
});