var fs = require('fs'), 
	conc_home = {
		'index.html': []
	}, 
	conc_post = {}, 
	conc_author = {};

	conc_home['index.html'].push('_header.html');

	fs.readdirSync('posts/').forEach(function (session){		// Para cada arquivo na pasta posts
		conc_home['index.html'].push('posts/' + session);		// Concatena na home

		var post = "post/"+session.replace(/[0-9]+\./, "");		// Replace nos números da data
		conc_post[post] = [];
		conc_post[post].push('_header.html', 'posts/' + session, '_footer.html');	//Cria o post

		var data = fs.readFileSync('posts/' + session).toString(), 
			info = data.match(/\<h2.*\<a href\=\"author\/.*\"\>.*\<\/h2\>/)[0],
			auth = "author/" + info.split('href="author/')[1].split('"')[0];

		if(conc_author[auth]){
			conc_author[auth].push('posts/' + session);
		}
		else {
			conc_author[auth] = ['_header.html', 'posts/' + session];
		}
	});

	for (var auth in conc_author && conc_author.hasOwnProperty(auth)) {
		conc_author[auth].push('_footer.html');
	}

	conc_home['index.html'].push('_footer.html');

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n				<div class="sep"></div>\n'
			},
			post: {
				files: conc_post
			},
			auth: {
				options: {
					process: function(data, path){
						path = "post/" + path.replace(/[0-9]+\./, "");
						data = data.replace(/\<div class\=\"display\-block\"\>/, '<div class="display-none">');
						data = data.replace(/\<\!\-\-ContinueLendo\-\-\>/, '<a href="' + path + '" class="keep-reading">Continue Lendo</a>');
						return data;
					}
				},
				files: conc_author
			},
			home: {
				options: {
					process: function(data, path){
						path = "post/" + path.replace(/[0-9]+\./, "");
						data = data.replace(/\<div class\=\"display\-block\"\>/, '<div class="display-none">');
						data = data.replace(/\<\!\-\-ContinueLendo\-\-\>/, '<a href="' + path + '" class="keep-reading">Continue Lendo</a>');
						return data;
					}
				},
				files: conc_home
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};