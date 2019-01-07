import Dropzone from 'dropzone';
import {fb} from '../common/firebase';
import {IsAdmin} from '../common/isadmin';


export default function brand_images() {
	// const $brand_img = $('[data-brand-img]');
	// const $upload_form = $('#upload_form');
	// const $upload_input = $('#upload_form .file-input');

	// // if admin show form
	// IsAdmin.check(function(authorized) {
	// 	// console.info('admin: ', authorized);
	// 	if(authorized) {
	// 		$upload_form.show();
	// 	}
	// });

	// // get images
	// $brand_img.each( function(index, self) {
	// 	const $self = $(self);
	// 	const slug = fb.slugify($self.data('brand-img'));
	// 	fb.subscribe(`brand/${slug}`).on('value', function(path) {
	// 		if(path.val()) {
	// 			$self.attr('src', path.val().image);
	// 		}
	// 	});
	// });

	// // submit on input change
	// $upload_input.on('change', function(e) {
	// 	$upload_form.submit();
	// });

	// // upload a new brand image
	// $upload_form.on('submit', function(e) {
	// 	e.preventDefault();
	// 	const $inputs = $(' :input', $upload_form);
	//     const form = {};
	    
	//     $inputs.each(function() {
	//     	if( this.files ){
	//     		form[this.name] = this.files[0];
	//     	}else {
	//     		form[this.name] = $(this).val();
	//     	}
	//     });

	// 	const file = form.file;
		
	// 	fb.addBrandImage(form.name, file);
	// });

}





