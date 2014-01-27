$(window).scroll(function(e){
  parallax();
});
function parallax(){
  var scrolled = $(window).scrollTop();
  $('#teste').css('top',-(scrolled*(0.1))+'px');
}