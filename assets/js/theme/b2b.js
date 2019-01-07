import PageManager from './page-manager';
import $ from 'jquery';
import {fb} from './common/firebase';
import utils from '@bigcommerce/stencil-utils';
import jsrender from 'jsrender'
import {IsAdmin} from './common/isadmin';


export default class b2b extends PageManager {

	loaded(next) {
		console.log('b2b.js');
		// this.admin();
		next();
	}

	admin() {
		const self = this;
		IsAdmin.check(function(authorized) {
			console.info('admin: ', authorized);
			window.admin = authorized;
		});
	}

	



}








