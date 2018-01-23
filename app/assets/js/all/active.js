// active

$(function(){
  var url = window.location.pathname;
  url = url.replace('.html', '');

  $('a[href="'+ url +'"]').addClass('active');
});
