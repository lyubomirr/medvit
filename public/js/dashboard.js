$(document).ready(function() {
   $('.timeago').each(function() {
      var date = new Date($(this).text());
      date.setMinutes(date.getMinutes() - 37);
      var timeAgo = $.timeago(date);
      $(this).text(timeAgo);
    });

    $('.posts').perfectScrollbar();
    $(".clickable-row td").not(':last-child').click(function() {
        window.document.location = $(this).data("href");
    });
});

function initMap() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var uluru = {lat: latitude, lng: longitude};
            var map = new google.maps.Map(document.getElementById('hospital-map'), {
                zoom: 16,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
        } 
    }); 
}
