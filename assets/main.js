let currentAmount = 1;

// Base jackpot chance (1%)
let baseJackpotChance = 0.01;

// Pity increases jackpot chance when losing
let pityBonus = 0;

// Max pity bonus (you set 15%)
const maxPityBonus = 0.15;

function generateMoney() {

    // ⭐ Risk increases as money increases (max 60%)
    // You had 40%, but dynamic loss works better with a higher cap
    const riskFactor = Math.min(currentAmount / 200, 0.50);

    // ⭐ Total jackpot chance = base + pity
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);

    // Roll once for all outcomes
    const roll = Math.random();

    // 🎰 JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 100 + 5; // 5x–20x
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);

        // Reset pity
        pityBonus = 0;
    }

    // 💥 BIG DROP (chance increases with money)
    else if (roll < jackpotChance + riskFactor) {

        // ⭐ Loss size increases with money
        // Minimum 20% loss, maximum 90% loss
        const dynamicLoss = Math.min(currentAmount / 200, 0.70);
        const dropPercent = 0.20 + Math.random() * dynamicLoss;

        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));

        // ⭐ Increase pity slightly (you set +0.01 = +1% per loss)
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
    }

    // 📈 EXPONENTIAL GROWTH
    else {
        const growthFactor = 1.1 + Math.random() * 0.5; // 1.1x–1.6x
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;

        // Growth does NOT increase pity
        // Growth does NOT reset pity
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;
}
