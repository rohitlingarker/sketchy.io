import WebSocketHandler from "./WebSocketHandler.js";
import CanvasHandler from "./CanvasHandler.js";
import { setupEventListeners, endTurn } from "./eventListeners.js";
import {
  createIsDrawingElement,
  provideChoices,
  showDashedWord,
  showWord,
  checkIfAllGuessedWord,
} from "./drawUitls.js";

window.onload = function () {
  const canvas = document.getElementById("canvas1");
  let username = null;
  let roomId = null;
  const chatLog = document.getElementById("chatLog");
  const playersList = document.getElementById("playersList");
  const roomIdElement = document.getElementById("roomIdDisplay");
  const playerList = {};
  const userNameForm = document.getElementById("usernameForm");

  userNameForm.addEventListener("submit", connect, true);

  let webSocketHandler = null;
  let canvasHandler = null;

  const isDrawingElement = createIsDrawingElement();

  function connect(e) {
    e.preventDefault();
    username = document.getElementById("name").value.trim();
    roomId = document.getElementById("roomId").value.trim();
    canvasHandler = new CanvasHandler(canvas);
    webSocketHandler = new WebSocketHandler(roomId, username);

    webSocketHandler.connect(onConnect, onError);
    canvasHandler.setupCanvas();
    setupEventListeners(canvasHandler, webSocketHandler, roomId);
  }

  async function onConnect() {
    webSocketHandler.subscribe(`/topic/public/${roomId}`, onMessageReceived);
    webSocketHandler.subscribe(
      `/topic/drawingBoard/${roomId}`,
      onDrawMessageReceived
    );
    // webSocketHandler.subscribe(
    //   `/topic/drawingBoard/${roomId}/${username}`,
    //   onPersonalMessageReceived
    // );

    roomIdElement.textContent = roomId;

    await fetch(`/room/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((player) => {
          const playerElement = document.createElement("li");
          playerElement.textContent = player.username;
          playersList.appendChild(playerElement);
          playerList[player.username] = {
            playerElement,
            hasGuessed: player.hasGuessed,
          };
        });
      });

    webSocketHandler.sendMessage(`/app/chat.addUser/${roomId}`, {
      sender: username,
      type: "JOIN",
    });
  }

  function onError() {
    window.alert("Could not connect");
  }

  function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const messageElement = document.createElement("li");

    if (message.type === "JOIN") {
      document.getElementById("joinRoom").classList.add("hidden");
      document.querySelector(".gameWindow").classList.remove("hidden");

      messageElement.textContent = `${message.sender} has joined`;
      const playerElement = document.createElement("li");
      playerElement.textContent = message.sender;
      if (message.sender === username) playerElement.textContent += "  (you)";

      playersList.appendChild(playerElement);
      playerList[message.sender] = { playerElement, hasGuessed: false };
    } else if (message.type === "LEAVE") {
      messageElement.textContent = `${message.sender} has left!`;
      playersList.removeChild(playerList[message.sender].playerElement);
      delete playerList[message.sender];
    } else if (message.type === "CHAT") {
      messageElement.textContent = `${message.sender} : ${message.content}`;
    } else if (message.type === "CORRECT_GUESS") {
      messageElement.textContent = `${message.sender} : Correct Guess!`;
      playerList[message.sender].hasGuessed = true;
      showWord(message.content);
      if (checkIfAllGuessedWord(playerList) & webSocketHandler.turn)
        // webSocketHandler.turn = false;
        endTurn(canvasHandler, webSocketHandler, roomId);
    }

    chatLog.appendChild(messageElement);
  }

  function onDrawMessageReceived(payload) {
    const drawMessage = JSON.parse(payload.body);

    switch (drawMessage.type) {
      case "START_POINT":
        if (!webSocketHandler.turn) {
          canvasHandler.startDrawing(drawMessage.x, drawMessage.y);
        }
        break;

      case "PATH_POINT":
        if (!webSocketHandler.turn) {
          canvasHandler.drawPath(drawMessage.x, drawMessage.y);
        }
        break;

      case "CLEAR":
        if (!webSocketHandler.turn) {
          canvasHandler.clearCanvas();
        }
        break;

      case "COLOR":
        if (!webSocketHandler.turn) {
          canvasHandler.changeColor(drawMessage.color);
        }
        break;

      case "LINE_WIDTH":
        if (!webSocketHandler.turn) {
          canvasHandler.changeLineWidth(drawMessage.lineWidth);
        }
        break;

      case "END_TURN":
        if (drawMessage.player.username === username) {
          webSocketHandler.turn = true;
          Object.keys(playerList).forEach((key) => {
            playerList[key].hasGuessed = false;
          });
          playerList[username].hasGuessed = true;
          provideChoices(drawMessage.words, webSocketHandler);
        }
        if (isDrawingElement.parentElement) {
          isDrawingElement.parentElement.removeChild(isDrawingElement);
        }
        const drawingPlayer =
          playerList[drawMessage.player.username].playerElement;
        drawingPlayer.appendChild(isDrawingElement);
        break;

      case "END_GAME":
        canvasHandler.clearCanvas();
        const gameOverElement = document.createElement("div");
        gameOverElement.textContent = "Game Over!";
        chatLog.appendChild(gameOverElement);
        break;

      case "WORD_CHOICE":
        console.log("word is of length: ", drawMessage.x);
        if (webSocketHandler.turn) {
          showWord(drawMessage.words[0]);
        } else {
          showDashedWord(drawMessage.x);
        }
        break;

      default:
        console.error("Unknown drawMessage type:", drawMessage.type);
    }
  }
};
