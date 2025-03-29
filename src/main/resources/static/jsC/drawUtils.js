function createIsDrawingElement() {
  const isDrawingElement = document.createElement("span");
  isDrawingElement.id = "isDrawingElement";
  isDrawingElement.textContent = " is Drawing";
  return isDrawingElement;
}

function handleChoice(e, webSocketHandler) {
  document.getElementById("choices").classList.add("hidden");
  const choice = e.target.textContent;
  webSocketHandler.sendMessage(
    `/app/draw.wordChoice/${webSocketHandler.roomId}`,
    {
      words: [choice],
      type: "WORD_CHOICE",
    }
  );
}

function provideChoices(words, webSocketHandler) {
  const choices = document.getElementById("choices");
  choices.classList.remove("hidden");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const choice = choices.children[i];
    choice.onclick = (e) => {
      handleChoice(e, webSocketHandler);
    };
    choice.textContent = word;
  }
}

function showDashedWord(word) {
  const wordElement = document.getElementById("word");
  wordElement.textContent = word.replace(/\S/g,"_")
  
}

function showWord(word) {
  const wordElement = document.getElementById("word");
  wordElement.textContent = word;
}

function checkIfAllGuessedWord(playerList) {
  Object.keys(playerList).forEach((key) => {
    if (playerList[key].hasGuessed == false) {
      return false;
    }
  });
  return true;
}

export {
  createIsDrawingElement,
  provideChoices,
  showDashedWord,
  showWord,
  checkIfAllGuessedWord,
};
