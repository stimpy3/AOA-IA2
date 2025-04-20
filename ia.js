const form = document.getElementById("inputForm");
const itemInputs = document.getElementById("itemInputs");
const startBtn = document.getElementById("startBtn");
const knapsackBar = document.getElementById("knapsackBar");
const log = document.getElementById("log");

let items = [];
let capacity = 0;

form.onsubmit = function (e) {
  e.preventDefault();
  itemInputs.innerHTML = "";
  items = [];
  const num = +document.getElementById("numItems").value;
  capacity = +document.getElementById("capacity").value;

  for (let i = 0; i < num; i++) {
    itemInputs.innerHTML += `
      <label>Item ${i + 1} Profit: <input type="number" class="profit" required></label>
      <label>Weight: <input type="number" class="weight" required></label><br>
    `;
  }

  startBtn.style.display = "block";
};

startBtn.onclick = function () {
  const profits = document.querySelectorAll(".profit");
  const weights = document.querySelectorAll(".weight");

  items = [];
  for (let i = 0; i < profits.length; i++) {
    const profit = +profits[i].value;
    const weight = +weights[i].value;
    items.push({ id: i + 1, profit, weight, ratio: profit / weight });
  }

  // Sort items by profit/weight ratio (descending)
  items.sort((a, b) => b.ratio - a.ratio);

  log.innerHTML = "<strong>Filling knapsack...</strong><br>";
  knapsackBar.innerHTML = "";
  fillKnapsack();
};

function fillKnapsack() {
  let remaining = capacity;
  let totalValue = 0;
  const takenItems = [];

  const colors = ["#76654c", "#8f8153", "#8e8e8e"];
  let colorIndex = 0;

  // Step 1: Take items greedily
  for (let item of items) {
    if (remaining <= 0) break;

    const takeWeight = Math.min(item.weight, remaining);
    const fraction = takeWeight / item.weight;
    const valueTaken = item.profit * fraction;
    totalValue += valueTaken;
    remaining -= takeWeight;

    takenItems.push({ ...item, takeWeight });

    log.innerHTML += `Item ${item.id}: Took ${takeWeight} of ${item.weight}, value = ${valueTaken.toFixed(2)}<br>`;
  }

  // Step 2: Normalize bar widths based on relative taken amounts
  const totalTakenWeight = takenItems.reduce((sum, item) => sum + item.takeWeight, 0);

  knapsackBar.innerHTML = "";
  for (let item of takenItems) {
    const barWidthPercent = (item.takeWeight / totalTakenWeight) * 100;

    const div = document.createElement("div");
    div.className = "knapsack-item";
    div.style.width = `${barWidthPercent}%`;
    div.style.backgroundColor = colors[colorIndex % colors.length];
    div.style.color = "black";
    div.style.textAlign = "center";
    div.style.padding = "4px 0";
    div.innerText = `Item ${item.id}`;
    knapsackBar.appendChild(div);

    colorIndex++;
  }

  log.innerHTML += `<br><strong>Total value: ${totalValue.toFixed(2)}</strong>`;
}
