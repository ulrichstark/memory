const maxPlayerCount = 4;
const minPairs = 5;
const maxPairs = 25;

let players = [];
let ingame = false;
let pairs = 12;

const settingsPlayers = document.getElementById("settings-players");
const settingsAddPlayer = document.getElementById("settings-add-player");
settingsAddPlayer.addEventListener("click", addPlayer);

const resetGameButton = document.getElementById("reset-game");
resetGameButton.addEventListener("click", resetGame);

const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", startGame);

const elementPairs = document.getElementById("pairs");

document.getElementById("settings-remove-pair").addEventListener("click", () => changePairs(-1));
document.getElementById("settings-add-pair").addEventListener("click", () => changePairs(1));

const elementBoard = document.getElementById("board");

updatePairs();
addPlayer();

function createPlayer() {
    const elementSettings = document.createElement("li");
    elementSettings.classList.add("settings-player");

    // Listenelement standardmäßig ausgeblendet
    elementSettings.classList.add("hidden");

    const inputName = document.createElement("input");

    const settingsRemove = document.createElement("button");
    settingsRemove.classList.add("round");
    settingsRemove.style.backgroundColor = "red";
    settingsRemove.innerHTML =
        '<svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,8c0-2.21-1.79-4-4-4S6,5.79,6,8s1.79,4,4,4S14,10.21,14,8z M17,10v2h6v-2H17z M2,18v2h16v-2c0-2.66-5.33-4-8-4 S2,15.34,2,18z"/></svg>';

    elementSettings.appendChild(inputName);
    elementSettings.appendChild(settingsRemove);

    const player = {
        elementSettings,
        inputName,
    };

    settingsRemove.addEventListener("click", () => removePlayer(player));

    return player;
}

function addPlayer() {
    const player = createPlayer();

    players.push(player);

    // Listenelement für diesen Spieler hinzufügen
    settingsPlayers.appendChild(player.elementSettings);

    // Andere Listenelemente neu positionieren
    renderPlayerListInSettings();

    // Listenelement nach sehr kurzer Zeit automatisch einblenden
    setTimeout(() => {
        player.elementSettings.classList.remove("hidden");
    }, 20);

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

function renderPlayerListInSettings() {
    let index = 1;
    let offsetY = 0;

    for (const player of players) {
        player.elementSettings.style.top = `${offsetY}px`;
        player.inputName.placeholder = `Spieler ${index}`;
        offsetY += 50;
        index++;
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

function setIngame(target) {
    if (target !== ingame) {
        document.body.classList.toggle("ingame");
        ingame = target;
    }
}

function resetGame() {
    setIngame(false);
}

function startGame() {
    const cards = pairs * 2;

    const columns = Math.ceil(Math.sqrt(cards));
    elementBoard.style.gridTemplateColumns = new Array(columns).fill("1fr").join(" ");

    elementBoard.innerHTML = "";

    for (let i = 0; i < cards; i++) {
        const card = document.createElement("div");
        elementBoard.appendChild(card);
    }

    setIngame(true);
}
