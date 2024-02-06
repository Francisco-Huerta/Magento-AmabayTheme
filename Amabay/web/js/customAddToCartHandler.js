define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function($, customerData, alert) {
    'use strict';

    $.widget('mage.customAddToCartHandler', {
        _create: function() {
            this.element.on('submit', $.proxy(this._submitForm, this));
        },

        _submitForm: function(event) {
            event.preventDefault();

            var form = $(this.element);
            var button = $('#add-to-cart-button');
            var delayDuration = 1000; // 1 second

            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                type: 'POST',
                dataType: 'json',
                beforeSend: function() {
                    button.text($.mage.__('Adding...'));
                    button.attr('disabled', true);
                },
                success: function(response) {
                    customerData.reload(['cart'], true);
                    button.text($.mage.__('Añadido!'));
                    setTimeout(function() {
                        button.text($.mage.__('Agregar al carro de compras'));
                        button.attr('disabled', false);
                    }, delayDuration);
                },
                error: function() {
                    setTimeout(function() {
                        button.text($.mage.__('Agregar al carro de compras'));
                        button.attr('disabled', false);
                    }, delayDuration);
                }
            });
        }
    });

    return $.mage.addToCartHandler;
});
