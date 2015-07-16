// coments goes here blablabla
var fs = require('fs'),
	conc_home = {
		'index.html': ['_header.html'],
	},
	conc_post = {},
	conc_author = {},
	conc_motocatts = {
		'motocatts.html': ['_header.html', '_headerMotocatts.html']
	};

	fs.readdirSync('posts/').forEach(function (session){		// Para cada arquivo na pasta posts
		conc_home['index.html'].push('posts/' + session);		// Concatena na home

		var post = "post/"+session.replace(/[0-9]+\./, "");		// Replace nos números da data
		conc_post[post] = [];
		conc_post[post].push('_header.html', 'posts/' + session, '_footer.html');	//Cria o post

		var data = fs.readFileSync('posts/' + session, 'utf-8'), 					// Lê o arquivo
			info = data.match(/\<h2.*\<a href\=\".*author\/.*\"\>.*\<\/h2\>/)[0],	// Procura pelo nome do autor
			auth = "author/" + info.split('author/')[1].split('"')[0];				// Define a pasta do autor

		if(conc_author[auth]){													// Se o autor já existe
			conc_author[auth].push('posts/' + session);							// Adiciona o post ao arquivo
		}
		else {
			conc_author[auth] = ['_header.html', 'posts/' + session];			// Se não, cria e adiciona o post
		}

		if (data.indexOf('<!--MotocattArticle-->') >= 0) {
			conc_motocatts['motocatts.html'].push('posts/' + session);
		}
	});

	for (var auth in conc_author && conc_author.hasOwnProperty(auth)) {			// Adiciona o footer a cada página de autor
		conc_author[auth].push('_footer.html');
	}

	conc_home['index.html'].push('_footer.html');
	conc_motocatts['motocatts.html'].push('_footer.html');

	var process = function(data, path){
		path = "post/" + path.replace(/posts\/[0-9]+\./, "");
		if (data.indexOf('<!--ContinueLendo-->') >= 0){
			data = data.split('<!--ContinueLendo-->')[0] + '<a href="' + path + '" class="keep-reading">Continue Lendo</a></div>\n					</article>';
		}
		data = data.replace("<h1>", '<h1><a href="'+ path + '">');
		data = data.replace("</h1>", '</a></h1>');
		return data;
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
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};
