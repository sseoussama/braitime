import PageManager from './page-manager';
import $ from 'jquery';
import Dropzone from 'dropzone';
// import {fb} from './common/firebase';
import {IsAdmin} from './common/isadmin';

export default class Home extends PageManager {
	loaded(next) {
		$('body').removeClass('inside');
		// this.getHomeData();
		// this.pressCar();
		// this.admin();
		this.scrolled();
		next();
	}
	admin() {
		const self = this;
		IsAdmin.check(function(authorized) {
			// console.info('admin: ', authorized);
			if(authorized) {
				self.createDropzones();
				self.rightClick();
				self.rightClick_press();
			}
		});
		// console.log(isAdmin)
	}
	


	scrolled() {
		$(window).scroll(function() {
		    var y_scroll_pos = window.pageYOffset;
		    var topBarHeight = $('header').height();
		    var scroll_pos_test = topBarHeight;
		    var promoHeight = '-'+$('.above-nav-info').outerHeight()+'px';
		    // var promoHeight = "32px";

		    if(y_scroll_pos > scroll_pos_test) {
				$('.above-nav-info').css('margin-top', promoHeight);
				$("body").addClass('scrolled');
		    }
		    else {
				$('.above-nav-info').css('margin-top', 0+'px');
				$("body").removeClass('scrolled');
		    }
		});
	}









	//  /$$$$$$$
	// | $$__  $$
	// | $$  \ $$ /$$$$$$   /$$$$$$   /$$$$$$$ /$$$$$$$
	// | $$$$$$$//$$__  $$ /$$__  $$ /$$_____//$$_____/
	// | $$____/| $$  \__/| $$$$$$$$|  $$$$$$|  $$$$$$
	// | $$     | $$      | $$_____/ \____  $$\____  $$
	// | $$     | $$      |  $$$$$$$ /$$$$$$$//$$$$$$$/
	// |__/     |__/       \_______/|_______/|_______/
	
	
	
