/* eslint-disable no-undef */
$(() => {
  const username = $('#username').text();
  const message = document.getElementById('text');
  const userTyping = document.getElementById('typingu');
  const room = $('#band').text();
  const socket = io();
  // eslint-disable-next-line no-console
  console.log(room);
  socket.on('connect', () => {
    socket.emit('room', { sala: room });
  });

  $('form').submit((e) => {
    e.preventDefault();
    socket.emit('chat message', {
      username,
      message: message.value,
      sala: room,
    });
    message.value = '';
  });

  socket.on('chat message', (msg) => {
    if (msg.username === username) {
      $('#messages').append($('<p class="user">').text(`${msg.username}: ${msg.message}`));
    } else {
      $('#messages').append($('<p class="other-user">').text(`${msg.username}: ${msg.message}`));
    }
  });

  message.addEventListener('keypress', () => {
    socket.emit('typing', { username, message: 'is typing...', sala: room });
  });

  socket.on('isTyping', (data) => {
    userTyping.innerText = `${data.username} ${data.message}`;
  });

  $('form').submit(() => {
    socket.emit('stopTyping', { sala: room });
  });
  socket.on('userstopTyping', () => {
    userTyping.innerText = '';
  });
  socket.on('all messages', (data) => {
    $.each(data, () => {
      $('#messages').append($('<p>').text(`${this.username}: ${this.message}`));
    });
  });
});
