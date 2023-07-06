import { Confettiful } from "./congratulation.js";
const dashboardMenu = document.querySelector(".startGame");
const selectionButtons = document.querySelectorAll(".startGame .buttonsContainer button");
const submitDashboard = document.querySelector(".startGame .startGameContainer .submitDashboard button");
const gameBoard = document.querySelector(".gameBoard");
const gridContainer = document.querySelector(".gameBoard .gridContainer");
const gameScore = document.querySelector(".gameBoard .gameScore");
const gameStatusModal = document.getElementById("gameStatus");
const restartGameStatusBtn = gameStatusModal.querySelector(".restart");
const choiceCard = document.createElement("div");
const menuList = document.getElementById("menuList");
const restartMenuList = menuList.querySelector(".restart");
const menuButton = document.querySelector(".gameOptions button:last-child");
const resumeButton = document.querySelector("#menuList .modal-body button:last-child");
const newGameButtons = document.querySelectorAll(".newGame");
const showCongratulations = new Confettiful(gameStatusModal);
choiceCard.classList.add("choice");
const gameIcons = {
    "type": "fa-solid",
    "icons": [
        "fa-anchor", "fa-bug", "fa-flask", "fa-futbol", "fa-hand-spock",
        "fa-wine-bottle", "fa-moon", "fa-snowflake", "fa-sun", "fa-car"
    ]
};
const restartButtons = document.querySelectorAll(".restart");
const newGameMenuList = menuList.querySelector(".newGame");
const newGameGameStatus = gameStatusModal.querySelector(".newGame");
const soloModeHTMLTags = `
<div class="time">
<!-- replace player1 with time -->
<p>

</p>
<p >
    <span class="minutes">0</span>
    <span class="colon">:</span>
    <span class="seconds">00</span>
    <span>0</span>
</p>
</div>
<div class="moves">
<!-- replace player2 with moves -->
  <p>

  </p>
  <p >
      0
  </p>
</div>
<div class="player3 d-none ">
<!-- display none in solo -->
<p>

</p>
<p >
    0
</p>
</div>
<div class="player4 d-none ">
<!-- display none in solo -->
<p>

</p>
<p >
  0
</p>
</div>
`;
let dashboardSelections = { "theme": "numbers", "playerNumbers": 1, "gridSize": 4 };
let selectedPairs = [];
let movesToSloveGame = 0;
let playerScores = [0, 0, 0, 0];
let nextTurn = 1;
let singleSecondsCounter = 0;
let tensSecondsCounter = 0;
let minutesCounter = 0;
let intervalId;
selectionButtons.forEach((ele) => {
    ele.addEventListener("click", () => {
        if (!ele.classList.contains("active")) {
            ele.parentElement.querySelectorAll("button").forEach((ele) => {
                ele.classList.replace("active", "idle");
            });
            ele.classList.replace("idle", "active");
            if (ele.parentElement.parentElement.classList.contains("themeMenu")) {
                const themeMenu = ele.innerHTML.trim().toLowerCase();
                dashboardSelections.theme = themeMenu;
            }
            else if (ele.parentElement.parentElement.classList.contains("playersNumbers")) {
                const playersNumbers = ele.innerHTML.trim();
                dashboardSelections.playerNumbers = +playersNumbers;
            }
            else if (ele.parentElement.parentElement.classList.contains("gridSize")) {
                const gridSize = ele.innerHTML.trim();
                ;
                gridSize.includes("4") ? dashboardSelections.gridSize = 4 : dashboardSelections.gridSize = 6;
            }
            //    console.log(dashboardSelections)
        }
    });
});
submitDashboard.addEventListener("click", () => {
    document.querySelector("main").classList.add("gameBoardMain");
    setGridSystem(gridContainer, dashboardSelections);
    fillGridSystem(dashboardSelections);
    const choices = document.querySelectorAll(".choice");
    choices.forEach((ele) => {
        ele.addEventListener("click", () => {
            if ((!ele.classList.toString().includes("selected")) && (!ele.classList.toString().includes("solved"))) {
                ele.classList.add("selected");
                selectedPairs.push(ele);
                ele.children[0].classList.remove("d-none");
                // console.log(selectedPairs)
            }
            if (selectedPairs.length == 2) {
                movesToSloveGame++;
                if (dashboardSelections.playerNumbers > 1) {
                    if (nextTurn < dashboardSelections.playerNumbers) {
                        ++nextTurn;
                    }
                    else {
                        nextTurn = 1;
                    }
                }
                stopPointerEvent(choices);
                if ((selectedPairs[0].children[0].classList.toString() === selectedPairs[1].children[0].classList.toString()) && (selectedPairs[0].children[0].textContent === selectedPairs[1].children[0].textContent)) {
                    let currentPlayerTurn = nextTurn - 1;
                    let oldPlayerScore;
                    if (currentPlayerTurn === 0) {
                        oldPlayerScore = playerScores[dashboardSelections.playerNumbers - 1];
                        playerScores[dashboardSelections.playerNumbers - 1] = ++oldPlayerScore;
                    }
                    else {
                        oldPlayerScore = playerScores[currentPlayerTurn - 1];
                        playerScores[currentPlayerTurn - 1] = ++oldPlayerScore;
                    }
                    setTimeout(() => {
                        selectedPairs.forEach((ele) => {
                            ele.classList.replace("selected", "solved");
                            selectedPairs = [];
                            if (dashboardSelections.playerNumbers === 1) {
                                gameScore.querySelector(".moves p:nth-child(2)").textContent = movesToSloveGame + "";
                            }
                            else {
                                //   gameScore.querySelector(`.player${nextTurn-1}.turn`)!.children[1]!.textContent=score+"";
                                if (currentPlayerTurn === 0) {
                                    gameScore.querySelector(`.player${dashboardSelections.playerNumbers}`).children[1].textContent = playerScores[dashboardSelections.playerNumbers - 1] + "";
                                    gameScore.querySelector(`.player${dashboardSelections.playerNumbers}`).classList.remove("turn");
                                }
                                else {
                                    gameScore.querySelector(`.player${currentPlayerTurn}`).children[1].textContent = playerScores[currentPlayerTurn - 1] + "";
                                    gameScore.querySelector(`.player${currentPlayerTurn}`).classList.remove("turn");
                                }
                                gameScore.querySelector(`.player${nextTurn}`).classList.add("turn");
                            }
                        });
                    }, 800);
                    // showResults
                    setTimeout(() => {
                        let solvedChoice = document.querySelectorAll(".choice.solved");
                        if (solvedChoice.length === dashboardSelections.gridSize ** 2) {
                            if (dashboardSelections.playerNumbers > 1) {
                                let scoreDetails = document.querySelectorAll(".scoreDetails");
                                const playerNumbers = playerScores.slice(0, dashboardSelections.playerNumbers);
                                const MaxScore = Math.max(...playerScores);
                                scoreDetails.forEach((ele, index) => {
                                    if (index < 2) {
                                        ele.classList.add("d-none");
                                    }
                                    else if (index < dashboardSelections.playerNumbers + 2) {
                                        ele.classList.remove("d-none");
                                        const playerScoreIndex = index - 2;
                                        const playerScore = playerScores[playerScoreIndex];
                                        ele.children[1].querySelector(".score").textContent = playerScores[playerScoreIndex] + "";
                                        if (playerScore === MaxScore) {
                                            ele.classList.add("winner");
                                            document.querySelector(".winMessage").textContent = `Player ${playerScoreIndex + 1} Wins!`;
                                        }
                                    }
                                });
                                if (document.querySelectorAll(".winner").length > 1) {
                                    document.querySelector(".winMessage").textContent = "It’s a tie!";
                                }
                                gameStatusModal.classList.remove("d-none");
                                gameStatusModal.classList.add("show", "d-block");
                                showCongratulations._renderConfetti();
                            }
                            else {
                                clearInterval(intervalId);
                                document.querySelectorAll(".scoreDetails").forEach((ele, index) => {
                                    if (index < 2) {
                                        ele.classList.remove("d-none");
                                    }
                                });
                                let timeSpans = document.querySelectorAll(".time span:not(:last-child)");
                                let elapsedTime = "";
                                timeSpans.forEach((ele) => {
                                    elapsedTime = elapsedTime + ele.textContent.trim();
                                });
                                document.querySelector(".scoreDetails:first-child  .score +span").textContent = elapsedTime;
                                document.querySelector(".scoreDetails:nth-child(2) .score +span").textContent = movesToSloveGame + '';
                                gameStatusModal.classList.remove("d-none");
                                gameStatusModal.classList.add("show", "d-block");
                                showCongratulations._renderConfetti();
                            }
                        }
                    }, 800);
                }
                else {
                    // console.log(selectedPairs)
                    setTimeout(() => {
                        selectedPairs.forEach((ele) => {
                            ele.classList.remove("selected");
                            ele.children[0].classList.add("d-none");
                            selectedPairs = [];
                            if (dashboardSelections.playerNumbers === 1) {
                                gameScore.querySelector(".moves p:nth-child(2)").textContent = movesToSloveGame + "";
                            }
                            else {
                                gameScore.querySelector(".turn").classList.remove("turn");
                                gameScore.children[0].children[nextTurn - 1].classList.add("turn");
                            }
                        });
                    }, 800);
                }
                // change turn and score
            }
        });
    });
    setPlayerNumbers(dashboardSelections);
    if (dashboardSelections.playerNumbers === 1) {
        //   incrementTimer();
        intervalId = setTimer();
    }
    showGameBoard();
});
menuButton.addEventListener(("click"), onClickMenu);
resumeButton.addEventListener("click", onClickResume);
restartButtons.forEach((ele) => {
    ele.addEventListener("click", restart);
});
newGameButtons.forEach((ele) => {
    ele.addEventListener("click", newGame);
});
restartMenuList.addEventListener("click", () => {
    menuList.classList.remove("d-block");
    menuList.classList.add("d-none");
});
restartGameStatusBtn.addEventListener("click", () => {
    gameStatusModal.classList.remove("d-block", "show");
    gameStatusModal.classList.add("d-none");
});
newGameMenuList.addEventListener("click", () => {
    menuList.classList.remove("d-block", "show");
    menuList.classList.add("d-none");
});
newGameGameStatus.addEventListener("click", () => {
    gameStatusModal.classList.remove("d-block", "show");
    gameStatusModal.classList.add("d-none");
});
function setGridSystem(gridContainer, dashboardSelections) {
    gridContainer.classList.add(dashboardSelections.theme, `grid-${dashboardSelections.gridSize}x${dashboardSelections.gridSize}`);
    for (let i = 0; i < dashboardSelections.gridSize * dashboardSelections.gridSize; ++i) {
        const choice = choiceCard.cloneNode(true);
        if (dashboardSelections.theme === "icons") {
            const icon = document.createElement("i");
            icon.classList.add(`${gameIcons.type}`, `d-none`);
            choice.appendChild(icon);
            gridContainer.append(choice);
        }
        else {
            const span = document.createElement("span");
            span.classList.add("d-none");
            choice.appendChild(span);
            gridContainer.append(choice);
        }
    }
}
function showGameBoard() {
    dashboardMenu.classList.add("d-none");
    gameBoard.classList.remove("d-none");
    document.body.style.backgroundColor = "#FCFCFC";
}
function setPlayerNumbers(dashboardSelections) {
    if (dashboardSelections.playerNumbers > 1) {
        gameScore.children[0].classList.replace("solo", "multi");
        const allPlayers = gameScore.children[0].children;
        for (let i = 0; i < dashboardSelections.playerNumbers; i++) {
            allPlayers[i].setAttribute("class", `player${i + 1}`);
            if (i === 0) {
                allPlayers[i].classList.add("turn");
                allPlayers[i].classList.replace("time", `player${i}`);
            }
        }
        const hiddenElements = gameScore.children[0].querySelectorAll(".d-none");
        // console.log(hiddenElements)
        if (allPlayers.length - hiddenElements.length > 2) {
            gameScore.children[0].classList.remove("d-45");
            gameScore.children[0].classList.replace("t-50", "t-100");
        }
    }
}
function randomSet(arrLength, range) {
    const arr = [];
    while (arr.length !== arrLength) {
        const randomIndex = Math.floor(Math.random() * range);
        if (!arr.includes(randomIndex)) {
            arr.push(randomIndex);
        }
    }
    return arr;
}
function setRandomPositions(dashboardSelections) {
    const choicesNumber = dashboardSelections.gridSize * dashboardSelections.gridSize;
    const choicesIndices = [];
    const randomIcons = [];
    let range = choicesNumber / 2;
    for (let i = 0; i < choicesNumber; i++) {
        choicesIndices.push(i);
    }
    if (choicesNumber / 2 > gameIcons.icons.length) {
        let counter = Math.ceil((choicesNumber / 2) / gameIcons.icons.length);
        // console.log(counter)
        range = (choicesNumber / 2) / counter;
        for (let i = 0; i < counter; i++) {
            const randomIconsIndices = randomSet(range, gameIcons.icons.length);
            randomIconsIndices.forEach((ele) => {
                randomIcons.push(gameIcons.icons[ele]);
            });
        }
    }
    else {
        const randomIconsIndices = randomSet(range, gameIcons.icons.length);
        randomIconsIndices.forEach((ele) => {
            randomIcons.push(gameIcons.icons[ele]);
        });
    }
    const quesionsIndices = randomSet(choicesNumber / 2, choicesNumber);
    const answerIndices = choicesIndices.filter((ele) => {
        return !quesionsIndices.includes(ele);
    });
    const randomNumbers = quesionsIndices.map((ele) => {
        return ele + 1 + "";
    });
    // console.log(setIconsOrNumbers(dashboardSelections,quesionsIndices,answerIndices,randomIcons,randomNumbers))
    return setIconsOrNumbers(dashboardSelections, quesionsIndices, answerIndices, randomIcons, randomNumbers);
}
function setIconsOrNumbers(dashboardSelections, quesionsIndices, answerIndices, randomIcons, randomNumbers) {
    const resultArray = [];
    let randomElement;
    if (dashboardSelections.theme === "icons") {
        randomElement = randomIcons;
    }
    else if (dashboardSelections.theme === "numbers") {
        randomElement = randomNumbers;
    }
    quesionsIndices.forEach((ele, index) => {
        let resultObj = { "index": ele, "theme": randomElement[index] };
        resultArray.push(resultObj);
    });
    answerIndices.forEach((ele, index) => {
        let resultObj = { "index": ele, "theme": randomElement[index] };
        resultArray.push(resultObj);
    });
    return resultArray;
}
function fillGridSystem(dashboardSelections) {
    const allChoices = gridContainer.querySelectorAll(".choice");
    const randomFill = setRandomPositions(dashboardSelections);
    if (dashboardSelections.theme === "icons") {
        randomFill.forEach((ele) => {
            const icon = allChoices[ele.index].querySelector("i");
            //    icon!.classList.add(ele.theme);
            icon.setAttribute("class", `${ele.theme} ${gameIcons.type} d-none`);
        });
    }
    else {
        randomFill.forEach((ele) => {
            const span = allChoices[ele.index].querySelector("span");
            span.classList.add("d-none");
            span.innerText = ele.theme;
        });
    }
}
function stopPointerEvent(choices) {
    choices.forEach((ele) => {
        ele.setAttribute("style", "pointer-events:none;");
        // console.log(ele)
    });
    setTimeout(() => {
        choices.forEach((ele) => {
            ele.removeAttribute("style");
        });
    }, 800);
}
function setTimer() {
    let timer = setInterval(() => {
        incrementTimer();
    }, 1000);
    return timer;
}
function incrementTimer() {
    if ((singleSecondsCounter <= 9)) {
        ++singleSecondsCounter;
    }
    if (singleSecondsCounter === 10) {
        if (tensSecondsCounter < 5) {
            singleSecondsCounter = 0;
            ++tensSecondsCounter;
        }
        else {
            ++minutesCounter;
            singleSecondsCounter = 0;
            tensSecondsCounter = 0;
        }
    }
    gameScore.querySelector(".seconds").textContent = tensSecondsCounter + "" + singleSecondsCounter;
    gameScore.querySelector(".minutes").textContent = "" + minutesCounter;
}
function resetTimer() {
    gameScore.querySelector(".seconds").textContent = 0 + "" + 0;
    gameScore.querySelector(".minutes").textContent = "" + 0;
}
function onClickMenu() {
    // stop timer
    if (dashboardSelections.playerNumbers === 1) {
        clearInterval(intervalId);
    }
    menuList.classList.remove("d-none");
    menuList.classList.add("d-block", "show");
}
function onClickResume() {
    if (dashboardSelections.playerNumbers === 1) {
        // incrementTimer();
        intervalId = setTimer();
    }
    menuList.classList.remove("d-block", "show");
    menuList.classList.add("d-none");
}
function restart() {
    showCongratulations._stopAnimation();
    selectedPairs = [];
    movesToSloveGame = 0;
    playerScores = [0, 0, 0, 0];
    nextTurn = 1;
    singleSecondsCounter = 0;
    tensSecondsCounter = 0;
    minutesCounter = 0;
    if (document.querySelectorAll(".winner").length !== 0) {
        document.querySelectorAll(".winner").forEach((ele) => {
            ele.classList.remove("winner");
        });
    }
    const choices = document.querySelectorAll(".choice");
    choices.forEach((ele) => {
        ele.classList.remove("solved", "selected");
    });
    fillGridSystem(dashboardSelections);
    if (dashboardSelections.playerNumbers === 1) {
        resetTimer();
        clearInterval(intervalId);
        intervalId = setTimer();
        gameScore.querySelector(".moves p:nth-child(2)").textContent = "0";
    }
    else {
        const playersScore = gameScore.querySelectorAll("p:nth-child(2)");
        const players = document.querySelectorAll(".multi >div");
        players.forEach((ele, index) => {
            if (index === 0) {
                if (!ele.classList.toString().includes("turn")) {
                    ele.classList.add("turn");
                }
            }
            else {
                ele.classList.remove("turn");
            }
        });
        playersScore.forEach((ele) => {
            ele.textContent = "0";
        });
    }
}
function newGame() {
    showCongratulations._stopAnimation();
    selectedPairs = [];
    movesToSloveGame = 0;
    playerScores = [0, 0, 0, 0];
    nextTurn = 1;
    singleSecondsCounter = 0;
    tensSecondsCounter = 0;
    minutesCounter = 0;
    document.querySelector("main").classList.remove("gameBoardMain");
    document.querySelector(".winMessage").textContent = "You did it!";
    document.querySelectorAll(".scoreDetails").forEach((ele) => {
        ele.setAttribute("class", "scoreDetails d-none");
    });
    if (dashboardSelections.playerNumbers === 1) {
        resetTimer();
        clearInterval(intervalId);
        gameScore.querySelector(".moves p:nth-child(2)").textContent = "0";
    }
    else {
        const playersScore = gameScore.querySelectorAll("p:nth-child(2)");
        const players = document.querySelectorAll(".multi >div");
        players.forEach((ele, index) => {
            if (index === 0) {
                if (!ele.classList.toString().includes("turn")) {
                    ele.classList.add("turn");
                }
            }
            else {
                ele.classList.remove("turn");
            }
        });
        playersScore.forEach((ele) => {
            ele.textContent = "0";
        });
    }
    if (dashboardSelections.playerNumbers === 1) {
        clearInterval(intervalId);
    }
    else {
        gameScore.children[0].classList.remove("multi", "t-100");
        gameScore.children[0].classList.add("solo", "t-50", "d-45");
        gameScore.children[0].innerHTML = soloModeHTMLTags;
    }
    dashboardSelections = { "theme": "numbers", "playerNumbers": 1, "gridSize": 4 };
    gridContainer.classList.remove("grid-6x6");
    gridContainer.classList.remove("grid-4x4");
    document.querySelectorAll(".choice").forEach((ele) => {
        ele.remove();
    });
    document.querySelectorAll(".startGameContainer .buttonsContainer button:first-child").forEach((ele, index) => {
        ele.setAttribute("class", "active");
    });
    document.querySelectorAll(".startGameContainer .buttonsContainer button:not(:first-child)").forEach((ele, index) => {
        ele.setAttribute("class", "idle");
    });
    document.body.style.backgroundColor = "#152938";
    gameBoard.classList.add("d-none");
    dashboardMenu.classList.remove("d-none");
}
// setRandomPositions(dashboardSelections);
//# sourceMappingURL=main.js.map