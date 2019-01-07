import Dropzone from 'dropzone';
import {fb} from '../common/firebase';
import {IsAdmin} from '../common/isadmin';

const id = $("[dz]").attr('dz');

export default function admin_images() {
	// fb.write('images/test_sku/', {'hello': 'world'})
	// getImages( id );
	// IsAdmin.check(function(authorized) {
	// 	console.info('admin: ', authorized);
	// 	if(authorized) {
	// 		createDropzones();
	// 		$('.admin-add').removeClass('hide'); // reveal Plus
	// 		removeListen();
	// 	}
	// });
	// feature_overlay();
}

function createDropzones() {
	$('[dz-alter]').click( function(){$("[dz]").click()})
	var home = this;
  	var dz_configs = {
	  	url: "/file/post",
		maxFilesize: 10,
		maxFiles: 20,
		addRemoveLinks: true,
		dictResponseError: 'Server not Configured',
		acceptedFiles: ".png,.jpg,.gif,.bmp,.jpeg",
		// previewTemplate: $('.prevv').html(),
		autoProcessQueue: true,
	    init:function(){
			var self = this;
			var el = self.options.el;
			var id = self.options.id;
			// config
			self.options.addRemoveLinks = true;
			self.options.dictRemoveFile = "Delete";
			//New file added
			self.on("addedfile", function (file) {
				// if (this.files[1]!=null){
			 //        this.removeFile(this.files[0]);
			 //    }
				if (this.files.length) {
			        var _i, _len;
			        for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
			        {
			            if(this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString())
			            {
			                this.removeFile(file);
			            }
			        }
			    }
			});
			// Send file starts
			self.on("sending", function (file) {
				$('.meter').show();
				var ths = this;
				setTimeout( function(){
					// preview
					// $(el).find('.button.save').click( function(){
						addProductImage(file, id);
						ths.removeFile(ths.files[0]);
					// });
				},1000);
			});

	    }
	  };

	  // creatDropzones
	  $("[dz]").dropzone(Object.assign({el: '[dz]', id: $("[dz]").attr('dz')}, dz_configs));

}

function getImages(id) {
	fb.subscribe(`products/${id}`).on('value', function(product) {
		try {
	        var images = product.val().images;
	        placeImages(images);
	    } catch(err) {
	        console.log('NO IMAGES');
	        const imgwrap = $('.productView-thumbnails .databased').html('');
	    }
    });
}

function placeImages(images) {
	const imgwrap = $('.productView-thumbnails .databased');
	imgwrap.html('')
	$.each(images, function(index, image) {
		// var $img = document.createElement("IMG");
		// $img.setAttribute("src", image.url);
	 //    $img.setAttribute("width", "304");
	 //    $img.setAttribute("height", "228");
	    // $img.setAttribute("alt", "The Pulpit Rock");
	    var $img = `<li class="productView-thumbnail">
            <span dz-rm="${image.id}"><i class="fa fa-trash"></i></span>
            <a class="productView-thumbnail-link" href="${image.url}" data-image-gallery-item="" data-image-gallery-new-image-url="${image.url}" data-image-gallery-zoom-image-url="${image.url}">
                <img class="lazyautosizes lazyloaded" data-sizes="auto" src="${image.url}" data-src="${image.url}" alt="Collins (Youth)" title="Collins (Youth)" sizes="50px">
            </a>
        </li>`;
	    imgwrap.append($img);
	});
	removeListen();
}

function addProductImage(file, i) {
	fb.addProductImage('product', file, `products/${i}/images`, i);
}

function toArray(obj_obj) {
	return Object.keys(obj_obj).map(i => obj_obj[i]);
}

function pretty(obj) {
    return JSON.stringify(obj, null, 2)
}

function removeListen() {
	const btn = $('[dz-rm]');	
	btn.unbind();
	btn.click( function(e) {
		btn.unbind();
		removeImage($(this).attr('dz-rm'))
	})
}

function removeImage(key) {
	const db_path = `products/${id}/images/${key}`;
	fb.remove(db_path);
	removeListen();
}


function feature_overlay() {
	const trigger = $('a.features');
	
	trigger.click( function() {
		$('.productView-images').unbind();
		const $overlay = $('.overlay-feat');
		const main_thumb = $('li.productView-thumbnail:first-child a');
		if($overlay.hasClass('act')){
			$overlay.fadeOut().removeClass('act');
			trigger.removeClass('blue');
			return;
		}
		main_thumb.click();
		$overlay.fadeIn().addClass('act');
		trigger.addClass('blue');
		setTimeout( function() {
			$('.productView-images').click( function() {
				$overlay.fadeOut().removeClass('act');
				trigger.removeClass('blue');
			})
		}, 1000);

	});
}




