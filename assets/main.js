let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;

// Show GIF overlay and large text overlays
function showJackpotBg(currentAmount) {
    const jackpotBg = document.getElementById("jackpot-bg");
    const jackpotText = document.getElementById("jackpot-text-overlay");
    const jackpotMoney = document.getElementById("jackpot-money-overlay");

    jackpotBg.style.backgroundImage = "url('assets/me treasure.gif?" + Date.now() + "')";
    jackpotBg.style.display = "block";
    jackpotText.style.display = "block";
    jackpotMoney.textContent = "$" + currentAmount;
    jackpotMoney.style.display = "block";
}

// Hide GIF overlay and large text overlays
function hideJackpotBg() {
    document.getElementById("jackpot-bg").style.display = "none";
    document.getElementById("jackpot-bg").style.backgroundImage = "";
    document.getElementById("jackpot-text-overlay").style.display = "none";
    document.getElementById("jackpot-money-overlay").style.display = "none";
}

// Adds/removes highlight on box text for JACKPOT
function setBoxHighlight(isJackpot) {
    const topBox = document.getElementById("topBox");
    const bottomBox = document.getElementById("bottomBox");
    if (isJackpot) {
        topBox.classList.add("jackpot-highlight");
        bottomBox.classList.add("jackpot-highlight");
    } else {
        topBox.classList.remove("jackpot-highlight");
        bottomBox.classList.remove("jackpot-highlight");
    }
}

function generateMoney() {
    let previousAmount = currentAmount;
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
            topBox.textContent = "MAJOR LOSS";
            bottomBox.textContent = "MAJOR LOSS";
        } else if (outcome === "LOST") {
            topBox.textContent = "YOU LOST";
            bottomBox.textContent = "YOU LOST";
        } else if (outcome === "WON") {
            topBox.textContent = "YOU WON";
            bottomBox.textContent = "YOU WON";
        }
    }
}