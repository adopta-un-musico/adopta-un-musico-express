$(function() {
  const username = $("#username").text();
  const message = document.getElementById("text");
  const userTyping = document.getElementById("typingu");
  const room = $("#band").text();
  var socket = io();
  console.log(room);
  socket.on("connect", () => {
    socket.emit("room", { sala: room });
  });

  $("form").submit(function(e) {
    e.preventDefault();
    socket.emit("chat message", {
      username,
      message: message.value,
      sala: room
    });
    message.value = "";
  });

  socket.on("chat message", msg => {
    $("#messages").append($("<p>").text(msg.username + ": " + msg.message));
  });

  message.addEventListener("keypress", () => {
    socket.emit("typing", { username, message: "is typing...", sala: room });
  });

  socket.on("isTyping", data => {
    userTyping.innerText = data.username + " " + data.message;
  });

  $("form").submit(() => {
    socket.emit("stopTyping", { sala: room });
  });
  socket.on("userstopTyping", () => {
    userTyping.innerText = "";
  });
});
