// global: ymaps
ymaps.ready(function () {

	var mapsel = document.querySelector('.js-map');

	function btnZoom (e) {
		var i = e.data.inc || 1,
			zoom = myMap.getZoom() + i,
			center = myMap.getCenter;
		myMap.setZoom(zoom, {
			smooth: true,
			position: center,
			centering: true
		});
		return false;
	}

	function makeBtns() {
		var plus = document.createElement('button'),
			minus = document.createElement('button');
		plus.setAttribute('class', 'js-map_btn btn-plus');
		plus.setAttribute('data-txt', '+');
		minus.setAttribute('class', 'js-map_btn btn-minus');
		minus.setAttribute('data-txt', '-');
		mapsel.appendChild(plus);
		mapsel.appendChild(minus);
		(function($){
			// $('.btn-plus').click( function() {
			// 	btnZoom(1);
			// });
			$('.btn-plus').click( {inc: 1}, btnZoom);
			$('.btn-minus').click( {inc: -1}, btnZoom);
		})( jQuery );
	}

	// Создание экземпляра карты и его привязка к созданному контейнеру
	// координаты задаются непосредственно на странице в переменную destinations
	if (mapsel) {
		// console.log('[Debug] *maps should be working now*');
		var dest = {
				'vhod': [59.395806, 56.845670],
				'nefertity': [59.395806, 56.845670],
			},
			myMap = new ymaps.Map(mapsel, {
				center: dest.nefertity,
				zoom: 17,
				controls: []
			}),
			plc1 = new ymaps.Placemark(dest.nefertity, {}, {
				iconLayout: 'default#image',
				// iconImageHref: '//' + location.host + '/wp-content/themes/nefertity/assets/img/nf_js_map_marker.png',
				iconImageHref: '//' + location.host + '/wp-content/themes/nefertity/assets/img/nf_js_map_marker.svg',
				iconImageSize: [38, 55],
				iconImageOffset: [-20, -70]
			}),
			plc2 = new ymaps.Placemark(dest.vhod, {}, {
				iconLayout: 'default#image',
				// iconImageHref: '//' + location.host + '/wp-content/themes/nefertity/assets/img/nf_js_map_vhod.png',
				iconImageHref: '//' + location.host + '/wp-content/themes/nefertity/assets/img/nf_js_map_vhod.svg',
				iconImageSize: [15, 16],
				iconImageOffset: [-40, 32]
			});

		myMap.behaviors.disable(['scrollZoom']);
		myMap.geoObjects.add(plc1).add(plc2);
		// makeBtns();

	} // if
});
