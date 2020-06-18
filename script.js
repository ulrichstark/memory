const maxPlayerCount = 4;
const minPairs = 5;
const maxPairs = 25;
const smileys = [
    "😀",
    "😂",
    "🤣",
    "😃",
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

const settingsPlayers = document.getElementById("settings-players");
const settingsAddPlayer = document.getElementById("settings-add-player");
const elementPairs = document.getElementById("pairs");
const resetGameButton = document.getElementById("reset-game");
const startGameButton = document.getElementById("start-game");
const elementPlayers = document.getElementById("players");

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
    settingsRemove.innerHTML =
        '<svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,8c0-2.21-1.79-4-4-4S6,5.79,6,8s1.79,4,4,4S14,10.21,14,8z M17,10v2h6v-2H17z M2,18v2h16v-2c0-2.66-5.33-4-8-4 S2,15.34,2,18z"/></svg>';

    return settingsRemove;
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
    setIngame(false);
}

// Erstellt ein div-Element, vergibt ihm eine Klasse und fügt es 'parentElement' als Kind zu
function createDiv(className, parentElement) {
    const element = document.createElement("div");
    element.classList.add(className);

    parentElement.appendChild(element);

    return element;
}

function createCardSlot(elementBoard, smiley) {
    const cardSlot = createDiv("card-slot", elementBoard);

    const card = createDiv("card", cardSlot);

    const cardFront = createDiv("card-front", card);
    const cardBack = createDiv("card-back", card);

    cardFront.innerText = smiley;

    return cardSlot;
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

        const playerName = document.createElement("span");
        playerName.classList.add("player-name");

        const playerSmileys = document.createElement("span");
        playerSmileys.classList.add("player-smileys");

        playerName.innerText = player.name;

        player.updateSmileys = () => {
            const smileyText = player.smileys.length === 0 ? "-" : player.smileys.join(" ");
            playerSmileys.innerText = smileyText;
        };

        player.updateSmileys();

        playerListItem.appendChild(playerName);
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

function startGame() {
    if (players.length === 0) {
        // Spiel mit 0 Spielern macht keinen Sinn
        return;
    }

    preparePlayersForGame();
    createPlayerList();

    const smileyPool = createSmileyPool(pairs);
    const cards = pairs * 2;
    const columns = Math.ceil(Math.sqrt(cards)); // Formel für möglichst quadratisches Spielfeld

    elementBoard.style.gridTemplateColumns = new Array(columns).fill("1fr").join(" "); // Jede Spalte bekommt eine 'fraction' im CSS Grid
    elementBoard.style.fontSize = `${Math.ceil(40 / columns)}vmin`;

    clearBoard();

    for (let i = 0; i < cards; i++) {
        const smiley = removeRandomItemFromArray(smileyPool); // Ein zufälligen Smiley aus dem Pool auswählen

        const cardSlot = createCardSlot(elementBoard, smiley);
        cardSlot.classList.add("clickable");

        cardSlot.addEventListener("click", () => {
            cardSlot.classList.remove("clickable");
            cardSlot.classList.add("flipped");
        });
    }

    setIngame(true);
}
