$(window).scroll(function(e){
	var scrolled = $(window).scrollTop();
	$('#teste').css('top',-(scrolled*(0.1))+'px');
});