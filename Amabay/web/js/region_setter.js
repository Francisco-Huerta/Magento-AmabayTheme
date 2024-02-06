define([
    'jquery'
], function($) {
    "use strict";

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    $(document).ready(function() {
        if (!localStorage.getItem('userRegion')) {
            $.getJSON('https://ipapi.co/json/', function(data) {
                localStorage.setItem('userRegion', data.region_code);
                setCookie('userRegion', data.region_code, 1); // Set for 7 days, for example
                console.log('Region set to: ' + data.region_code);
            }).fail(function(jqxhr, textStatus, error) {
                console.error('Error fetching region: ' + textStatus + ', ' + error);
                console.log('Region set to: ' + 'Unknown');
            });
        }
    });
});