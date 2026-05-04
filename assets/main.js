let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;

let lossStreak = 0;
let isSoulCrashActive = false;
let gameLocked = false;

const jackpotGifs = [
    "assets/dolphin.gif",
    "assets/me treasure.gif",
    "assets/treasure chest.gif",
    "assets/walter-white-i-won.gif",
];

// 💥 MAJOR LOSS GIFS
const majorLossGifs = [
    "assets/ryan-gosling-bladerunner-2049.gif",
    "assets/son.gif",
    "assets/wheeze.gif",
    "assets/ash-baby.gif"
];

// 💀 SOUL CRASH GIFS
const soulGifs = [
    "assets/elmo fire meme.gif",
    "assets/coffin-dance.gif",
    "assets/cooked-dog-meme.gif",
    "assets/no-im-dead.gif"
];

let lastSoulGifIndex = -1;

// 🎰 GIF PICKER
function getRandom(arr, lastIndexRef) {
    let index;
    do {
        index = Math.floor(Math.random() * arr.length);
    } while (index === lastIndexRef.value && arr.length > 1);

    lastIndexRef.value = index;
    return arr[index];
}

let soulIndexRef = { value: -1 };

function getSoulGif() {
    return getRandom(soulGifs, soulIndexRef);
}

// 🎭 OVERLAY
function showOutcomeBg(label, amount, gifPath) {
    const bg = document.getElementById("jackpot-bg");
    const text = document.getElementById("jackpot-text-overlay");
    const money = document.getElementById("jackpot-money-overlay");

    bg.style.backgroundImage = `url('${gifPath}?${Date.now()}')`;
    bg.style.display = "block";

    text.style.display = "block";
    text.textContent = label;

    money.style.display = "block";
    money.textContent = "$" + amount;
}

// ❌ hide overlay
function hideJackpotBg() {
    document.getElementById("jackpot-bg").style.display = "none";
    document.getElementById("jackpot-text-overlay").style.display = "none";
    document.getElementById("jackpot-money-overlay").style.display = "none";
}

// 🔄 reset
function resetGameToStart() {
    window.location.reload();
}

// 🧠 MAIN GAME
function generateMoney() {
    if (gameLocked) return;

    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    let soulChance = 0.01;

    // 💀 HIGH RISK WHEN RICH
    if (currentAmount >= 10000) {
        soulChance = 0.05 + Math.min(currentAmount / 200000, 0.20);
    }

    const topBox = document.getElementById("topBox");
    const bottomBox = document.getElementById("bottomBox");
    const mainTitle = document.getElementById("mainTitle");
    const moneyText = document.getElementById("moneyText");

    // 💀 SOUL CRASH
    if (roll < soulChance) {
        currentAmount = -Math.floor(Math.random() * 500 + 1);
        outcome = "SOUL";
    }

    // 🎰 JACKPOT
    else if (roll < jackpotChance) {
        currentAmount = Math.floor(currentAmount * (Math.random() * 100 + 5));
        outcome = "JACKPOT";
    }

    // 💥 LOSS
    else if (roll < jackpotChance + riskFactor) {
        const drop = 0.20 + Math.random() * 0.5;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - drop)));
        lossStreak++;
        outcome = lossStreak >= 2 ? "MAJORLOSS" : "LOST";
    }

    // 📈 WIN
    else {
        currentAmount = Math.floor(currentAmount * (1.1 + Math.random() * 0.5)) + 1;
        lossStreak = 0;
        outcome = "WON";
    }

    if (currentAmount < 0) outcome = "SOUL";

    moneyText.textContent = "$" + currentAmount;

    // 🎯 STATES

    if (outcome === "JACKPOT") {
        hideJackpotBg();
        showOutcomeBg("JACKPOT", currentAmount, getRandom(jackpotGifs, { value: -1 }));

        gameLocked = false;
        isSoulCrashActive = false;

        mainTitle.style.visibility = "hidden";
        topBox.textContent = "JACKPOT";
        bottomBox.textContent = "JACKPOT";

        bottomBox.classList.remove("soul-mode");
    }

    else if (outcome === "MAJORLOSS") {
        hideJackpotBg();
        showOutcomeBg("MAJOR LOSS", currentAmount, getRandom(majorLossGifs, { value: -1 }));

        gameLocked = false;
        isSoulCrashActive = false;

        mainTitle.style.visibility = "hidden";
        topBox.textContent = "MAJOR LOSS";
        bottomBox.textContent = "MAJOR LOSS";

        bottomBox.classList.remove("soul-mode");
    }

    else if (outcome === "SOUL") {
        hideJackpotBg();
        showOutcomeBg("SELL YOUR SOUL", currentAmount, getSoulGif());

        gameLocked = true;
        isSoulCrashActive = true;

        mainTitle.style.visibility = "hidden";

        topBox.textContent = "SELL YOUR SOUL";
        bottomBox.textContent = "CLICK TO RESTART";

        bottomBox.classList.add("soul-mode");
    }

    else {
        hideJackpotBg();

        gameLocked = false;
        isSoulCrashActive = false;

        mainTitle.style.visibility = "visible";

        bottomBox.classList.remove("soul-mode");

        if (outcome === "LOST") {
            topBox.textContent = "YOU LOST";
            bottomBox.textContent = "YOU LOST";
        } else {
            topBox.textContent = "YOU WON";
            bottomBox.textContent = "YOU WON";
        }
    }
}

// 🖱️ ONLY RESTART ON SOUL MODE
document.getElementById("bottomBox").addEventListener("click", function () {
    if (isSoulCrashActive && bottomBox.classList.contains("soul-mode")) {
        resetGameToStart();
    }
});

