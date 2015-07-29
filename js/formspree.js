(function formspree() {
	var doc = document;
	var fileCounter = 0;
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
					var fileInput = document.createElement('input');

					fileInput.type = 'hidden';
					fileInput.name = 'Foto ' + (++fileCounter);
					fileInput.value = file.filename + ': ' + file.url;

					getElement('contact-form').appendChild(fileInput);
					getElement('filePick').innerHTML = '✓ Fotos Selecionadas';
				};
			},
			function(data){
				var fileCounter = 0;
				for (var i = 0; i < data.length; i++) {
					var file = data[i];
					var fileInput = document.createElement('input');
					fileInput.type = 'hidden';
					fileInput.name = 'Foto não recebida ' + (++fileCounter);
					fileInput.value = file.name + file.url;
					getElement('contact-form').appendChild(fileInput);
				};
			}
		);
	});
})();