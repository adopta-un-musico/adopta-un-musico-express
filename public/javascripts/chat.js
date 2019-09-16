$(function () {
    const username = $('#username').text();
    const message = document.getElementById('text');
    const userTyping = document.getElementById('typingu');
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
    
    message.addEventListener('keypress', () => {
        socket.emit('typing', {username, message: "is typing..."})
      });  

    socket.on('isTyping', data =>{
      userTyping.innerText = data.username + " " + data.message;
    });

    message.addEventListener('keyup', () =>{
      socket.emit('stopTyping');
    });
    socket.on('userstopTyping', () =>{
      userTyping.innerHTML = "";
    });
});