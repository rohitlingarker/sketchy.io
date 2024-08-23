function setupEventListeners(canvasHandler, webSocketHandler, roomId) {
  const canvas = canvasHandler.canvas;

  canvas.addEventListener("mousedown", (e) =>
    onMouseDown(e, canvasHandler, webSocketHandler, roomId)
  );
  canvas.addEventListener("mousemove", (e) =>
    onMouseMove(e, canvasHandler, webSocketHandler, roomId)
  );
  canvas.addEventListener("mouseup", () => onMouseUp(canvasHandler));

  document
    .getElementById("clear")
    .addEventListener("click", () =>
      clearCanvas(canvasHandler, webSocketHandler, roomId)
    );
  document
    .getElementById("colorPicker")
    .addEventListener("change", (e) =>
      changeStrokeColor(e, webSocketHandler, roomId)
    );
  document
    .getElementById("lineWidth")
    .addEventListener("change", (e) =>
      changeLineWidth(e, webSocketHandler, roomId)
    );

  document
    .getElementById("messageForm")
    .addEventListener("submit", (e) =>
      sendMessage(e, webSocketHandler, roomId)
    );

  document
    .getElementById("nextTurnBtn")
    .addEventListener("click", () =>
      endTurn(canvasHandler, webSocketHandler, roomId)
    );
}

function onMouseDown(e, canvasHandler, webSocketHandler, roomId) {
  canvasHandler.isDrawing = true;
  if (webSocketHandler.turn) {
    canvasHandler.startDrawing(e.offsetX, e.offsetY);
    webSocketHandler.sendMessage(`/app/draw.startPath/${roomId}`, {
      x: Math.floor(e.offsetX),
      y: Math.floor(e.offsetY),
      type: "START_POINT",
    });
  }
}

function onMouseMove(e, canvasHandler, webSocketHandler, roomId) {
  if (canvasHandler.isDrawing & webSocketHandler.turn) {
    canvasHandler.drawPath(e.offsetX, e.offsetY);
    webSocketHandler.sendMessage(`/app/draw.pathPoint/${roomId}`, {
      x: Math.floor(e.offsetX),
      y: Math.floor(e.offsetY),
      type: "PATH_POINT",
    });
  }
}

function onMouseUp(canvasHandler) {
  canvasHandler.isDrawing = false;
}

function clearCanvas(canvasHandler, webSocketHandler, roomId) {
  if (webSocketHandler.turn) {
    canvasHandler.clearCanvas();
    webSocketHandler.sendMessage(`/app/draw.clear/${roomId}`, {
      type: "CLEAR",
    });
  }
}

function changeStrokeColor(e, webSocketHandler, roomId) {
  if (webSocketHandler.turn) {
    canvasHandler.changeColor(e.target.value);
    webSocketHandler.sendMessage(`/app/draw.color/${roomId}`, {
      color: e.target.value,
      type: "COLOR",
    });
  }
}

function changeLineWidth(e, webSocketHandler, roomId) {
  if (webSocketHandler.turn) {
    canvasHandler.changeLineWidth(e.target.value);
    webSocketHandler.sendMessage(`/app/draw.lineWidth/${roomId}`, {
      lineWidth: e.target.value,
      type: "LINE_WIDTH",
    });
  }
}

function endTurn(canvasHandler, webSocketHandler, roomId) {
  console.log("Ending turn and getting next turn");
  canvasHandler.isDrawing = false;
  clearCanvas(canvasHandler, webSocketHandler, roomId);
  webSocketHandler.turn = false;
  webSocketHandler.sendMessage(`/app/draw.endTurn/${roomId}`, {
    type: "END_TURN",
  });
}

function sendMessage(e, webSocketHandler, roomId) {
  e.preventDefault();
  webSocketHandler.sendMessage(`/app/chat.sendMessage/${roomId}`, {
    sender: webSocketHandler.username,
    content: e.target[0].value,
    type: "CHAT",
  });
  e.target[0].value = "";
}

export { endTurn, setupEventListeners };
