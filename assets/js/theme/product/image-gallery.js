import $ from 'jquery';
import 'easyzoom';
import _ from 'lodash';

export default class ImageGallery {
    constructor($gallery) {
        this.$mainImage = $gallery.find('[data-image-gallery-main]');
        this.$selectableImages = $gallery.find('[data-image-gallery-item]');
        this.currentImage = {};
    }

    init() {
        this.setImageZoom(); // no zoom needed
        const self = this;
        setTimeout( function(){
            let selector = $('[data-image-gallery-item]');
            // selector.css('border', '2px solid red');
            self.bindEvents(selector);
        }, 1000); // wait for databased images (admin-images.js)
    }

    setMainImage(imgObj) {
        this.currentImage = _.clone(imgObj);

        this.setActiveThumb();
        this.swapMainImage();
    }

    setAlternateImage(imgObj) {
        if (!this.savedImage) {
            this.savedImage = {
                mainImageUrl: this.$mainImage.find('img').attr('src'),
                zoomImageUrl: this.$mainImage.attr('data-zoom-image'),
                $selectedThumb: this.currentImage.$selectedThumb,
            };
        }
        this.setMainImage(imgObj);
    }

    restoreImage() {
        if (this.savedImage) {
            this.setMainImage(this.savedImage);
            delete this.savedImage;
        }
    }

    selectNewImage(e) {
        e.preventDefault();

        const $target = $(e.currentTarget);
        const imgObj = {
            mainImageUrl: $target.attr('data-image-gallery-new-image-url'),
            zoomImageUrl: $target.attr('data-image-gallery-zoom-image-url'),
            $selectedThumb: $target,
        };

        this.setMainImage(imgObj);
    }

    setActiveThumb() {
        this.$selectableImages.removeClass('is-active');
        if (this.currentImage.$selectedThumb) {
            this.currentImage.$selectedThumb.addClass('is-active');
        }
    }

    swapMainImage() {
        this.easyzoom.data('easyZoom').swap(this.currentImage.mainImageUrl, this.currentImage.zoomImageUrl);

        this.$mainImage.attr({
            'data-zoom-image': this.currentImage.zoomImageUrl,
        });
    }

    setImageZoom() {
        this.easyzoom = this.$mainImage.easyZoom({ errorNotice: '', loadingNotice: '' });
    }

    bindEvents(selector) {
        selector.on('click', this.selectNewImage.bind(this));
        // this.$selectableImages.on('click', this.selectNewImage.bind(this));
    }
}
