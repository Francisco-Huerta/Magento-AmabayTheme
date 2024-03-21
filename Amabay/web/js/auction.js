require(['jquery', 'Magento_Ui/js/modal/modal', 'Magento_Customer/js/customer-data'], function ($, modal, customerData) {
    $('.auction-message').on('click', function (event) {
        event.stopPropagation(); // Prevent triggering the parent's click event
        var isLoggedIn = customerData.get('customer')().firstname ? true : false;
        const auctionMessages = {
            noOfferNoPublicity: "Para que tu [Marca] se venda es necesario invertir en publicidad.",
            reservePriceNotMetNoPublicity: "Es difícil alcanzar un buen precio para tu [Marca] sin invertir en publicidad.",
            noOfferWithPublicity: "Es posible que tu [Marca] no se vea atractivo en las fotos o que la descripción no sea la adecuada.",
            reservePriceNotMetPublicity: "Asegúrate que el precio de reserva no sea superior al precio que las personas están dispuestas a pagar por tu [Marca]. [Recomendation]",
            auctionNotApproved: "Tu [Marca] no ha sido aprobado para subasta. Verifica los requisitos y [Contact Us] para más detalles."
        };

        function getAuctionMessage(key, brand) {
            let message = auctionMessages[key];
            if (!message) {
                return "Mensaje no encontrado.";
            }

            // Replace the placeholder with the actual brand.
            message = message.replace(/\[Marca\]/g, brand);

            // Specific replacements for additional placeholders if necessary
            if (key === "reservePriceNotMetPublicity") {
                message = message.replace("[Recomendation]", "Considera ajustar el precio para aumentar las posibilidades de venta.");
            }

            if (key === "auctionNotApproved") {
                message = message.replace("[Contact Us]", "<a href='contact.html'>Contáctanos</a>");
            }

            return message;
        }
        if (isLoggedIn) {
            var parentDiv = $(this).closest('.product-item-link');
            var dataAttributes = parentDiv.data();
            // console.log('Auction message clicked:', dataAttributes);
            var currentTime = Date.now();
            console.log('Current time:', currentTime);
            // Update modal content based on the clicked element's data
            var stopAuctionTimeStamp = Date.parse(dataAttributes.stopAuctionTime);
            console.log('stopAuctionTimeStamp:', stopAuctionTimeStamp);
            var auctionPrice = '$ ' + dataAttributes.auctionPrice;
            console.log('auctionPrice:', auctionPrice);
            var isSold = dataAttributes.sold;
            var situation = dataAttributes.situation;
            console.log('Situation:', situation);
            var brand = dataAttributes.brand;
            console.log('Brand:', brand);
            var publicity = dataAttributes.publicity;
            console.log('Publicity:', publicity);
            console.log(dataAttributes.loggedinUserData);
            // var loggedinUser = JSON.parse(dataAttributes.loggedinUserData);
            // var auctionOwner = JSON.parse(dataAttributes.auctionOwnerData);
            var winnerUser = dataAttributes.winnerData;
            var auctionOwner = dataAttributes.auctionOwnerData;
            // console.log(winnerUser.fullname, winnerUser.email, winnerUser.phone);
            // console.log(auctionOwner.fullname, auctionOwner.email, auctionOwner.phone);

            if (isSold) {
                
                var auctionMessage = dataAttributes.auctionMessage;
                console.log('Product is sold');
                // owner of the product
                if (situation === 'A5-1' || situation === 'A6-1') {
                    var title1 = "Datos comprador";
                    var text1 = winnerUser.fullname;
                    var text2 = winnerUser.email;
                    var text3 = winnerUser.phone;
                    var title2 = "¿Qué hago ahora?";
                    var text4 = "Ahora debes contactar al comprador para acordar la forma de transferencia, pago y entrega del auto.\
                                ingresa a <a style=\"display: inline;\" href=\"pages/faq/index/#vehicle-transfer\">¿Cómo transferir un auto?</a> si tienes dudas";
                    console.log('auctionMessage ', auctionMessage);
                    console
                } else if (situation === 'A5-4' || situation === 'A6-4') {
                    var title1 = "Datos vendedor";
                    var text1 = auctionOwner.fullname;
                    var text2 = auctionOwner.email;
                    var text3 = auctionOwner.phone;
                    var title2 = "¿Qué hago ahora?";
                    var text4 = "Ahora debes contactar al vendedor acordar la forma de transferencia, pago y entrega del auto.\
                                ingresa a <a style=\"display: inline;\" href=\"pages/faq/index/#vehicle-transfer\">¿Cómo transferir un auto?</a> si tienes dudas";
                } else {
                    return;
                }
                var notSoldModal = $("#notSold-modal");

                var notShow = notSoldModal.find('.message-container-not-sold');
                notShow.hide();

                var modalImagePhotoElement = notSoldModal.find('.modal-image-photo');
                modalImagePhotoElement.attr('src', dataAttributes.imageUrl);

                var productNameElement = notSoldModal.find('.product-name');
                productNameElement.text(auctionMessage);

                var title1Element = notSoldModal.find('.message-container-sold h2');
                var text1Element = notSoldModal.find('#modal-sold-text1');
                var text2Element = notSoldModal.find('#modal-sold-text2');
                var text3Element = notSoldModal.find('#modal-sold-text3');
                var title2Element = notSoldModal.find('h3');
                var text4Element = notSoldModal.find('#modal-sold-text4');

                title1Element.text(title1);
                text1Element.text(text1);
                text2Element.text(text2);
                text3Element.text(text3);
                title2Element.text(title2);
                text4Element.html(text4);
                
                notSoldModal.modal("openModal");
            } else if (currentTime < stopAuctionTimeStamp) {
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
                var notShow = notSoldModal.find('.message-container-sold');
                notShow.hide();
                $('.auction-end').text($.mage.__('La subasta termino, no se pueden poner más ofertas'));
                $('#bid-form .action.primary').prop('disabled', true);

                var modalImagePhotoElement = notSoldModal.find('.modal-image-photo');
                modalImagePhotoElement.attr('src', dataAttributes.imageUrl);

                var modalBrandElement = notSoldModal.find('#brand');
                modalBrandElement.text(dataAttributes.brand);

                var modalAnswerElement = notSoldModal.find('#answer');
                var key;
                if (situation === 'A0') {
                    console.log('Not Approved');
                    key = 'auctionNotApproved';
                } else if (situation === 'A7-1' && !publicity) {
                    key = 'noOfferNoPublicity';
                } else if (situation === 'A7-1' && publicity) {
                    key = 'noOfferWithPublicity';
                } else if (situation === 'A8-1' && !publicity) {
                    key = 'reservePriceNotMetNoPublicity';
                } else if (situation === 'A8-1' && publicity) {
                    key = 'reservePriceNotMetPublicity';
                }
                modalAnswerElement.html(getAuctionMessage(key, brand));
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