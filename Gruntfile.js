var fs = require('fs'), 
	conc_home = {
		'index.html': []
	}, 
	conc_post = {};

	conc_home['index.html'].push('_header.html');

	fs.readdirSync('posts/').forEach(function (session){		// Para cada arquivo na pasta posts
		conc_home['index.html'].push('posts/' + session);		// Concatena na home
		var post = "post/"+session.replace(/[1-9]+\./, "");		// Replace nos números da data
		conc_post[post] = [];
		conc_post[post].push('_header.html', 'posts/' + session, '_footer.html');	//Cria o post
	})

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
			home: {
				options: {
					process: function(data, path){
						path = "post/" + path.replace(/.*[1-9]+\./, "");
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