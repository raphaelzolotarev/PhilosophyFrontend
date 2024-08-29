// Cart Offset Sidebar Overlay
jQuery(document).ready(function($){
	$(document).on('click', '.pull-bs-canvas-right, .pull-bs-canvas-left', function(){
		$('body').prepend('<div class="bs-canvas-overlay bg-dark position-fixed w-100 h-100"></div>');
		if($(this).hasClass('pull-bs-canvas-right'))
			$('.bs-canvas-right').addClass('me-0');
		else
			$('.bs-canvas-left').addClass('ms-0');
		return false;
	});
	
	$(document).on('click', '.bs-canvas-close, .bs-canvas-overlay', function(){
		var elm = $(this).hasClass('bs-canvas-close') ? $(this).closest('.bs-canvas') : $('.bs-canvas');
		elm.removeClass('ms-0 me-0');
		$('.bs-canvas-overlay').remove();
		return false;
	});
});