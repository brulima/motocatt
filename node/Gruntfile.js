// coments goes here blablabla
var fs = require('fs');
var templatePostFolder = '../template-post/';
var postFolder = '../post/';
var header = '../_header.html';
var footer = '../_footer.html';
var about = '../about-content.html';
var headerMotocatts = '../_headerMotocatts.html';
var indexFile = '../index.html';
var aboutFile = '../about.html';
var motocFile = '../motocatts.html';

var conc_home = {
	'../index.html': [header]
};
var conc_about = {
	'../about.html': [header, about, footer]
};
var conc_post = {};
var conc_author = {};
var conc_motocatts = {
	'../motocatts.html': [header, headerMotocatts]
};

var buildConcatObject = function () {
	fs.readdirSync(templatePostFolder).forEach(function (session) {
		// Concat home
		conc_home[indexFile].push(templatePostFolder + session);

		// Concat post page
		var postPath = postFolder + session.replace(/[0-9]+\./, "");
		var templatePostPath = templatePostFolder + session;

		conc_post[postPath] = [];
		conc_post[postPath].push(header, templatePostPath, footer);

		// Concat Author
		var data = fs.readFileSync(templatePostPath, 'utf-8');
		var info = data.match(/\<h2.*\<a href\=\".*author\/.*\"\>.*\<\/h2\>/)[0];
		var auth = "../author/" + info.split('author/')[1].split('"')[0];

		if (conc_author[auth]){
			conc_author[auth].push(templatePostPath);
		}
		else {
			conc_author[auth] = [header, templatePostPath];
		}

		// Concat motocatt page
		if (data.indexOf('<!--MotocattArticle-->') >= 0) {
			conc_motocatts['../motocatts.html'].push(templatePostPath);
		}
	});

	for (var auth in conc_author && conc_author.hasOwnProperty(auth)) {
		conc_author[auth].push(footer);
	}

	conc_home['../index.html'].push(footer);
	conc_motocatts['../motocatts.html'].push(footer);
};

var process = function(data, path){
	path = postFolder + path.replace(/template-post\/[0-9]+\./, "");
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

		fs.writeFileSync(file, data, 'utf-8');
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
			post: {
				files: conc_post
			},
			auth: {
				options: {
					process: process
				},
				files: conc_author
			},
			mtcats: {
				options: {
					process: process
				},
				files: conc_motocatts
			},
			home: {
				options: {
					process: process
				},
				files: conc_home
			},
			about: {
				options: {
					process: process
				},
				files: conc_about
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('setTitle', setTitle);
	grunt.registerTask('buildConcatObject', buildConcatObject);

	grunt.registerTask('default', ['buildConcatObject', 'concat', 'setTitle:post', 'setTitle:author']);

};
