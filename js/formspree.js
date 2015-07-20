(function formspree() {
	var doc = document;
	var getElement = function (id) {
		return doc.getElementById(id);
	};

	getElement("name-contact-form").addEventListener("change", function() {
		getElement("subject-contact-form").setAttribute("value", "[Contato Portfólio] " + this.value);
	});

	getElement('filePick').addEventListener('click', function() {
		filepicker.setKey("AXGjFPz0Q4yxQ5WGd9loJz");
		filepicker.pickMultiple(
			{
				mimetype: 'image/*',
			    container: 'modal',
			    services: ['COMPUTER', 'FACEBOOK', 'GOOGLE_DRIVE', 'INSTAGRAM', 'URL', 'WEBCAM', ]
			},
			function(data){
				for (var i = 0; i < data.length; i++) {
					var file = data[i];
					console.log(file);
					getElement('pics-contact-form').value += '|' + file.filename + '| ';
				};
			},
			function(data){
				console.log(JSON.stringify(error));
			}
		);
	});
})();