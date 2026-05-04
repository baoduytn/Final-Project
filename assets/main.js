let currentAmount = 1;

let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5; // Set your "very low" threshold here

function generateMoney() {
    let previousAmount = currentAmount;
    let outcome = "";  // Track what happened

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    // 🎰 JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 100 + 5; // 5x–20x
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);
        pityBonus = 0;
        outcome = "JACKPOT";
    }
    // 💥 BIG DROP (lose)
    else if (roll < jackpotChance + riskFactor) {
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
        // Check for major loss
        if (currentAmount <= veryLowAmount) {
            outcome = "MAJORLOSS";
        } else {
            outcome = "LOST";
        }
    }
    // 📈 GROWTH (win)
    else {
        const growthFactor = 1.1 + Math.random() * 0.5; // 1.1x–1.6x
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
        outcome = "WON";
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;

    // --- Set the box texts based on outcome ---
    if (outcome === "JACKPOT") {
        document.getElementById("topBox").textContent = "JACKPOT!!!";
        document.getElementById("bottomBox").textContent = "JACKPOT!!!";
    } else if (outcome === "MAJORLOSS") {
        document.getElementById("topBox").textContent = "CRIPPLING";
        document.getElementById("bottomBox").textContent = "LOSS";
    } else if (outcome === "LOST") {
        document.getElementById("topBox").textContent = "AHH";
        document.getElementById("bottomBox").textContent = "DANG IT";
    } else if (outcome === "WON") {
        document.getElementById("topBox").textContent = "YOU";
        document.getElementById("bottomBox").textContent = "WON";
    }
}