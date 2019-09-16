$(function () {
    const username = $('#username').text();
    const message = document.getElementById('text');
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault();
     // if(e.keyCode == 13){
            socket.emit('chat message', {
                    username,
                    message: message.value,
                } 
            );
            message.value = '';
     // }else{
       //   socket.emit('escribiendo', {username})
     // }


    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<p>').text(msg.username + ": " + msg.message));
      });

  });