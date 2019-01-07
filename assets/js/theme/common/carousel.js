import $ from 'jquery';
import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length) {
        $carousel.slick();
    }
    setTimeout( function() {
        if($('.slick-slide', $carousel).length < 2) {
            $('.slick-dots').hide();
        }
    }, 500);

}
