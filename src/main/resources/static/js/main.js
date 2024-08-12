"use strict";
window.onload = function () {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  const userNameForm = document.getElementById("usernameForm");
  const messageForm = document.getElementById("messageForm");
  const chatLog = document.getElementById("chatLog");
  const playersList = document.getElementById("playersList");
  const roomIdElemnt = document.getElementById("roomIdDisplay");
  const clearCanvasButton = document.getElementById("clear");
  const colorPicker = document.getElementById("colorPicker");
  const lineWidth = document.getElementById("lineWidth");
  

  userNameForm.addEventListener("submit", connect, true);
  messageForm.addEventListener("submit", sendMessage, true);

  clearCanvasButton.onclick = clearDrawingBoard;
  colorPicker.onchange = changeStrokeColor;
  lineWidth.onchange = changeLineWidth;

  let stompClient = null;
  let username = null;
  let roomId = null;
  let drawing = false;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  document.querySelector(".gameWindow").classList.add("hidden");


  // console.log("seting width,height to:", canvas.width, canvas.height);

  context.lineWidth = 2;


  function connect(event) {
    event.preventDefault();
    username = document.getElementById("name").value.trim();
    roomId = document.getElementById("roomId").value.trim();
    console.log(username, roomId, "/////");

    if (username && roomId) {
      var socket = new SockJS("/ws");
      stompClient = Stomp.over(socket);
      stompClient.connect({}, onConnect, onError);
    }
  }

  async function onConnect() {
    stompClient.subscribe(`/topic/public/${roomId}`, onMessageReceived);
    stompClient.subscribe(
      `/topic/drawingBoard/${roomId}`,
      onDrawMessageReceived
    );

    roomIdElemnt.appendChild(document.createTextNode(roomId));

    await fetch(`/room/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((player) => {
          const playerElement = document.createElement("li");
          playerElement.textContent = player;
          playersList.appendChild(playerElement);
        });
      });

    // const playerElement = document.createElement("li");
    // playerElement.textContent = username + "  you";
    // playersList.appendChild(playerElement);

    stompClient.send(
      `/app/chat.addUser/${roomId}`,
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
    );
  }

  function onError() {
    window.alert("could not connect");
  }

  function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement("li");

    if (message.type === "JOIN") {
      document.getElementById("joinRoom").classList.add("hidden");
      document.querySelector(".gameWindow").classList.remove("hidden");
      messageElement.textContent = message.sender + " has joined";
      const playerElement = document.createElement("li");
      playerElement.textContent = message.sender;
      if (message.sender === username) playerElement.textContent += "  (you)";
      playersList.appendChild(playerElement);
    } else if (message.type === "LEAVE") {
      messageElement.textContent = message.sender + "has left!";
    } else if (message.type === "CHAT") {
      messageElement.textContent = message.sender + " : " + message.content;
    }

    chatLog.appendChild(messageElement);
  }

  function onDrawMessageReceived(payload) {
    const drawMessage = JSON.parse(payload.body);

    if (drawMessage.type === "START_POINT") {
      context.beginPath();
      context.moveTo(drawMessage.x, drawMessage.y);
    } else if (drawMessage.type === "PATH_POINT") {
      context.lineTo(drawMessage.x, drawMessage.y);
      context.stroke();
    } else if (drawMessage.type === "CLEAR") {
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else if (drawMessage.type === "COLOR") {
      context.strokeStyle = drawMessage.color;
    } else if (drawMessage.type === "LINE_WIDTH"){
      context.lineWidth = drawMessage.lineWidth;
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
        `/app/chat.sendMessage/${roomId}`,
        {},
        JSON.stringify(chatMessage)
      );
      messageInput.value = "";
    }
  }

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;

    stompClient.send(
      `/app/draw.startPath/${roomId}`,
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
        `/app/draw.pathPoint/${roomId}`,
        {},
        JSON.stringify({
          x: Math.floor(e.offsetX),
          y: Math.floor(e.offsetY),
          type: "PATH_POINT",
        })
      );
    }
  });

  function clearDrawingBoard(e) {
    stompClient.send(
      `/app/draw.clear/${roomId}`,
      {},
      JSON.stringify({
        type: "CLEAR",
      })
    );
  }
  function changeStrokeColor(e) {
    stompClient.send(
      `/app/draw.color/${roomId}`,
      {},
      JSON.stringify({
        color: e.target.value,
        type: "COLOR",
      })
    );
  }
  function changeLineWidth(e) {
    stompClient.send(
      `/app/draw.lineWidth/${roomId}`,
      {},
      JSON.stringify({
        lineWidth: e.target.value,
        type: "LINE_WIDTH",
      })
    );
  }
};
