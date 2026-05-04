document.body.style.backgroundImage = "url('me treasure.gif')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundImage = "";

let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;
let jackpotActive = false;

function generateMoney() {
    let previousAmount = currentAmount;
    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    // 🎰 JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 100 + 5;
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);
        pityBonus = 0;
        outcome = "JACKPOT";
        jackpotActive = true;
    }
    // 💥 BIG DROP (lose)
    else if (roll < jackpotChance + riskFactor) {
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
        outcome = (currentAmount <= veryLowAmount) ? "MAJORLOSS" : "LOST";
        jackpotActive = false;
    }
    // 📈 GROWTH (win)
    else {
        const growthFactor = 1.1 + Math.random() * 0.5;
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
        outcome = "WON";
        jackpotActive = false;
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;

    // JACKPOT: change BG, hide h1
    if (outcome === "JACKPOT") {
        document.getElementById("topBox").textContent = "JACKPOT";
        document.getElementById("bottomBox").textContent = "JACKPOT";

        // Change background to GIF
        document.body.style.backgroundImage = "url('assets/jackpot-bg.gif')";
        document.body.style.backgroundSize = "cover";
        // Hide the title
        document.getElementById("mainTitle").style.visibility = "hidden";
        jackpotActive = true;
    } else {
        // Revert BG and show h1 ONLY if previously was jackpot
        if (jackpotActive) {
            document.body.style.backgroundImage = "";
            document.getElementById("mainTitle").style.visibility = "visible";
            jackpotActive = false;
        }

        // OTHER OUTCOMES
        if (outcome === "MAJORLOSS") {
            document.getElementById("topBox").textContent = "MAJOR LOSS";
            document.getElementById("bottomBox").textContent = "MAJOR LOSS";
        } else if (outcome === "LOST") {
            document.getElementById("topBox").textContent = "YOU LOST";
            document.getElementById("bottomBox").textContent = "YOU LOST";
        } else if (outcome === "WON") {
            document.getElementById("topBox").textContent = "YOU WON";
            document.getElementById("bottomBox").textContent = "YOU WON";
        }
    }
}