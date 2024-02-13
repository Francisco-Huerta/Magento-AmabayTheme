require(['jquery', 'Magento_Ui/js/modal/modal', 'Magento_Customer/js/customer-data'], function ($, modal, customerData) {
    $('.auction-message').on('click', function (event) {
        event.stopPropagation(); // Prevent triggering the parent's click event
        var isLoggedIn = customerData.get('customer')().firstname ? true : false;
        if (isLoggedIn) {
            var parentDiv = $(this).closest('.product-item-link');
            var dataAttributes = parentDiv.data();
            console.log('Auction message clicked:', dataAttributes);
            var currentTime = Date.now();
            console.log('Current time:', currentTime);
            // Update modal content based on the clicked element's data
            var stopAuctionTimeStamp = Date.parse(dataAttributes.stopAuctionTime);
            console.log('stopAuctionTimeStamp:', stopAuctionTimeStamp);
            var auctionPrice = '$ ' + dataAttributes.auctionPrice;
            console.log('auctionPrice:', auctionPrice);

            // Cache the modal elements for better performance
            var bidModal = $("#bid-modal");
            var inputElements = bidModal.find('input');
            var productNameElement = bidModal.find('.product-name');
            var priceInfoElement = bidModal.find('.price-info');
            var modalImagePhotoElement = bidModal.find('.modal-image-photo');

            // Set the values and text content
            inputElements.filter('[name="entity_id"]').val(dataAttributes.entityId);
            inputElements.filter('[name="product_id"]').val(dataAttributes.productId);
            inputElements.filter('[name="pro_name"]').val(dataAttributes.productName);
            inputElements.filter('[name="auto_auction_opt"]').val(dataAttributes.autoAuctionOpt);
            inputElements.filter('[name="pro_url"]').val(dataAttributes.proUrl);
            inputElements.filter('[name="stop_auction_time_stamp"]').val(stopAuctionTimeStamp);
            productNameElement.text(dataAttributes.productName);
            priceInfoElement.text(auctionPrice);
            modalImagePhotoElement.attr('src', dataAttributes.imageUrl);

            if (currentTime < stopAuctionTimeStamp) {
                // Auction is active
                $('.auction-end').text($.mage.__('La subasta está activa, puedes hacer una oferta!'));
                $('#bid-form .action.primary').prop('disabled', false);
            } else {
                // Auction has ended
                $('.auction-end').text($.mage.__('La subasta termino, no se pueden poner más ofertas'));
                $('#bid-form .action.primary').prop('disabled', true);
            }
            // Open the modal
            bidModal.modal("openModal");
        } else {
            console.log('User is not logged in');
            return;
            // window.location.href = '/customer/account/login/';
        }

    });
});