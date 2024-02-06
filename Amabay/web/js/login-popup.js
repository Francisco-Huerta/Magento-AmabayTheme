console.log('JS file loaded and working.');

require([
    'jquery',
    'Magento_Ui/js/modal/modal',
    'mage/url',
    'mage/storage',
    'mage/translate'
], function($, modal, url, storage, $t) {
    console.log('test');

    $(document).ready(function() {
        console.log('test2');
        // Define your modal options
        var options = {
            type: 'popup',
            responsive: true,
            innerScroll: true,
            title: 'Example Modal',
            buttons: [{
                text: 'Close',
                class: 'mymodal-close',
                click: function () {
                    this.closeModal();
                }
            }]
        };

        // Initialize the modal
        var exampleModal = modal(options, $('#popup-modal'));
        console.log('test3');

        // Attach click event to elements with the specific class
        var loginLink = document.querySelector('.user-profile.notlogged a.social-login-btn');
        if (loginLink) {
            loginLink.addEventListener('click', function () {
                console.log('Login link clicked');
                $('#popup-modal').modal('openModal');
            });
        }

        $('#popup-modal').on('submit', '#login-form', function(event) {
            event.preventDefault();
            console.log('Form submission intercepted.');

            var formData = $(this).serializeArray();
            var formUrl = $(this).attr('action');

            $('body').loader().loader('show');

            storage.post(
                formUrl,
                JSON.stringify(formData)
            ).done(function(response) {
                $('body').loader().loader('hide');
                console.log('Login successful:', response);
                $('#popup-modal').modal('closeModal');
            }).fail(function(response) {
                $('body').loader().loader('hide');
                console.log('Login failed:', response);
                // Display error message, similar to _showFailingMessage in the module
                $('#popup-modal').find('.messages').html('');
                $('<div class="message message-error error"><div>' + $t('An error occurred, please try again later.') + '</div></div>').appendTo($('#popup-modal').find('.messages'));
            });
        });
    });
});