	pressCar() {
		let press_data;
		const self = this;
		const pressCar = $('.pressCar');
		fb.subscribe('quotes').on('value', function(snapshot) {
			pressCar.html('');
            press_data = snapshot.val();
            // console.log(press_data);
            $.each(press_data, function(i, entry){
            	// console.log(entry);
            	let markup = `<div class="logo column is-3" data-ref="${entry.href}" data-id="${entry.id}" data-quote="${entry.quote}"> <img class="logo-img" src="${entry.img}"> </div>`;
            	pressCar.append(markup)
            });
            // self.start_press_car(pressCar);
        });
	}
	start_press_car(pressCar) {
		// if( $('.slick-initialized').length ) {
		// 	// pressCar.slick("unslick");
		// }else {
			pressCar.not('.slick-initialized').slick({
				slidesToShow: 5,
				slidesToScroll: 1,
				autoplay: true,
				centerMode: true,
				autoplaySpeed: 3000,
				focusOnSelect: true,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 3,
						}
					}
				]
			});
			pressCar.on('afterChange', function(e, slick, i){
				const current = slick.$slides[i];
				const quote = $(current).attr('data-quote');
				const href = $(current).attr('data-ref');
				$('.quote.d span').text(quote);
				$('.quote.d a').attr('href', href);
			});
		// }
	}
	rightClick_press() {
		var home = this;
		let isUpdate = '';
		let current_id;
		$('.press').bind("contextmenu", function(e) {
		    event.preventDefault();
			$('.contextMenu_press input[type="text"]').val('');
		    $("ul.contextMenu_press").show().css({top: event.pageY + 15, left: event.pageX + 10});
		    let zone = $(this).data('zone');
		    isUpdate = $(e.target).hasClass('logo-img');
		    if(isUpdate) { 
		    	$('.contextMenu_press input[type="submit"]').removeClass('blue-bg yellow-bg').addClass('green-bg').val('Update');
		    	const item = $(e.target).closest('.logo');
		    	// item.css('border','3px solid red')
		    	current_id = item.data('id');
		    	home.populate_form(item);
		    	$('input#id').show();
		    	$('.rmv').show();
		    } else {
		    	$('.contextMenu_press input[type="submit"]').removeClass('green-bg blue-bg').addClass('blue-bg').val('Publish'); 
		    	$('input#id').hide();
		    	$('.rmv').hide();
		    }
		});
		$(document).click(function() {let isHovered = $("ul.contextMenu_press").is(":hover"); if (isHovered == false){$("ul.contextMenu_press").fadeOut("fast"); } });
		$('#pressForm').submit( function(e){
			e.preventDefault();
			$("ul.contextMenu_press").fadeOut("fast");
			if(isUpdate) {
				home.press_update( $(this) );
			}else {
				home.press_post( $(this) );
			}
		});
		$('.rmv').click( function() {
			fb.remove(`quotes/${current_id}`);
			$('.rmv').hide();
			$('.contextMenu_press input[type="submit"]').removeClass('blue-bg green-bg').addClass('yellow-bg').val('Undo Delete'); 
		});
	}
	populate_form($item) {
		const form = $('#pressForm');
		form.find('#id').val( $item.data('id') );
		form.find('#href').val( $item.data('ref') );
		form.find('#quote').val( $item.data('quote') );
		form.find('#img').val( $item.find('img').attr('src') );
	}
	press_post(form) {
		console.log('post');
		const data = {
			img: form.find('#img').val(),
			quote: form.find('#quote').val(),
			href: form.find('#href').val()
		}
		fb.post('quotes/', data);
	}
	press_update(form) {
		console.log('update');
		const data = {
			img: form.find('#img').val(),
			quote: form.find('#quote').val(),
			href: form.find('#href').val(),
			id: form.find('#id').val()
		}
		fb.write(`quotes/${data.id}`, data);
		$('.contextMenu_press input').val('');
	}













	getHomeData() {
		fb.subscribe('home').on('value', function(snapshot) {
            var home_data = snapshot.val();
            // zones
			$('[data-zone]').each( function(i, zone){
				let zone_id = $(zone).data('zone');
				let image_url = home_data[zone_id].image || null;
				let image_alt = home_data[zone_id].alt || null;
				let link = home_data[zone_id].path || null;
				let $img = $(zone).find('img');
				let $link = $(zone).find('a');
				$img.attr('src', image_url);
				$img.attr('alt', image_alt);
				$link.attr('href', link);
			});
        });
	}
	createDropzones() {
		// console.log('createDropzones()')
		var home = this;
	  	var dz_configs = {
		  	url: "/file/post",
			maxFilesize: 5,
			maxFiles: 1,
			addRemoveLinks: true,
			dictResponseError: 'Server not Configured',
			acceptedFiles: ".png,.jpg,.gif,.bmp,.jpeg",
			previewTemplate: $('.prevv').html(),
			autoProcessQueue: true,
		    init:function(){
				var self = this;
				var el = self.options.el;
				var prevEl = self.options.previewsContainer;
				// config
				self.options.addRemoveLinks = true;
				self.options.dictRemoveFile = "Delete";
				//New file added
				self.on("addedfile", function (file) {
					if (this.files[1]!=null){
				        this.removeFile(this.files[0]);
				    }
				});
				// Send file starts
				self.on("sending", function (file) {
					$('.meter').show();
					var ths = this;
					setTimeout( function(){
						// preview
						$(el).find(prevEl+' img').attr('src', file.dataURL);
						$(el).find(prevEl).removeClass('hide');
						$(el).find('.button.save').click( function(){
							home.publish_img(file, el.replace(']','').replace('[',''));
							ths.removeFile(ths.files[0]);
						});
					},1000);
				});

		    }
		  };

		  // creatDropzones
		  $("[dz1]").dropzone(Object.assign({el: '[dz1]', previewsContainer: '[upload-preview-dz1]'}, dz_configs));
		  $("[dz2]").dropzone(Object.assign({el: '[dz2]', previewsContainer: '[upload-preview-dz2]'}, dz_configs));
		  $("[dz3]").dropzone(Object.assign({el: '[dz3]', previewsContainer: '[upload-preview-dz3]'}, dz_configs));
		  $("[dz5]").dropzone(Object.assign({el: '[dz5]', previewsContainer: '[upload-preview-dz5]'}, dz_configs));
		  $("[dz6]").dropzone(Object.assign({el: '[dz6]', previewsContainer: '[upload-preview-dz6]'}, dz_configs));
		  $("[dz7]").dropzone(Object.assign({el: '[dz7]', previewsContainer: '[upload-preview-dz7]'}, dz_configs));

	}

	rightClick() {
		var home = this;
		$('[data-zone]').bind("contextmenu", function(event) {
		    event.preventDefault();
		    $("ul.contextMenu")
		        .show()
		        .css({top: event.pageY + 15, left: event.pageX + 10});
		    let zone = $(this).data('zone');
		    let dims = $(this).data('dims');
		    let img_url = $(this).find('img').attr('src');
		    let img_alt = $(this).find('img').attr('alt');
		    let link = $(this).find('a').attr('href');
		    $("ul.contextMenu span.zone_id").html(zone);
		    $("ul.contextMenu input.zone").val(zone);
		    $("ul.contextMenu p.dims").html(dims);
		    $("ul.contextMenu input.image").val(img_url);
		    $("ul.contextMenu input.alt").val(img_alt);
		    $("ul.contextMenu input.path").val(link);
		});
		$(document).click(function() {
		  let isHovered = $("ul.contextMenu").is(":hover");
		  if (isHovered == false){
		    $("ul.contextMenu").fadeOut("fast");
		  }
		});
		$('#contextForm').submit( function(e){
			console.log(e);
			e.preventDefault();
			$("ul.contextMenu").fadeOut("fast");
			home.contextSubmit($(this));
		})
	}



	contextSubmit(form){
		let data = {
			zone: form.find('input[name="zone"]').val(),
			path: form.find('input[name="path"]').val(),
			image: form.find('input[name="image"]').val(),
			alt: form.find('input[name="alt"]').val()
		}
		console.log('data: ', data);
		fb.write('home/'+data.zone, data);
		console.log('submit');
	}

	publish_img(file, filename) {
		console.log(' ==== saving ====> ',file);
		fb.addImage('home', filename, file)
	}
}







