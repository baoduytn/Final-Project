let currentAmount = 1;

function generateMoney() {
    // 10% chance of a big drop
    const dropChance = Math.random();

    if (dropChance < 0.10) {
        // Lose 30%–60%
        const dropPercent = Math.random() * 0.30 + 0.30;
        currentAmount = Math.max(1, Math.floor(currentAmount * (1 - dropPercent)));
    } else {
        // Exponential growth: 1.1x–1.5x
        const growthFactor = 1.1 + Math.random() * 0.4;
        currentAmount = Math.floor(currentAmount * growthFactor) + 1;
    }

    // Update the text
    document.getElementById("moneyText").textContent = "$" + currentAmount;
}
