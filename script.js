const maxPlayerCount = 4;
const minPairs = 5;
const maxPairs = 25;
const smileys = [
    "😀",
    "😂",
    "🤣",
    "😴",
    "😅",
    "😆",
    "😉",
    "😋",
    "😎",
    "😍",
    "😘",
    "🤔",
    "🤨",
    "😐",
    "🙄",
    "😮",
    "😪",
    "😜",
    "🤑",
    "😭",
    "😬",
    "😡",
    "🤠",
    "😇",
    "🤫",
];

let players = [];
let ingame = false;
let pairs = 12;
let secondsPassed = 0;
let activePlayer = 0;
let clockHandle = 0;
let lastCard = null;
let foundPairs = 0;

const settingsPlayers = document.getElementById("settings-players");
const settingsAddPlayer = document.getElementById("settings-add-player");
const elementPairs = document.getElementById("pairs");
const resetGameButton = document.getElementById("reset-game");
const startGameButton = document.getElementById("start-game");
const elementPlayers = document.getElementById("players");
const elementTime = document.getElementById("time");
const elementTries = document.getElementById("tries");

settingsAddPlayer.addEventListener("click", () => addPlayer(true));
resetGameButton.addEventListener("click", () => resetGame());
startGameButton.addEventListener("click", () => startGame());

document.getElementById("settings-remove-pair").addEventListener("click", () => changePairs(-1));
document.getElementById("settings-add-pair").addEventListener("click", () => changePairs(1));

const elementBoard = document.getElementById("board");

updatePairs();
addPlayer(false);
addPlayer(false);

function createPlayerRemoveButton() {
    const settingsRemove = document.createElement("button");
    settingsRemove.classList.add("round");
    settingsRemove.style.backgroundColor = "red";
    settingsRemove.tabIndex = -1;
    settingsRemove.innerHTML =
        '<svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,8c0-2.21-1.79-4-4-4S6,5.79,6,8s1.79,4,4,4S14,10.21,14,8z M17,10v2h6v-2H17z M2,18v2h16v-2c0-2.66-5.33-4-8-4 S2,15.34,2,18z"/></svg>';

    return settingsRemove;
}

function formatTries(tries) {
    return `${tries} Versuch${tries === 1 ? "" : "e"}`;
}

function updateTries() {
    let totalTries = 0;

    for (const player of players) {
        totalTries += player.tries;
    }

    elementTries.innerText = formatTries(totalTries);
}

function createPlayer() {
    const elementSettings = document.createElement("li");
    elementSettings.classList.add("settings-player");

    const inputName = document.createElement("input");
    const settingsRemove = createPlayerRemoveButton();

    elementSettings.appendChild(inputName);
    elementSettings.appendChild(settingsRemove);

    const player = {
        elementSettings,
        inputName,
    };

    settingsRemove.addEventListener("click", () => removePlayer(player));

    return player;
}

function addPlayer(animate) {
    const player = createPlayer();

    players.push(player);

    // Listenelement für diesen Spieler hinzufügen
    settingsPlayers.appendChild(player.elementSettings);

    // Andere Listenelemente neu positionieren
    renderPlayerListInSettings();

    if (animate) {
        // Listenelement anfangs ausblenden
        player.elementSettings.classList.add("hidden");

        // Listenelement nach kurzer Zeit automatisch einblenden
        setTimeout(() => player.elementSettings.classList.remove("hidden"), 50);
    }

    // Spieler-Hinzufügen Knopf bei Limit ausblenden
    if (players.length >= maxPlayerCount) {
        settingsAddPlayer.classList.add("hidden");
    }
}

function removePlayer(player) {
    if (players.length === 1) {
        // Letzter Spieler darf nicht gelöscht werden!
        return;
    }
    // zu löschenden Spieler aus der Liste filtern
    players = players.filter((otherPlayer) => otherPlayer !== player);

    // Listenelement für diesen Spieler ausblenden
    player.elementSettings.classList.add("hidden");

    // Andere Listenelemente neu positionieren
    renderPlayerListInSettings();

    // Listenelement nach der Animation entfernen
    setTimeout(() => {
        player.elementSettings.remove();
    }, 500);

    // Spieler-Hinzufügen Knopf wieder einblenden
    settingsAddPlayer.classList.remove("hidden");
}

function getPlayerNameWithIndex(playerIndex) {
    return `Spieler ${playerIndex}`;
}

// Passt Placeholder für Spielername-Eingabefelder und ihre Position an
function renderPlayerListInSettings() {
    let index = 1;
    let offsetY = 0;

    for (const player of players) {
        player.elementSettings.style.top = `${offsetY}px`;
        player.inputName.placeholder = getPlayerNameWithIndex(index);

        if (index < maxPlayerCount) {
            offsetY += 50;
            index++;
        }
    }

    settingsPlayers.style.height = `${offsetY}px`;
}

function changePairs(factor) {
    const newPairs = pairs + factor;

    if (newPairs >= minPairs && newPairs <= maxPairs) {
        pairs = newPairs;

        updatePairs();
    }
}

function updatePairs() {
    elementPairs.innerText = `${pairs} Kartenpaare`;
}

function clearBoard() {
    elementBoard.innerHTML = "";
}

function setIngame(target) {
    if (target !== ingame) {
        document.body.classList.toggle("ingame");
        ingame = target;
    }
}

function resetGame() {
    stopClock();
    setIngame(false);
}

// Erstellt ein div-Element, vergibt ihm eine Klasse und fügt es 'parentElement' als Kind zu
function createDiv(className, parentElement) {
    const element = document.createElement("div");
    element.classList.add(className);

    parentElement.appendChild(element);

    return element;
}

