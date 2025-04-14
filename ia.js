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
  
    const colors = ["#7a674e", "#e2dcc7", "#545454"];
    let colorIndex = 0;
  
    for (let item of items) {
      if (remaining <= 0) break;
  
      const takeWeight = Math.min(item.weight, remaining);
      const fraction = takeWeight / item.weight;
      const valueTaken = item.profit * fraction;
      totalValue += valueTaken;
      remaining -= takeWeight;
  
      const div = document.createElement("div");
      div.className = "knapsack-item";
      div.style.width = `${(takeWeight / capacity) * 100}%`;
      div.style.background = colors[colorIndex % colors.length];
      div.style.color = "black";
      div.innerText = `Item ${item.id} (${Math.round(fraction * 100)}%)`;
      knapsackBar.appendChild(div);
  
      log.innerHTML += `Item ${item.id}: Took ${takeWeight} of ${item.weight}, value = ${valueTaken.toFixed(2)}<br>`;
      colorIndex++;
    }
  
    log.innerHTML += `<br><strong>Total value: ${totalValue.toFixed(2)}</strong>`;
  }

// Return a random color from the theme (excluding white to ensure readability)
function getRandomThemeColor() {
  const colors = ["#76654c", "#545454", "#e2dcc7"];
  return colors[Math.floor(Math.random() * colors.length)];
}

