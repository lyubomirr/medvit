 $(".hamburger").click(function () {
     $(".sidebar").toggleClass("hidden");
     $('.dashboard').toggleClass("hidden");
 });

 function removeAppointment(appointment) {
     $.get("/appointment/delete/" + appointment, function (data) {
         $("#" + appointment).remove();
     });
 }

 function editAppointment(appointment) {
     $.get("/appointment/" + appointment, function (data) {

         var date = new Date(data.date);
         var month = date.getMonth() + 1;
         var day = date.getDate();

         if (month < 10) month = '0' + month;
         if (day < 10) day = '0' + day;

         var newDate = date.getFullYear() + '-' + month + '-' + day;

         $('#appointment-date').val(newDate);
         $('#appointment-location').val(data.location);
         $('#appointment-type').val(data.type);
         $('#appointment-status').val(data.status);
         $('#appointment-notes').val(data.notes);
         $('#appointment-form').attr('action', '/appointment/edit/' + appointment);
     });
 }

 function removeMedication(medication) {
     $.get("/medication/delete/" + medication, function (data) {
         $("#" + medication).remove();
     });
 }
 function editMedication(medication) {
   $.get("/medication/" + medication, function (data) {
       $('#medication-name').val(data.name);
       $('#medication-status').val(data.status);
       $('#medication-prescription').val(data.prescription);
       $('#medication-form').attr('action', '/medication/edit/' + medication);
   });

 }

 function removePatient(patient) {
     $.get("/patient/delete/" + patient, function (data) {
         $("#" + patient).remove();
     });
 }

 function removeImaging(imaging) {
     $.get("/imaging/delete/" + imaging, function (data) {
         $("#" + imaging).remove();
     });
 }

 function editImaging(imaging) {
     $.get("/imaging/" + imaging, function (data) {
         $('#imaging-result').val(data.result);
         $('#imaging-type').val(data.type);
         $('#imaging-notes').val(data.notes);
         $('#imaging-form').attr('action', '/imaging/edit/' + imaging);
     });
 }

 function removeLab(lab) {
     $.get("/lab/delete/" + lab, function (data) {
         $("#" + lab).remove();
     });
 }

 function editLab(lab) {
     $.get("/lab/" + lab, function (data) {
         $('#lab-result').val(data.result);
         $('#lab-type').val(data.lab_type);
         $('#lab-status').val(data.status);
         $('#lab-notes').val(data.notes);
         $('#lab-form').attr('action', '/lab/edit/' + lab);
     });
 }

 function removeFamilyMember(familyMember) {
     $.get("/familymember/delete/" + familyMember, function (data) {
         $("#" + familyMember).remove();
     });
 }

 function editFamilyMember(familyMember) {
     $.get("/familyMember/" + familyMember, function (data) {
         $('#family-member-name').val(data.name);
         $('#family-member-age').val(data.age);
         $('#family-member-civil-status').val(data.civil_status);
         $('#family-member-relationship').val(data.relationship);
         $('#family-member-education').val(data.education);
         $('#family-member-occupation').val(data.occupation);
         $('#family-member-income').val(data.income);
         $('#family-member-insurance').val(data.insurance);
         $('#family-member-form').attr('action', '/familymember/edit/' + familyMember);
     });
 }


 function removeExpense(expense) {
     $.get("/expense/delete/" + expense, function (data) {
         $("#" + expense).remove();
     });
 }

 function editExpense(expense) {
     $.get("/expense/" + expense, function (data) {
         $('#expense-category').val(data.category);
         $('#expense-sources').val(data.sources);
         $('#expense-monthly-cost').val(data.monthly_cost);
         $('#expense-form').attr('action', '/expense/edit/' + expense);
     });
 }

 function removeAllergy(patientid, allergy) {
     $.get("/patient/" + patientid + "/removeallergy/" + allergy, function (data) {
         $("#" + allergy).remove();
     });
 }

 function removeEmployee(employeeid) {
     $.get("/employee/delete/" + employeeid, function (data) {
         $("#" + employeeid).remove();
     });
 }

 function addNewPost() {
     $.post("/post", {
             postContent: $('#postContent').val()
         })
         .done(function (newPost) {
             if ($('#no-posts').length) {
                 $('#no-posts').remove();
             }
             $('#postContent').val("");
             $('.posts').prepend("<div class='single-post' id='" + newPost._id + "'><img src='" + newPost.poster.image + "' class='rounded float-left'><div class='offset-lg-2 col-lg-10 single-post-content'><p><i class='fa fa-times-circle delete-post' aria-hidden='true' onclick='removePost(\"" + newPost._id + "\")'></i><span class='post-body'> </span></p><span class='post-info'>" + jQuery.timeago(Date.now()) + " by <a href='#' class='feed-poster'>" + newPost.poster.first_name + " " + newPost.poster.last_name + "</a></span></div><hr /></div>");
             $('.post-body').first().text(newPost.body);
         });
     return false;
 }

 function removePost(postid) {
     $.get("/post/delete/" + postid, function (data) {
         $("#" + postid).remove();
         if (!$('.single-post').length) {
             $('.posts').append("<div class='single-post'><div class='col-lg-12 single-post-content'><p id='no-posts'>Все още няма постове.</p></div><hr /></div>");
         };
     });
 }
