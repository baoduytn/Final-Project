let currentAmount = 1;
let baseJackpotChance = 0.01;
let pityBonus = 0;
const maxPityBonus = 0.15;
const veryLowAmount = 5;

function showJackpotBg() {
    const jackpotBg = document.getElementById("jackpot-bg");
    // Appending a timestamp makes the GIF start from the first frame every time
    jackpotBg.style.backgroundImage = "url('assets/me treasure.gif?" + Date.now() + "')";
    jackpotBg.style.display = "block";
}
function hideJackpotBg() {
    const jackpotBg = document.getElementById("jackpot-bg");
    jackpotBg.style.display = "none";
    jackpotBg.style.backgroundImage = "";
}

function generateMoney() {
    // Track the previous amount to determine outcome
    let previousAmount = currentAmount;
    let outcome = "";

    const riskFactor = Math.min(currentAmount / 200, 0.50);
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);
    const roll = Math.random();

    // JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 100 + 5; // 5x–20x
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);
        pityBonus = 0;
        outcome = "JACKPOT";
    }
    // BIG DROP
    else if (roll < jackpotChance + riskFactor) {
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
        outcome = (currentAmount <= veryLowAmount) ? "MAJORLOSS" : "LOST";
    }
    // GROWTH
    else {
        const growthFactor = 1.1 + Math.random() * 0.5;
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
        outcome = "WON";
    }

    // Update display
    document.getElementById("moneyText").textContent = "$" + currentAmount;

    // Handle outcomes
    if (outcome === "JACKPOT") {
        // Show and restart GIF overlay, hide title if you want
        showJackpotBg();
        document.querySelector("h1").style.visibility = "hidden";
        // Update your boxes
        document.querySelectorAll(".gamble-box")[0].textContent = "JACKPOT";
        document.querySelectorAll(".gamble-box")[1].textContent = "JACKPOT";
    } else {
        hideJackpotBg();
        document.querySelector("h1").style.visibility = "visible";
        if (outcome === "MAJORLOSS") {
            document.querySelectorAll(".gamble-box")[0].textContent = "MAJOR LOSS";
            document.querySelectorAll(".gamble-box")[1].textContent = "MAJOR LOSS";
        } else if (outcome === "LOST") {
            document.querySelectorAll(".gamble-box")[0].textContent = "YOU LOST";
            document.querySelectorAll(".gamble-box")[1].textContent = "YOU LOST";
        } else if (outcome === "WON") {
            document.querySelectorAll(".gamble-box")[0].textContent = "YOU WON";
            document.querySelectorAll(".gamble-box")[1].textContent = "YOU WON";
        }
    }
}