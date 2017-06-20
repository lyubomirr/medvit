$(document).ready(function () {
    $(".clickable-row td").not(':last-child').click(function () {
        window.document.location = $(this).data("href");
    });

    $('#addPatient').click(function () {
        $('#addPatientForm').submit();
    });

    var firstHiddenGroup = $('.first-hidden-group');
    var secondHiddenGroup = $('.second-hidden-group');
    var thirdHiddenGroup = $('.third-hidden-group');
    var fourthHiddenGroup = $('.fourth-hidden-group');

    secondHiddenGroup.hide();
    thirdHiddenGroup.hide();
    fourthHiddenGroup.hide();

    $("button.first-hidden-group").click(function (event) {
        event.preventDefault();
        if ($('#first_name')[0].checkValidity() == false) {
            alert("Моля попълнете полето 'Собствено име'");
        } else if ($('#last_name')[0].checkValidity() == false) {
            alert("Моля попълнете полето 'Фамилия'");
        } else {
            firstHiddenGroup.hide();
            secondHiddenGroup.fadeIn();
        }
    });

    $("button.second-hidden-group").click(function (event) {
        event.preventDefault();
        secondHiddenGroup.hide();
        thirdHiddenGroup.fadeIn();
    });

    $("button.third-hidden-group").click(function (event) {
        event.preventDefault();
        if ($('#egn')[0].checkValidity() == false) {
            alert("Моля попълнете полето 'ЕГН'");
        } else {
            thirdHiddenGroup.hide();
            fourthHiddenGroup.fadeIn();
        }
    });

    var inpObj = document.getElementById("first_name");
});
