let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;

let lossStreak = 0;
let majorLossStreak = 0;

let isSoulCrashActive = false;
let gameLocked = false;
let waitingForNextRound = false;

let previousAmount = 1;

// 🎯 ELEMENTS
const topBox = document.getElementById("topBox");
const bottomBox = document.getElementById("bottomBox");
const mainTitle = document.getElementById("mainTitle");
const moneyText = document.getElementById("moneyText");
const soulClickZone = document.getElementById("soulClickZone");
const moneyImg = document.querySelector(".center-img");

// 🎰 MEDIA
const jackpotMedia = [
    { gif: "assets/dolphin.gif", sound: "assets/casino win.mp3" },
    { gif: "assets/me treasure.gif", sound: "assets/Me treasure.mp3" },
    { gif: "assets/treasure chest.gif", sound: "assets/casino win.mp3" },
    { gif: "assets/walter-white-i-won.gif", sound: "assets/casino win.mp3" }
];

const majorLossMedia = [
    { gif: "assets/ryan-gosling-bladerunner-2049.gif", sound: "assets/cry.mp3" },
    { gif: "assets/son.gif", sound: "assets/Libet delay.mp3" },
    { gif: "assets/wheeze.gif", sound: "assets/uncle ruckus theme.mp3" },
    { gif: "assets/ash-baby.gif", sound: "assets/burning memory.mp3" }
];

const soulMedia = [
    { gif: "assets/elmo fire meme.gif", sound: "assets/sisyphus boulder.mp3" },
    { gif: "assets/heavenly-father-i-am-cooked.gif", sound: "assets/burning memory.mp3" },
    { gif: "assets/no-im-dead.gif", sound: "assets/unshaken.mp3" }
];

// 🎰 RANDOM
function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 🔊 AUDIO
let currentAudio = null;

function playSound(src) {
    stopSound();
    currentAudio = new Audio(src);
    currentAudio.volume = 0.7;
    currentAudio.play();
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
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

function hideJackpotBg() {
    document.getElementById("jackpot-bg").style.display = "none";
    document.getElementById("jackpot-text-overlay").style.display = "none";
    document.getElementById("jackpot-money-overlay").style.display = "none";
}

// 🔄 RESET
function resetGameToStart() {
    stopSound();
    window.location.reload();
}

// 📈 BIG JUMP (SAFE VISUAL ONLY)
function isBigJump(oldVal, newVal) {
    if (oldVal < 500 && newVal >= 1500) return true;
    if (oldVal < 1000 && newVal >= 3000) return true;
    if (newVal / oldVal >= 3) return true;
    return false;
}

// 🧠 MAIN GAME
function generateMoney() {
    if (gameLocked) return;

    previousAmount = currentAmount;

    const riskFactor = Math.min(currentAmount / 200, 0.5);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    let soulChance = 0.01;
    if (currentAmount >= 10000) {
        soulChance = 0.05 + Math.min(currentAmount / 200000, 0.20);
    }

    let outcome = "";

    // 🎯 DECIDE OUTCOME FIRST (ONLY ONCE)
    if (roll < soulChance) {
        currentAmount = -Math.floor(Math.random() * 500 + 1);
        outcome = "SOUL";
    }
    else if (roll < jackpotChance) {
        currentAmount = Math.floor(currentAmount * (Math.random() * 100 + 5));
        pityBonus = 0;
        lossStreak = 0;
        outcome = "JACKPOT";
    }
    else if (roll < jackpotChance + riskFactor) {
        const drop = 0.20 + Math.random() * 0.5;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - drop)));

        lossStreak++;
        pityBonus = Math.min(pityBonus + 0.01, 0.15);

        outcome = lossStreak >= 2 ? "MAJORLOSS" : "LOST";
    }
    else {
        currentAmount = Math.floor(currentAmount * (1.1 + Math.random() * 0.5)) + 1;
        lossStreak = 0;
        pityBonus = 0;
        outcome = "WON";
    }

    if (currentAmount < 0) outcome = "SOUL";

    moneyText.textContent = "$" + currentAmount;

    // ⚠️ BIG JUMP DOES NOT OVERRIDE OUTCOME
    if (isBigJump(previousAmount, currentAmount) && !gameLocked) {
        showOutcomeBg("JACKPOT", currentAmount, rand(jackpotMedia).gif);
        playSound(rand(jackpotMedia).sound);
    }

    // ======================
    // FINAL UI STATES
    // ======================

    if (outcome === "JACKPOT") {
        const media = rand(jackpotMedia);

        hideJackpotBg();
        showOutcomeBg("JACKPOT", currentAmount, media.gif);
        playSound(media.sound);

        gameLocked = true;
        waitingForNextRound = true;

        mainTitle.style.visibility = "hidden";
        topBox.style.display = "none";
        bottomBox.style.display = "none";
        soulClickZone.style.display = "none";
    }

    else if (outcome === "MAJORLOSS") {
        const media = rand(majorLossMedia);

        hideJackpotBg();
        showOutcomeBg("MAJOR LOSS", currentAmount, media.gif);
        playSound(media.sound);

        gameLocked = true;
        waitingForNextRound = true;

        mainTitle.style.visibility = "hidden";
        topBox.style.display = "none";
        bottomBox.style.display = "none";
        soulClickZone.style.display = "none";
    }

    else if (outcome === "SOUL") {
        const media = rand(soulMedia);

        hideJackpotBg();
        showOutcomeBg("SELL YOUR SOUL", currentAmount, media.gif);
        playSound(media.sound);

        gameLocked = true;
        isSoulCrashActive = true;

        mainTitle.style.visibility = "hidden";

        topBox.style.display = "none";
        bottomBox.style.display = "none";
        soulClickZone.style.display = "block";
    }

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

// 🖱️ CLICK SYSTEM
moneyImg.addEventListener("click", function () {

    if (waitingForNextRound) {
        waitingForNextRound = false;
        gameLocked = false;

        stopSound();
        hideJackpotBg();

        mainTitle.style.visibility = "visible";
        topBox.style.display = "block";
        bottomBox.style.display = "block";

        return;
    }

    generateMoney();
});

// 🖱️ SOUL RESET
soulClickZone.addEventListener("click", function () {
    if (isSoulCrashActive) {
        resetGameToStart();
    }
});