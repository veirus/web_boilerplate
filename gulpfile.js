'use strict';
// Gulp 4

var gulp         = require('gulp'),
	$            = require('gulp-load-plugins')(),
	atImport     = require('postcss-import'),
	cssnext      = require('postcss-cssnext'),
	stylelint    = require('stylelint'),
	reporter     = require('postcss-reporter'),
	doiuse       = require('doiuse'),
	cssnano      = require('cssnano'),
	immutableCss = require('immutable-css'),
	lost         = require('lost'),
	flexbugs     = require('postcss-flexbugs-fixes'),
	fontmag      = require('postcss-font-magician'),
	lookup       = require('postcss-property-lookup'),
	// pugPHPFilter = require('pug-php-filter'),
	// php2pug      = require('gulp-jade-php'),
	sync         = require('browser-sync').create();

// Directories {{{
// https://habrahabr.ru/post/250569/
var _src = 'src/';
var _ass = 'assets/';
var _theme = 'themes/nefertity/';
var cssname= 'style.css';
var jsname=  'env.js';
var devFolder = 'build';

var isDist = $.util.env.type === 'dist';
var outputFolder = isDist ? 'dist' : devFolder;


var src = {
	pug:   _src + 'pug/**/!(_)*.pug',
	jade:  _src + 'pug/**/!(_)*.jade',
	scss:  _src + 'scss/**/!(_)*.scss',
	style: _src + 'style/!(_)*.sass',
	css:   _src + _ass + 'css/!(_)*.css',
	js:    _src + _ass + 'js/**/*.js',
	img:   _src + _ass + 'img/**/*.{JPG,jpg,jpeg,png,gif,svg}',
	fonts: _src + _ass + 'fonts/**/*.{svg,eot,ttf,otf,woff,woff2}',
	favicon:_src + _ass + 'favicon/**/*.{png,ico,svg}',
	theme: _src + _theme + '**/!(_)*.*'
};

var dest = {
	html:  outputFolder + '/' + _theme,
	js:    outputFolder + '/' + _theme + _ass + 'js/',
	css:   outputFolder + '/' + _theme + _ass + 'css/',
	img:   outputFolder + '/' + _theme + _ass + 'img/',
	fonts: outputFolder + '/' + _theme + _ass + 'fonts/',
	theme: outputFolder + '/' + _theme,
};

var watch = {
	html:  _src + 'pug/**/*.pug',
	style: _src + 'style/**/*.sass',
	scss:  _src + 'scss/**/*.scss',
	js:    _src + _ass + 'js/**/*.js',
	css:   _src + _ass + 'css/*.css',
	img:   _src + _ass + 'img/**/*.*',
	fonts: _src + _ass + 'fonts/**/*.*',
	theme: _src + _theme + '**/*.*'
};

var clean = {
	all:  outputFolder + _theme,
	dist: './dist',
	html: outputFolder + '/**/*.html',
	php:  outputFolder + _theme + '/**/*.php',
};
// Directories }}}

// BrowserSync {{{
var config = {
	server: {
		baseDir: devFolder,
	},
	notify: false,
	host: 'localhost',
	port: 9000,
	logPrefix: 'CW',
};

gulp.task('serve', function (done) {
	sync.init(config);
	done();
});

gulp.task('proxy', function(done) {
	sync.init({
		proxy: 'nefertity.dev',
		notify: false
	});
	done();
});

gulp.task('tunnel', function () {
	sync.init(function (){
		config.tunnel = true;
		return config;
	}());
});

function reload(done) {
	sync.reload();
	done();
}
// BrowserSync }}}
// utility - cleaning, copying files, etc. {{{ //

// Delete the build directory
gulp.task('clean-all', function() {
	return gulp.src(clean.all, {read: false})
		.pipe($.rimraf());
});

gulp.task('favicon', function() {
	return gulp.src(src.favicon)
		.pipe($.newer(dest.html))
		.pipe(gulp.dest(dest.html));
});

gulp.task('img', function() {
	return gulp.src(src.img)
		.pipe($.newer(dest.img))
		.pipe(gulp.dest(dest.img));
});

gulp.task('clean-img', function() {
	return gulp.src(src.img, {read: false})
		.pipe($.rimraf());
});

gulp.task('fonts', function() {
	return gulp.src(src.fonts)
		.pipe($.newer(dest.fonts))
		.pipe(gulp.dest(dest.fonts));
});

gulp.task('theme', function() {
	return gulp.src(src.theme)
		.pipe($.newer(dest.theme))
		.pipe(gulp.dest(dest.theme));
});

gulp.task('js', function() {
	return gulp.src(src.js)
		.pipe($.newer(dest.js))
		.pipe(gulp.dest(dest.js));
});

gulp.task('csso-dev', function () {
	return gulp.src(src.css)
		.pipe($.csso({
			restructure: false,
			sourceMap: true,
			debug: true
		}))
		.pipe(gulp.dest(dest.css));
});