function updateClock() {
    secondsPassed++;
    const minutes = Math.floor(secondsPassed / 60);
    const seconds = secondsPassed % 60;
    elementTime.innerText = `${minutes}:${seconds <= 9 ? "0" : ""}${seconds}`;
}

function startClock() {
    secondsPassed = 0;
    updateClock();
    this.clockHandle = window.setInterval(updateClock, 1000);
}

function stopClock() {
    window.clearInterval(this.clockHandle);
}

function removeRandomItemFromArray(array) {
    const index = Math.floor(Math.random() * array.length);
    return array.splice(index, 1)[0];
}

/*
    - Setzt Namen oder nutzt die Platzhalternamen
    - Setzt gefundende Smileys für jeden Spieler zurück
*/
function preparePlayersForGame() {
    let playerIndex = 1;

    for (const player of players) {
        player.smileys = [];
        player.tries = 0;

        const inputValue = player.inputName.value.trim();
        if (inputValue.length > 0) {
            player.name = inputValue;
        } else {
            player.name = getPlayerNameWithIndex(playerIndex);
        }

        playerIndex++;
    }
}

function createPlayerList() {
    elementPlayers.innerHTML = "";

    for (const player of players) {
        const playerListItem = document.createElement("li");
        playerListItem.classList.add("player");

        playerListItem.innerHTML =
            '<svg class="player-crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z"/></svg>';

        const playerName = document.createElement("span");
        playerName.classList.add("player-name");

        const playerTries = document.createElement("span");
        playerTries.classList.add("player-tries");

        const playerSmileys = document.createElement("span");
        playerSmileys.classList.add("player-smileys");

        playerName.innerText = player.name;

        player.updateSmileys = () => {
            const smileyText = player.smileys.length === 0 ? "-" : `${player.smileys.length} ${player.smileys.join("")}`;
            playerSmileys.innerText = smileyText;
        };

        player.updateTries = () => (playerTries.innerText = formatTries(player.tries));

        player.updateActiveStatus = (active) => {
            if (active) {
                playerListItem.classList.add("active");
            } else {
                playerListItem.classList.remove("active");
            }
        };

        player.setWinner = () => playerListItem.classList.add("won");

        player.updateSmileys();
        player.updateTries();

        playerListItem.appendChild(playerName);
        playerListItem.appendChild(playerTries);
        playerListItem.appendChild(playerSmileys);

        elementPlayers.appendChild(playerListItem);
    }
}

// Erstellt den Array aus möglichen Smileypaaren
function createSmileyPool(pairs) {
    const pool = [];

    for (let pair = 0; pair < pairs; pair++) {
        const smiley = smileys[pair];
        pool.push(smiley);
        pool.push(smiley);
    }

    return pool;
}

function updateActivePlayer() {
    for (let i = 0; i < players.length; i++) {
        players[i].updateActiveStatus(i === activePlayer);
    }
}

function nextPlayer() {
    activePlayer++;

    if (activePlayer >= players.length) {
        activePlayer = 0;
    }

    updateActivePlayer();
}

function setBoardClickable(clickable) {
    elementBoard.style.pointerEvents = clickable ? "auto" : "none";
}

function updateWinners() {
    let highestScore = 0;

    for (const player of players) {
        if (player.smileys.length > highestScore) {
            highestScore = player.smileys.length;
        }
    }

    for (const player of players) {
        if (player.smileys.length === highestScore) {
            player.setWinner();
        }
    }
}

function resolveCardPair(card) {
    const player = players[activePlayer];
    player.tries++;
    player.updateTries();
    updateTries();

    if (lastCard.smiley === card.smiley) {
        lastCard.found();
        card.found();

        player.smileys.push(card.smiley);
        player.updateSmileys();

        foundPairs++;

        if (foundPairs === pairs) {
            activePlayer = null;
            updateActivePlayer();

            updateWinners();
        }
    } else {
        lastCard.flip();
        card.flip();
        nextPlayer();
    }

    setBoardClickable(true);
    lastCard = null;
}

function startGame() {
    if (players.length === 0) {
        // Spiel mit 0 Spielern macht keinen Sinn
        return;
    }

    foundPairs = 0;
    lastCard = null;

    preparePlayersForGame();
    createPlayerList();
    updateTries();

    activePlayer = 0;
    updateActivePlayer();

    const smileyPool = createSmileyPool(pairs);
    const cardCount = pairs * 2;
    const columns = Math.ceil(Math.sqrt(cardCount)); // Formel für möglichst quadratisches Spielfeld

    elementBoard.style.gridTemplateColumns = new Array(columns).fill("1fr").join(" "); // Jede Spalte bekommt eine 'fraction' im CSS Grid
    elementBoard.style.fontSize = `${Math.ceil(40 / columns)}vmin`;

    clearBoard();

    for (let i = 0; i < cardCount; i++) {
        const smiley = removeRandomItemFromArray(smileyPool); // Ein zufälligen Smiley aus dem Pool auswählen

        const elementSlot = createDiv("card-slot", elementBoard);
        const elementCard = createDiv("card", elementSlot);

        const card = {
            smiley: smiley,
        };

        createDiv("card-front", elementCard).innerText = smiley;
        createDiv("card-back", elementCard);

        card.flip = () => elementSlot.classList.toggle("flipped");
        card.found = () => elementSlot.classList.add("found");

        elementSlot.addEventListener("click", () => {
            card.flip();

            if (lastCard === null) {
                lastCard = card;
            } else {
                setBoardClickable(false);
                setTimeout(() => resolveCardPair(card), 1500);
            }
        });
    }

    startClock();
    setIngame(true);
}
