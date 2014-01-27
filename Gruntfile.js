var fs = require('fs'), 
	conc = {
		'index.html': ['_header.html'], 
		'motocatts.html': ['_header.html', '_headerMotocatts.html']
	}, 
	conc_post = {}, 
	conc_author = {}, 
	conc_motocatts = {
		'motocatts.html': ['_header.html', '_headerMotocatts.html']
	};

	fs.readdirSync('posts/').forEach(function (session){		// Para cada arquivo na pasta posts
		conc['index.html'].push('posts/' + session);		// Concatena na home

		var post = "post/"+session.replace(/[0-9]+\./, "");		// Replace nos números da data
		conc[post] = [];
		conc[post].push('_header.html', 'posts/' + session, '_footer.html');	//Cria o post

		var data = fs.readFileSync('posts/' + session, 'utf-8'), 					// Lê o arquivo
			info = data.match(/\<h2.*\<a href\=\".*author\/.*\"\>.*\<\/h2\>/)[0],	// Procura pelo nome do autor
			auth = "author/" + info.split('author/')[1].split('"')[0];				// Define a pasta do autor

		if(conc[auth]){													// Se o autor já existe
			conc[auth].push('posts/' + session);							// Adiciona o post ao arquivo
		}
		else {
			conc[auth] = ['_header.html', 'posts/' + session];			// Se não, cria e adiciona o post
		}

		if (data.indexOf('<!--MotocattArticle-->') >= 0) {	
			conc['motocatts.html'].push('posts/' + session);
		}
	});

	for (var auth in conc_author && conc_author.hasOwnProperty(auth)) {			// Adiciona o footer a cada página de autor
		conc_author[auth].push('_footer.html');
	}

	conc['index.html'].push('_footer.html');
	conc['motocatts.html'].push('_footer.html');

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
						path = "post/" + path.replace(/posts\/[0-9]+\./, "");
						data = data.split('<!--ContinueLendo-->')[0] + '<a href="' + path + '" class="keep-reading">Continue Lendo -></a>						</div>\n					</article>';
						return data;
					}
				},
				files: conc
			}/*,
			mtcats: {
				options: {
					process: function(data, path){
						path = "post/" + path.replace(/posts\/[0-9]+\./, "");
						data = data.split('<!--ContinueLendo-->')[0] + '<a href="' + path + '" class="keep-reading">Continue Lendo -></a>						</div>\n					</article>';
						return data;
					}
				},
				files: conc_motocatts
			},
			home: {
				options: {
					process: function(data, path){
						path = "post/" + path.replace(/posts\/[0-9]+\./, "");
						data = data.split('<!--ContinueLendo-->')[0] + '<a href="' + path + '" class="keep-reading">Continue Lendo -></a>						</div>\n					</article>';
						return data;
					}
				},
				files: conc_home
			}*/
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};