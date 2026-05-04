let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;

function showJackpotBg() {
    const jackpotBg = document.getElementById("jackpot-bg");
    // Use a timestamp to force GIF reload on each JACKPOT
    jackpotBg.style.backgroundImage = "url('assets/me treasure.gif?" + Date.now() + "')";
    jackpotBg.style.display = "block";
}

function hideJackpotBg() {
    const jackpotBg = document.getElementById("jackpot-bg");
    jackpotBg.style.display = "none";
    jackpotBg.style.backgroundImage = "";
}

function generateMoney() {
    let previousAmount = currentAmount;
    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    if (roll < jackpotChance) { // 🎰 JACKPOT
        const jackpotMultiplier = Math.random() * 100 + 5;
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);
        pityBonus = 0;
        outcome = "JACKPOT";
    } else if (roll < jackpotChance + riskFactor) { // 💥 BIG DROP
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
        outcome = (currentAmount <= veryLowAmount) ? "MAJORLOSS" : "LOST";
    } else { // 📈 WIN
        const growthFactor = 1.1 + Math.random() * 0.5;
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
        outcome = "WON";
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;

    // Update UI based on outcome
    const topBox = document.querySelector(".gamble-box");
    const bottomBox = document.querySelectorAll(".gamble-box")[1];
    const mainTitle = document.querySelector("h1");

    if (outcome === "JACKPOT") {
        showJackpotBg();
        mainTitle.style.visibility = "hidden";
        topBox.textContent = "JACKPOT";
        bottomBox.textContent = "JACKPOT";
    } else {
        hideJackpotBg();
        mainTitle.style.visibility = "visible";
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