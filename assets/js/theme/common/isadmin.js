import $ from 'jquery';
import {fb} from './firebase';

//firebase write
export const IsAdmin = {
    check: function(callback) {
        // this.update();
        const self = this;
        return fb.subscribe('admins').on('value', function(snapshot) {
            let admins = snapshot.val();
            // console.info('admins: ',admins);
            let current = $('input#currentUser').val();
            // console.info('current: ',current);
            // let isAdmin = ( current.indexOf( admins ) > -1 );
            let isAdmin = admins.includes(current);
            // console.info('isAdmin: ',isAdmin);
            return callback(isAdmin);
        })
    },
    update: function() {
        let update = [
            'contactomarnow@gmail.com'
        ];
        fb.write('admins', update);
    }
}
