// coments goes here blablabla
var fs = require('fs');
var templatePostFolder = '../template-post/';
var postFolder = '../post/';
var header = '../_header.html';
var fbComents = '../_fb_coments.html';
var footer = '../_footer.html';
var about = '../about-content.html';
var contact = '../contact-content.html';
var confirmation = '../confirmation-content.html';
var headerMotocatts = '../_headerMotocatts.html';
var indexFile = '../index.html';
var aboutFile = '../about.html';
var motocFile = '../motocatts.html';
var scopedTitle = [{
	file: 'about',
	title: 'Sobre'
}, {
	file: 'contact',
	title: 'Conte sua história'
}, {
	file: 'confirmation',
	title: 'Obrigada!'
}];

var conc_feed = {
	'../index.html': [header],
	'../motocatts.html': [header, headerMotocatts]
};
var conc_scoped = {
	'../about.html': [header, about, footer],
	'../contact.html': [header, contact, footer],
	'../confirmation.html': [header, confirmation, footer]
};

var buildConcatObject = function () {
	fs.readdirSync(templatePostFolder).forEach(function (session) {
		// Concat home
		conc_feed[indexFile].push(templatePostFolder + session);

		// Concat post page
		var postPath = postFolder + session.replace(/[0-9]+\./, "");
		var templatePostPath = templatePostFolder + session;

		conc_scoped[postPath] = [];
		conc_scoped[postPath].push(header, templatePostPath, fbComents, footer);

		// Concat Author
		var data = fs.readFileSync(templatePostPath, 'utf-8');
		var info = data.match(/\<h2.*\<a href\=\".*author\/.*\"\>.*\<\/h2\>/)[0];
		var auth = "../author/" + info.split('author/')[1].split('"')[0];

		if (conc_feed[auth]){
			conc_feed[auth].push(templatePostPath);
		}
		else {
			conc_feed[auth] = [header, templatePostPath];
		}

		// Concat motocatt page
		if (data.indexOf('<!--MotocattArticle-->') >= 0) {
			conc_feed[motocFile].push(templatePostPath);
		}
	});

	for (var file in conc_feed && conc_feed.hasOwnProperty(file)) {
		conc_feed[file].push(footer);
	}
};

var process = function(data, path){
	path = 'post/' + path.replace(/\.\.\/template-post\/[0-9]+\./, "");
	if (data.indexOf('<!--ContinueLendo-->') >= 0){
		data = data.split('<!--ContinueLendo-->')[0] + '<a href="' + path + '" class="keep-reading">Continue Lendo</a></div>\n					</article>';
	}
	data = data.replace("<h1>", '<h1><a href="'+ path + '">');
	data = data.replace("</h1>", '</a></h1>');
	return data;
};


var setTitle = function(dir) {
	dir = '../' + dir + '/';
	fs.readdirSync(dir).forEach(function (file){
		var author = getTitleName(file);
		var title = 'motocatt | ' + author;
		var file = dir + file;
		var data = fs.readFileSync(file, 'utf-8');

		data = data.replace(/\<title\>.*\<\/title\>/, '<title>' + title + '</title>');
		console.log('Title "' + title + '"');
		fs.writeFileSync(file, data, 'utf-8');
	});
};

var setScopedTitle = function () {
	for (var i = 0; i < scopedTitle.length; i++) {
		var scoped = scopedTitle[i];
		var file = '../' + scoped.file + '.html';
		var title = 'motocatt | ' + scoped.title;
		var data = fs.readFileSync(file, 'utf-8');

		data = data.replace(/\<title\>.*\<\/title\>/, '<title>' + title + '</title>');
		console.log('Title "' + title + '"');
		fs.writeFileSync(file, data, 'utf-8');
	};

};

var setFacebookPage = function(dir) {
	dir = '../' + dir + '/';
	fs.readdirSync(dir).forEach(function (file){
		var filePath = dir + file;
		var data = fs.readFileSync(filePath, 'utf-8');
		var href = 'https://brulima.github.io/motocatt/post/' + file;

		data = data.replace('<div class="fb-comments" data-href="https://brulima.github.io/motocatt/post/" data-width="100%" data-numposts="3"></div>',
			'<div class="fb-comments" data-href="' + href + '" data-width="100%" data-numposts="3"></div>');

		console.log('Href "' + href + '"');
		fs.writeFileSync(filePath, data, 'utf-8');
	});
};

var getTitleName = function (file) {
	file = file.replace('.html', '');
	file = file.split('-');

	for (var i = 0; i < file.length; i++) {
		file[i] = file[i][0].toUpperCase() + file[i].substring(1);
	};

	return file.join(' ');
};


module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			feed: {
				options: {
					process: process
				},
				files: conc_feed
			},
			scoped: {
				files: conc_scoped
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('setTitle', setTitle);
	grunt.registerTask('buildConcatObject', buildConcatObject);
	grunt.registerTask('setFacebookPage', setFacebookPage);
	grunt.registerTask('setScopedTitle', setScopedTitle);

	grunt.registerTask('default', ['buildConcatObject', 'concat', 'setTitle:post', 'setTitle:author', 'setFacebookPage:post', 'setScopedTitle']);

};
