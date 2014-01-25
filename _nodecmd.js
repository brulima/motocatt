var fs = require('fs'), 
	data = fs.readdirSync('.'), 
	conc = {
		'index.html': []
	};
	conc['index.html'].push('_header.html');

	fs.readdirSync('posts/').forEach(function (session){
		conc['index.html'].push(session);
	})

	conc['index.html'].push('_footer.html');
	console.log(conc);

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			all:{
				files: concatFiles
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};