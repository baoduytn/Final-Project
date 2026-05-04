let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;

// 🎰 List of jackpot GIFs
const jackpotGifs = [
    "assets/dolphin.gif",
    "assets/me treasure.gif",
    "assets/treasure chest.gif",
    "assets/walter-white-i-won.gif"
];

// 💥 List of major loss GIFs
const majorLossGifs = [
    "assets/elmo fire meme.gif",
    "assets/ryan-gosling-bladerunner-2049.gif",
    "assets/son.gif"
];

// Track last GIF to avoid repeats
let lastGifIndex = -1;
let lastMajorLossGifIndex = -1;

// Get a random GIF (no repeat)
function getRandomGif() {
    let index;
    do {
        index = Math.floor(Math.random() * jackpotGifs.length);
    } while (index === lastGifIndex && jackpotGifs.length > 1);

    lastGifIndex = index;
    return jackpotGifs[index];
}

// Show GIF overlay and large text overlays
// Get a random MAJOR LOSS GIF (no repeat)
function getRandomMajorLossGif() {
    let index;
    do {
        index = Math.floor(Math.random() * majorLossGifs.length);
    } while (index === lastMajorLossGifIndex && majorLossGifs.length > 1);

    lastMajorLossGifIndex = index;
    return majorLossGifs[index];
}

// Show GIF + text + money overlays with the same style used for JACKPOT
function showOutcomeBg(label, amount, gifPath) {
    const jackpotBg = document.getElementById("jackpot-bg");
    const jackpotText = document.getElementById("jackpot-text-overlay");
    const jackpotMoney = document.getElementById("jackpot-money-overlay");

    jackpotBg.style.backgroundImage = "url('" + gifPath + "?" + Date.now() + "')";
    jackpotBg.style.display = "block";
    jackpotText.textContent = label;
    jackpotText.style.display = "block";
    jackpotMoney.textContent = "$" + amount;
    jackpotMoney.style.display = "block";
}

function showJackpotBg(currentAmount) {
    showOutcomeBg("JACKPOT", currentAmount, getRandomGif());
}

function showMajorLossBg(currentAmount) {
    showOutcomeBg("MAJOR LOSS", currentAmount, getRandomMajorLossGif());
}
// Hide GIF overlay and large text overlays
function hideJackpotBg() {
    const jackpotBg = document.getElementById("jackpot-bg");
    jackpotBg.style.display = "none";
    jackpotBg.style.backgroundImage = "";
    document.getElementById("jackpot-text-overlay").style.display = "none";
    document.getElementById("jackpot-money-overlay").style.display = "none";
}

// Adds/removes highlight on box text for JACKPOT/MAJOR LOSS
function setBoxHighlight(isHighlighted) {
    const topBox = document.getElementById("topBox");
    const bottomBox = document.getElementById("bottomBox");

    if (isHighlighted) {
        topBox.classList.add("jackpot-highlight");
        bottomBox.classList.add("jackpot-highlight");
    } else {
        topBox.classList.remove("jackpot-highlight");
        bottomBox.classList.remove("jackpot-highlight");
    }
}

function generateMoney() {
    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    const topBox = document.getElementById("topBox");
    const bottomBox = document.getElementById("bottomBox");
    const mainTitle = document.getElementById("mainTitle");

    // JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 100 + 5; // 5x–105x
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);
        pityBonus = 0;
        outcome = "JACKPOT";
    }
    // BIG DROP (lose)
    else if (roll < jackpotChance + riskFactor) {
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
        outcome = (currentAmount <= veryLowAmount) ? "MAJORLOSS" : "LOST";
    }
    // GROWTH (win)
    else {
        const growthFactor = 1.1 + Math.random() * 0.5;
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
        outcome = "WON";
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;

    if (outcome === "JACKPOT") {
        showJackpotBg(currentAmount);
        mainTitle.style.visibility = "hidden";
        topBox.textContent = "JACKPOT";
        bottomBox.textContent = "JACKPOT";
        setBoxHighlight(true);
    } else {
        hideJackpotBg();
        mainTitle.style.visibility = "visible";
        setBoxHighlight(false);

        if (outcome === "MAJORLOSS") {
            showMajorLossBg(currentAmount);
            mainTitle.style.visibility = "hidden";
            topBox.textContent = "MAJOR LOSS";
            bottomBox.textContent = "MAJOR LOSS";
            setBoxHighlight(true);
        } else if (outcome === "LOST") {
            topBox.textContent = "YOU LOST";
            bottomBox.textContent = "YOU LOST";
        } else if (outcome === "WON") {
            topBox.textContent = "YOU WON";
            bottomBox.textContent = "YOU WON";
        }
    }
}