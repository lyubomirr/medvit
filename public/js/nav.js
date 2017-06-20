$('#pull i').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('body>.nav ul').slideToggle();
    if ($("body>.nav").height() == 48) {
        $("body>.nav").css('height', '100')
    } else {
        $("body>.nav").css('height', '48')
    }
});

$("body").click(function () {

    $("body>.nav ul").hide();
    $("body>.nav").css('height', '48');
});
