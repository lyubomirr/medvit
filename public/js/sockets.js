 $(document).ready(function () {
     var socket = io.connect('185.177.23.134:80', {
                query: 'info=' + userId
     });

     socket.on('imagingUpdate', function (data) {
         console.log(data);
         $.notify({
             message: 'Ваша рентгенова заявка е изпълнена. <a href=\"/patient/' + data.body + '">Кликни тук</a> да я видиш.'
         }, {
             type: 'success',
             animate: {
                 enter: 'animated fadeInDown',
                 exit: 'animated fadeOutUp'
             }
         });
     });
 });