// }}} utility - cleaning, copying files, etc. //
// CSS {{{ //
// Compile Sass - example task
// gulp.task('sass', function() {
// 	return gulp.src(src.scss)
// 		.pipe($.newer(dest.css))
// 		.pipe($.plumber())
// 		.pipe($.sourcemaps.init())
// 		.pipe($.sass({
// 			includePaths: ['node_modules/susy/sass']
// 		}).on('error', $.sass.logError))
// 		.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
// 		.pipe($.sourcemaps.write())
// 		.pipe(gulp.dest(dest.css))
// 		.pipe(sync.stream());
// });

gulp.task('postcss', function() {
	return gulp.src(src.css)
		.pipe($.newer(dest.css))
		.pipe($.plumber( function(error){
			console.log(error.message);
			this.emit('end');
		}))
		.pipe($.sourcemaps.init())
		.pipe($.postcss([
			atImport({ from: 'assets/css/'+cssname }),
			lookup(),
			// fontmag(),
			lost(),
			flexbugs(),
			doiuse({ browsers: ['ie >= 9', 'last 2 versions'], }),
			// immutableCss({ strict: true }),
			cssnext(),
			stylelint(),
			// cssnano({ autoprefixer: false }),
			reporter({ clearReportedMessages: true })
		]))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(dest.css))
		.pipe(sync.stream());
});

// Работа с CSS
gulp.task('css', function (done) {
	gulp.src(src.css, { since: gulp.lastRun('css') })
		.pipe($.newer(dest.css))
		.pipe(gulp.dest(dest.css))
		.pipe(sync.stream());
	// sync.reload();
	done();
});

// }}} CSS //
// PUG templates {{{ //
gulp.task('pug', function(){
	// return gulp.src(src.pug, { since: gulp.lastRun('pug') })
	return gulp.src(src.pug)
		.pipe($.newer(dest.html))
		.pipe($.plumber( function(error){
			console.log(error.message);
			this.emit('end');
		}))
		.pipe($.pug({
			pretty: isDist ? false : true,
			basedir: __dirname + '/src/pug/',
			debug: false,
			locals: {
				cssPath: _ass + 'css/',
				cssName: cssname,
				jsPath: _ass + 'js/',
				jsName: jsname,
			},
			// filters: {
			//	php: pugPHPFilter
			// }
		}))
		.pipe($.rename(function(path){
			if (path.basename=='index'){
				return;
			}
			path.dirname=path.basename.split('-').join('/');
			path.basename='index';
		}))
		.pipe(gulp.dest(dest.html))
		// .pipe(sync.stream({ once: true }));
		// .pipe(sync.stream());
		.pipe(sync.reload({ stream: true, once: true }));
});

gulp.task('p2p', function() {
	return gulp.src(src.jade)
		.pipe(php2pug({
			pretty: true,
			basedir: __dirname + '/src/pug/',
			locals: {
				page: {
					lang: 'ru',
				},
				meta: {
					keywords: 'keywords 1,2,3'
				},
				adress: {
					street: 'ololo'
				},
				prostor: {
					href: 'https://prostor-design.ru'
				},
				items : [ { title: 'Прием и консультация', txt: 'Прием врача акушера - гинеколога высшей категории \nШваревой Евгении Александровны', img: 1 }, { title: 'Диагностические услуги', txt: 'Мазок на онкоцитологию, мазок на степень чистоты, видеокольпоскопия...', }, { title: 'Манипуляции', txt: 'Введение и удаление спирали', }, { title: 'Малоинвазивные операции', txt: 'Вскрытие абсцесса бартолиниевой железы, иссечение кисты бартолиниевой железы', }, { title: 'Прием онколога, маммолога, торакального хирурга', txt: 'Юркова Дмитрия Николаевича, врача высшей категории', img: 5 }, { title: 'Оперативная хирургия', txt: 'Удаление фиброаденомы молочной, липомы, эпидермальной кисты (атеромы)', }, { title: 'Радиоволновая хирургия', txt: 'Удаление кожных образований при помощи радиоволновой хирургии', img: 7 }, { title: 'Малоинвазивные операции', txt: 'Вскрытие абсцесса бартолиниевой железы, иссечение кисты бартолиниевой железы', }, { title: 'Оперативная хирургия', txt: 'Удаление фиброаденомы молочной, липомы, эпидермальной кисты (атеромы)', }, ]
			}
		}))
		.pipe(gulp.dest('p2p'));
});
// }}} PUG templates //

// Build'em all!
gulp.task('build', gulp.series('clean-all', 'img', 'fonts', 'js', 'postcss', 'pug'));

gulp.task('watch', function (done) {
	gulp.watch( watch.js,    gulp.series('js', reload) );
	gulp.watch( watch.img,   gulp.series('img', reload) );
	gulp.watch( watch.fonts, gulp.series('fonts', reload) );
	gulp.watch( watch.css,   gulp.series('postcss') );
	gulp.watch( watch.html,  gulp.series('pug') );
	gulp.watch( watch.theme, gulp.series('theme', reload) );
	gulp.watch( watch.favicon, gulp.series('favicon') );
	done();
});

gulp.task('default', gulp.series('serve', 'watch'));
// vim:set noet sts=4 sw=4 ts=4 fdm=marker:
