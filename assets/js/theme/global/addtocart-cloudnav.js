import $ from 'jquery';
import _ from 'lodash';
import swal from 'sweetalert2';
import utils from '@bigcommerce/stencil-utils';





export default function addtocart_cloudnav(quick) {


    // const $button = $('[data-cart-item-add-2]');
    const $confirmationPop = $('#confirmationPop');
    const $button = (quick) ? $('[data-cart-item-add-quickadd]') : $('[data-cart-item-add-2]');


    /**
     * move button & reveal
     */
    $button.each( function() {
        const pId = $(this).data('submits');
        const $container = $(this).closest('article');
        const $buttonHome = (quick) ? $(`.cloudnav_quick_addtocart_${pId}`) : $(`.cloudnav_addtocart_${pId}`, $container);
        if($buttonHome.length) {
            $buttonHome.append($(this));
            $(this).removeClass('hide');
        }
    });


    /**
     * listener
     */
    $button.on('click', e => {
        e.preventDefault();
        const $selector = $(e.target).data('submits');
        // const $form = $(`[data-item-add-${$selector}]`);
        const $form = (quick) ? $(`[data-item-add-${$selector}].quickadd`) : $(`[data-item-add-${$selector}]`);
        addProductToCart(e, $form[0]);

        // submit (if something is wrong try uncommenting below)
        // $form[0].submit();
        // $form.on('submit', e => {
        //     e.preventDefault();
        // });
    });





    /**
     * Grooms listener
     */
    //  $('[data-grooms-add]').unbind();
    // $('[data-grooms-add]').on('click', e => {
    //     e.preventDefault();
    //     const $form_d = $(`[data-item-add-groomsD]`); // user selections
    //     const $form = $(`[data-item-add-grooms]`); // default
    //     addProductToCart(e, $form[0], function() {
    //         addProductToCart(e, $form_d[0]);
    //         $('.add-bar').hide();
    //         $('selected').removeClass('selected');
    //     });
    //     // submit (if something is wrong try uncommenting below)
    //     // $form[0].submit();
    //     // $form.on('submit', e => {
    //     //     e.preventDefault();
    //     // });
    // });




    /**
     * Add a product to cart
     */
    function addProductToCart(e, form, callback) {
        // e.preventDefault();
        const formdata = new FormData(form);
        // for (var value of formdata.entries()) {
        // }

        // Do not do AJAX if browser doesn't support FormData
        if (window.FormData === undefined) {
            form.submit();
            form.on('submit', e => {
                e.preventDefault();
            });
            return;
        }
        const url = $("[name='url']",form).val();
        const productId = $("[name='product_id']",form).val();
        const qty = $("[name='qty[]']",form).val();

        console.log({url:url, productId:productId, qty:qty});

        const $addToCartBtn = $(e.target);
        // const $addToCartBtn = $('[data-cart-item-add-2]', $(e.target));
        const originalBtnVal = $addToCartBtn.html();
        const waitMessage = $addToCartBtn.data('wait-message');



        $addToCartBtn
            .html(waitMessage)
            .prop('disabled', true)
            .addClass('disabled');


        // Add item to cart
        utils.api.cart.itemAdd(new FormData(form), (err, response) => {
            const errorMessage = err || response.data.error;

            $addToCartBtn
                .html(originalBtnVal)
                .prop('disabled', false)
                .removeClass('disabled');


            // Guard statement $('[data-product-attribute]')
            if (errorMessage) {
                console.error(errorMessage);
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                const conflicting_options = $('[data-product-option-change]');
                const conflicting_options_parent = $('[data-cart-item-add]');
                const conflicting_options_clone = conflicting_options.clone();
                tmp.innerHTML = errorMessage;

                // if the error is option related then launch options modal
                if(errorMessage.includes('option')) {
                    return getOptions(productId, res => {
                        conflicting_options.remove();
                        setTimeout(e=>{
                            // maintain original qty
                            $('form.special').find('[name="qty[]"]').val(qty);
                        },1000);
                        return swal({
                            html: res,
                            type: 'info',
                            width: 340,
                            confirmButtonText: "Add to Cart",
                            onClose: () => {
                                conflicting_options_parent.append(conflicting_options_clone);
                            }
                        }).then( (e) => {
                            return addProductToCart(e, $(`[pop-form]`)[0], (res)=>{
                            });
                        });
                    });
                }

                return swal({
                    html: tmp.innerHTML || tmp.innerText, // omar updated to send html instead
                    type: 'error',
                });
            }

            updateCartContent(response.data.cart_item.hash);

            if(callback) {
                callback();
            }
        });
    }


    function getOptions(productId, next) {
        console.log('getOptions: ', productId);
        utils.api.product.getById(productId, { template: 'cloudnav/products/options_modal' }, (err, response) => {
           next(response);
        });
    }







    /**
     * Update cart content
     */
    function updateCartContent(cartItemHash, onComplete) {
        getCartContent(cartItemHash, (err, response) => {
            if (err) {
                return;
            }

            $confirmationPop.html(response).removeClass('hide');
            // Update cart counter
            const $body = $('body');
            const $cartQuantity = $('[data-cart-quantity]');
            const $cartCounter = $('.navUser-action .cart-count');
            const quantity = $cartQuantity.data('cartQuantity') || 0;

            $cartCounter.addClass('cart-count--positive');
            $body.trigger('cart-quantity-update', quantity);

            setTimeout( function() {
                hide_popup($confirmationPop);
            },8000);
                


            $('[data-reveal-close]', $confirmationPop).click( function() {
                hide_popup($confirmationPop)
            })

            if (onComplete) {
                onComplete(response);
            }
        });
    }





    /**
     * Hide popup
     */

     function hide_popup($confirmationPop) {
        $confirmationPop.addClass('hide');
        $confirmationPop.html('');
     }






    /**
     * Get cart contents
     *
     * @param {String} cartItemHash
     * @param {Function} onComplete
     */
    function getCartContent(cartItemHash, onComplete) {
        const options = {
            // template: 'cart/preview',
            template: 'cloudnav/confirmationPop',
            params: {
                suggest: cartItemHash,
            },
            config: {
                cart: {
                    suggestions: {
                        limit: 4,
                    },
                },
            },
        };

        utils.api.cart.getContent(options, onComplete);
    }





}

