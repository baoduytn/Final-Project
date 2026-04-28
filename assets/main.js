let currentAmount = 1;

// Base jackpot chance (1%)
let baseJackpotChance = 0.01;

// Pity increases jackpot chance when losing
let pityBonus = 0;

// Max pity bonus (so jackpot chance never exceeds 10%)
const maxPityBonus = 0.15;

function generateMoney() {
    // Risk increases as money increases (max 40%)
    const riskFactor = Math.min(currentAmount / 500, 0.40);

    // Total jackpot chance = base + pity
    const jackpotChance = Math.min(baseJackpotChance + pityBonus, 0.10);

    // Roll once for all outcomes
    const roll = Math.random();

    // 🎰 JACKPOT
    if (roll < jackpotChance) {
        const jackpotMultiplier = Math.random() * 15 + 5; // 5x–20x
        currentAmount = Math.floor(currentAmount * jackpotMultiplier);

        // Reset pity
        pityBonus = 0;
    }

    // 💥 BIG DROP
    else if (roll < jackpotChance + riskFactor) {
        const dropPercent = Math.random() * 0.40 + 0.30; // 30%–70%
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));

        // Increase pity slightly (0.5% per loss)
        pityBonus = Math.min(pityBonus + 0.01, maxPityBonus);
    }

    // 📈 EXPONENTIAL GROWTH
    else {
        const growthFactor = 1.1 + Math.random() * 0.5; // 1.1x–1.6x
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;

        // Growth does NOT increase pity
        // But also does NOT reset it
    }

    document.getElementById("moneyText").textContent = "$" + currentAmount;
}
