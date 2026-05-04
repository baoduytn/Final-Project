let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;

let lossStreak = 0;
let majorLossStreak = 0;

let isSoulCrashActive = false;
let gameLocked = false;
let waitingForNextRound = false;

// 🎯 TRACK LAST AMOUNT (for big jump detection)
let previousAmount = 1;

// 🎯 ELEMENTS
const topBox = document.getElementById("topBox");
const bottomBox = document.getElementById("bottomBox");
const mainTitle = document.getElementById("mainTitle");
const moneyText = document.getElementById("moneyText");
const soulClickZone = document.getElementById("soulClickZone");
const moneyImg = document.querySelector(".center-img");

// 🎰 GIFS
const jackpotGifs = [
    "assets/dolphin.gif",
    "assets/me treasure.gif",
    "assets/treasure chest.gif",
    "assets/walter-white-i-won.gif",
];

const majorLossGifs = [
    "assets/ryan-gosling-bladerunner-2049.gif",
    "assets/son.gif",
    "assets/wheeze.gif",
    "assets/ash-baby.gif"
];

const soulGifs = [
    "assets/elmo fire meme.gif",
    "assets/coffin-dance.gif",
    "assets/heavenly-father-i-am-cooked.gif",
    "assets/no-im-dead.gif"
];

// 🎰 RANDOM
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

    if (label === "SELL YOUR SOUL") {
        text.style.transform = "translate(-50%, -60%)";
        money.style.transform = "translate(-50%, -40%)";
    } else {
        text.style.transform = "translate(-50%, -50%)";
        money.style.transform = "translate(-50%, -50%)";
    }
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

// 📈 BIG GAIN DETECTION
function isBigJump(oldVal, newVal) {
    if (oldVal < 500 && newVal >= 1500) return true;
    if (oldVal < 1000 && newVal >= 3000) return true;
    if (newVal / oldVal >= 3) return true;
    return false;
}

// 🧠 MAIN GAME
function generateMoney() {
    if (gameLocked) return;

    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.5);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    let soulChance = 0.01;

    if (currentAmount >= 10000) {
        soulChance = 0.05 + Math.min(currentAmount / 200000, 0.20);
    }

    previousAmount = currentAmount;

    // 💀 SOUL
    if (roll < soulChance) {
        currentAmount = -Math.floor(Math.random() * 500 + 1);
        outcome = "SOUL";
    }

    // 🎰 JACKPOT
    else if (roll < jackpotChance) {
        currentAmount = Math.floor(currentAmount * (Math.random() * 100 + 5));
        pityBonus = 0;
        outcome = "JACKPOT";
    }

    // 💥 LOSS
    else if (roll < jackpotChance + riskFactor) {
        const drop = 0.20 + Math.random() * 0.5;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - drop)));

        lossStreak++;
        majorLossStreak++;

        pityBonus = Math.min(pityBonus + 0.01, 0.15);

        outcome = lossStreak >= 2 ? "MAJORLOSS" : "LOST";
    }

    // 📈 WIN
    else {
        currentAmount = Math.floor(currentAmount * (1.1 + Math.random() * 0.5)) + 1;

        lossStreak = 0;
        majorLossStreak = 0;

        outcome = "WON";
    }

    if (currentAmount < 0) outcome = "SOUL";

    moneyText.textContent = "$" + currentAmount;

    // 💡 BIG GAIN FLASH JACKPOT (COSMETIC ONLY)
    if (isBigJump(previousAmount, currentAmount)) {
        showOutcomeBg("JACKPOT", currentAmount, rand(jackpotGifs));
    }

    // =====================
    // 🎰 JACKPOT
    // =====================
    if (outcome === "JACKPOT") {
        hideJackpotBg();
        showOutcomeBg("JACKPOT", currentAmount, rand(jackpotGifs));

        gameLocked = true;
        waitingForNextRound = true;

        mainTitle.style.visibility = "hidden";

        topBox.style.display = "none";
        bottomBox.style.display = "none";
        soulClickZone.style.display = "none";
    }

    // =====================
    // 💥 MAJOR LOSS
    // =====================
    else if (outcome === "MAJORLOSS") {
        hideJackpotBg();
        showOutcomeBg("MAJOR LOSS", currentAmount, rand(majorLossGifs));

        gameLocked = true;
        waitingForNextRound = true;

        mainTitle.style.visibility = "hidden";

        topBox.style.display = "none";
        bottomBox.style.display = "none";
        soulClickZone.style.display = "none";
    }

    // =====================
    // 💀 SOUL
    // =====================
    else if (outcome === "SOUL") {
        hideJackpotBg();
        showOutcomeBg("SELL YOUR SOUL", currentAmount, rand(soulGifs));

        gameLocked = true;
        isSoulCrashActive = true;

        mainTitle.style.visibility = "hidden";

        topBox.style.display = "none";
        bottomBox.style.display = "none";

        soulClickZone.style.display = "block";
    }

    // =====================
    // NORMAL
    // =====================
    else {
        hideJackpotBg();

        gameLocked = false;
        waitingForNextRound = false;
        isSoulCrashActive = false;

        mainTitle.style.visibility = "visible";

        topBox.style.display = "block";
        bottomBox.style.display = "block";
        soulClickZone.style.display = "none";

        if (outcome === "LOST") {
            topBox.textContent = "YOU LOST";
            bottomBox.textContent = "YOU LOST";
        } else {
            topBox.textContent = "YOU WON";
            bottomBox.textContent = "YOU WON";
        }
    }
}

// 🖱️ MONEY CLICK
moneyImg.addEventListener("click", function () {

    if (waitingForNextRound) {
        waitingForNextRound = false;
        gameLocked = false;

        hideJackpotBg();

        mainTitle.style.visibility = "visible";
        topBox.style.display = "block";
        bottomBox.style.display = "block";

        return;
    }

    generateMoney();
});

// 🖱️ SOUL RESTART
soulClickZone.addEventListener("click", function () {
    if (isSoulCrashActive) {
        resetGameToStart();
    }
});