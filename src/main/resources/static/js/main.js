"use strict";
window.onload = function () {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  const userNameForm = document.getElementById("usernameForm");
  const messageForm = document.getElementById("messageForm");
  const chatLog = document.getElementById("chatLog");

  userNameForm.addEventListener("submit", connect, true);
  messageForm.addEventListener("submit", sendMessage, true);

  let stompClient = null;
  let username = null;

  function connect(event) {
    event.preventDefault();
    username = document.getElementById("name").value.trim();
    if (username) {
      var socket = new SockJS("/ws");
      stompClient = Stomp.over(socket);
      stompClient.connect({}, onConnect, onError);
    }
  }

  function onConnect() {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.subscribe("/topic/drawingBoard", onPositionReceived);

    stompClient.send(
      "/app/chat.addUser",
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  }

  function onError() {
    window.alert("could not connect");
  }

  function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    console.log(message);

    const messageElement = document.createElement("li");

    if (message.type === "JOIN") {
      messageElement.textContent = message.sender + "joined";
    } else if (message.type === "LEAVE") {
      messageElement.textContent = message.sender + "has left!";
    } else if (message.type === "CHAT") {
      messageElement.textContent = message.sender + " : " + message.content;
    }

    chatLog.appendChild(messageElement);
  }

  function onPositionReceived(payload) {
    const position = JSON.parse(payload.body);
    // draw the line here
    if (position.type === "START_POINT") {
      context.beginPath();
      context.moveTo(position.x, position.y);
      
    } else if (position.type === "PATH_POINT") {
      context.lineTo(position.x, position.y);
      context.stroke();
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    let messageInput = document.getElementById("message");
    var messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
      var chatMessage = {
        sender: username,
        content: messageContent,
        type: "CHAT",
      };

      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      messageInput.value = "";
    }
  }

  let drawing = false;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    // context.beginPath();
    // context.moveTo(e.offsetX, e.offsetY);
    stompClient.send(
      "/app/draw.startPath",
      {},
      JSON.stringify({
        x: Math.floor(e.offsetX),
        y: Math.floor(e.offsetY),
        type: "START_POINT",
      })
    );
  });
  canvas.addEventListener("mouseup", function () {
    drawing = false;
  });
  canvas.addEventListener("mousemove", function (e) {
    if (drawing) {
      stompClient.send(
        "/app/draw.pathPoint",
        {},
        JSON.stringify({
          x: Math.floor(e.offsetX),
          y: Math.floor(e.offsetY),
          type: "PATH_POINT",
        })
      );
    }
  });
};
