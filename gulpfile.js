import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg

import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
const  sassfn        = gulpSass(dartSass)
import concat        from 'gulp-concat'
import uglifyim      from 'gulp-uglify-es'
const  uglify        = uglifyim.default
import rename        from 'gulp-rename'
import del           from 'del'
import cache         from 'gulp-cache'
import autoprefixer  from 'autoprefixer'
import ftp           from 'vinyl-ftp'



function js() {
	return src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/swiper/swiper-bundle.js',
		'app/libs/appear/appear.min.js',
		'app/js/common.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(dest('../themes/fahrtrainingmeier/js'))

	
}

function sass() {
	return src('app/sass/**/*.sass')
	.pipe(sassfn())
	.pipe(postCss([
		autoprefixer({ grid: 'autoplace' }),
		cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
	]))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(dest('../themes/fahrtrainingmeier/css/'))

	
}


async function removedist() { del('dist/**/*', { force: true }) }
async function clearcache() { cache.clearAll() }

function buildcopy() {
	return src([
		'app/*.html',
		'app/.htaccess',
		'{app/js,app/css}/*.min.*',
		'app/fonts/**/*'
	], { base: 'app/' })
	.pipe(dest('dist'))
}

function startwatch() {

	watch('app/sass/**/*.sass', { usePolling: true }, sass)
	watch(['libs/**/*.js', 'app/js/common.js'], { usePolling: true }, js)
}

export { js, sass, clearcache }
export let build = series(removedist, js, sass, buildcopy)

export default series(js, sass, parallel(startwatch))

