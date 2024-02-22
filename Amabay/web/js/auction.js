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
            var isSold = dataAttributes.sold;

            if (isSold) {
                console.log('Product is sold');
                return;
            }

            if (currentTime < stopAuctionTimeStamp) {
                // Auction is active
                // Cache the modal elements for better performance
                var bidModal = $("#bid-modal");
                var inputElements = bidModal.find('input');
                var reservePriceElement = bidModal.find('.reserve-price');
                var productNameElement = bidModal.find('.product-name');
                var remainingTimeInfoElement = bidModal.find('#timeLeft');
                var numberOffersElement = bidModal.find('#number-of-offers');
                var priceInfoElement = bidModal.find('.price-info');
                var modalImagePhotoElement = bidModal.find('.modal-image-photo');

                // Set the values and text content
                inputElements.filter('[name="entity_id"]').val(dataAttributes.entityId);
                inputElements.filter('[name="product_id"]').val(dataAttributes.productId);
                inputElements.filter('[name="pro_name"]').val(dataAttributes.productName);
                inputElements.filter('[name="auto_auction_opt"]').val(dataAttributes.autoAuctionOpt);
                inputElements.filter('[name="pro_url"]').val(dataAttributes.proUrl);
                inputElements.filter('[name="stop_auction_time_stamp"]').val(stopAuctionTimeStamp);
                if (dataAttributes.hasReservePrice) {
                    reservePriceElement.text('Tiene precio de reserva');
                } else {
                    reservePriceElement.text('Sin precio de reserva');
                }

                // productNameElement.text(dataAttributes.productName);
                productNameElement.text(dataAttributes.brandModelCanBeYours);
                remainingTimeInfoElement.text(dataAttributes.remainingTime);
                remainingTimeInfoElement.addClass(dataAttributes.timeColorClass)
                numberOffersElement.text(dataAttributes.numberOffers);
                priceInfoElement.text(auctionPrice);
                modalImagePhotoElement.attr('src', dataAttributes.imageUrl);
                $('.auction-end').text($.mage.__('La subasta está activa, puedes hacer una oferta!'));
                $('#bid-form .action.primary').prop('disabled', false);
                bidModal.modal("openModal");

            } else {
                // Auction has ended
                var notSoldModal = $("#notSold-modal");
                $('.auction-end').text($.mage.__('La subasta termino, no se pueden poner más ofertas'));
                $('#bid-form .action.primary').prop('disabled', true);
                notSoldModal.modal("openModal");
            }
            // Open the modal
        } else {
            console.log('User is not logged in');
            return;
            // window.location.href = '/customer/account/login/';
        }

    });
});