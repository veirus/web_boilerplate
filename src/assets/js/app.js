/*global $:true*/
// check if pagename is defined
var pagename = pagename ? pagename : null;
(function($) {
	$(function() {
		/* = = = documentReady = = = */

		// noLags();
		// getWindowSize();
		// windowChange();
		// inputDrive();
		// inputCheck();
		// dostavkaPopup();
		slyInit();

		// function windowResize(){
		// 	// getWindowSize();
		// 	// windowChange();
		// 	slyResize();
		// }

		$(window).resize(function(){
			// windowResize();
			slyResize();
		});

		if (pagename == 'docs') {
			$('.docs_gallery a').Chocolat();
		}

		/*
		 * Actually i don't need all that shiet...
		 * All hail jquery!!!1
		 * 2017-05-29 - cw
		function getAutoHeight(el) {
			var tmpel = el.clone().css({'height':'auto'}).appendTo(el.parent());
			var height = tmpel.css('height');
			tmpel.remove();
			return height;
		}
		function animateHeightAuto(event) {
			// animate submenu in sidebar
			event.preventDefault();
			var speed = 300;
			var cb = null;
			var el = $(this).parent();
			el.toggleClass('is-open');
			var height = getAutoHeight(el);
			el.animate({'height':height}, speed, cb);
			// event.stopPropagation();
			// console.log(event.target, event.isPropagationStopped());
		}
		$('.sub-menu').prev().on('click', animateHeightAuto);
		*/

		function toggleMenuOpen(elem) {
			var parent = elem.parent();
			parent.toggleClass('is-open');
			parent.children('ul').stop().slideDown(400);
		}
		function collapseMenus() {
			$(this).children('ul').stop().slideUp(300);
			$(this).removeClass('is-open');
		}
		$('.sub-menu').parent().addClass('droparrow');
		$('.sub-menu').prev().on('click', function(event) {
			// event.stopPropagation();
			event.preventDefault();
			var self = $(this);
			var level = self.parents('.smenu_itm').length;
			var closeMe = self.parent().parent().find('.is-open');
			if (level == 2) {
				closeMe = self.parent().parent('.sub-menu').children('.is-open');
			}
			toggleMenuOpen(self);
			closeMe.each(collapseMenus);
		} );

		$('.js-btn_modal').on('click', function(event){
			var id = $(this).attr('href');
			$(id).addClass('is-active');
			event.preventDefault();
		});
		$('.close-modal').on('click', function(event) {
			$('#order-modal').removeClass('is-active');
			event.preventDefault();
		});

		// modal window
		// $('.js-btn_modal').click(function(event) {
		// 	event.preventDefault();
		// 	var id = $(this).attr('href');
		// 	console.log(id);
		// 	openBanner(id);
		// 	return false;
		// });
		/*
		$('body').on('click', '.modal-close', function(){
			closeBanner('.modal');
		});
		$('body').on('click', '#close-modal', function(){
			closeBanner('.modal');
		});
		*/

		/* Image Preview */
		/*
		$('.product__preview .preview__cell:first').addClass('active');
		$('.product__preview .preview__cell').on('click' ,function(){
			var preview = $(this).find('img').data('src');
			// var num = $(this).parent().data('num');
			var original = $(this).attr('href');
			if ((preview != $('.prev_image a').children('img').attr('src')) ) {
				$('.prev_image a').attr('href', original);
				$('.prev_image a').children('img').fadeOut(300, function() {
					$(this).attr('src', preview).fadeIn(400);
				});
				$('.product__preview .preview__cell').removeClass('active');
				$(this).addClass('active');
				return false;
			}
		});

		// gallery open img
		// $('.fthumb').fancybox({
		// 	padding: 0,
		// 	zoomOpacity: true,
		// 	zoomSpeedIn: 1000,
		// 	zoomSpeedOut: 1000,
		// });
	*/

	});

	/* open modal ---------------------- */
	function openBanner (id) {
		// var top = $(window).scrollTop(),
		// var height = $(id).innerHeight(),
		// var win = $(window).height();
		$('body').css({
			'overflow-y' : 'hidden',
			'padding-right' : '17px'
		});
		$('#overlay').fadeIn('fast');
		$(id).removeAttr('class').removeAttr('style').addClass('modal modal-hide').removeClass('modal-hide').addClass('modal-active animated fadeInDown');
	}

	function closeBanner () {
		$('.modal').fadeOut('fast', function(){
			$('body').css({
				'overflow-y' : 'auto',
				'padding-right' : '0'
			});
		});
		$('.modal-active').addClass('fadeOutDown');
		setTimeout(function() {
			$('.modal-active').removeAttr('class').removeAttr('style').addClass('modal modal-hide');
		}, 800);
	}

	/* sly carousel ---------------------- */
	var sli = {
		present : { el: '.js-banner',       },
		mainnew : { el: '.js-awards_sli',   },
		personel: { el: '.js-personel',     },
		articles: { el: '.js-articles_sli', },
		season  : { el: '#slide_season',    },
		compare : { el: '#slide_compare',   },
	};
	function slyInit(){
		var options = {
			activateOn:     'click',
			activatePageOn: 'click',
			clickBar:       1,
			dragHandle:     0,
			dynamicHandle:  1,
			elasticBounds:  1,
			horizontal:     1,
			itemNav:        'forceCentered',
			mouseDragging:  1,
			touchDragging:  1,
			pageBuilder:    null,
			pagesBar:       null,
			releaseSwing:   1,
			scrollBy:       0,
			smart:          1,
			speed:          300,
			startAt:        0,
			// Cycling
			cycleBy:        'items',
			cycleInterval:  6000,
			pauseOnHover:   1,
			// Button
			prevPage:       null,
			nextPage:       null
		};

		// First slider
		options.pagesBar      = $('.slider').find('.sli_ctrl');
		options.pageBuilder   = function (index) {
			return '<li class="sli_dot">'+index+'</li>';
		};
		sli.present.sl        = makeSly(sli.present.el, options, '.sli_prev', '.sli_next');
		sli.personel.sl        = makeSly(sli.personel.el, options, '.sli_prev', '.sli_next');
		// Second and other sliders:
		options.itemNav       = 'basic';
		options.pagesBar      = null;
		options.pageBuilder   = null;
		options.cycleInterval = 3000;
		sli.articles.sl       = makeSly(sli.articles.el, options, '.sli_prev', '.sli_next');
		sli.mainnew.sl        = makeSly(sli.mainnew.el, options, '.sli_prev', '.sli_next');
		sli.season.sl         = makeSly(sli.season.el, options, '.sli_prev', '.sli_next');

		// Compare is also a slider as you already guessed
		if ($(sli.compare.el).length == 1){
			options.prevPage	  = null;
			options.nextPage	  = null;
			options.cycleBy		  = null;
			options.cycleInterval = 0;
			options.scrollBar	  = $('.box-scroll').find('.scrollbar');
			sli.compare.sl		  = $(sli.compare.el).sly(options);
		}
	}

	function makeSly(el, options, prev, next) {
		// Create cycled slider
		var sel			 = $(el);
		if(sel.length === 0){ return null; }
		var wrap		 = sel.parent();
		options.prevPage = wrap.find(prev);
		options.nextPage = wrap.find(next);
		/* global Sly */
		var slyobj		 = new Sly(el, options).init();
		// console.log(options.prevPage, options.nextPage);

		options.prevPage.on('click', function() {
			if(slyobj.pos.cur == slyobj.pos.start){
				slyobj.toEnd();
				return false;
			}
		});

		options.nextPage.on('click', function() {
			if(slyobj.pos.cur == slyobj.pos.dest){
				slyobj.toStart();
				return false;
			}
		});

		return slyobj;
	}

	function slyResize() {
		for(var f in sli){
			if(sli.hasOwnProperty(f) && sli[f].sl)
				sli[f].sl.reload();
		}
	}
})( jQuery );
