// pevné kódy na testovanie
const validCodes = ["1234","5678"];

let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// login
function checkCode(){
  const c = document.getElementById("code").value;
  if(validCodes.includes(c)){
    document.getElementById("login").style.display="none";
    document.getElementById("app").style.display="block";
    render();
  } else {
    alert("Neplatný kód");
  }
}

// uloženie do LocalStorage
function save() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  localStorage.setItem("meals", JSON.stringify(meals));
  render();
}

// pridanie ingrediencie
function addIngredient() {
  const name = document.getElementById("ingName").value;
  const price = parseFloat(document.getElementById("ingPrice").value);
  const qty = parseFloat(document.getElementById("ingQty").value);
  if (!name || price <= 0 || qty <= 0) return;
  ingredients.push({ id: Date.now(), name, price, qty });
  save();
}

// pridanie jedla
function addMeal() {
  const name = document.getElementById("mealName").value;
  const price = parseFloat(document.getElementById("mealPrice").value);
  if (!name || price <= 0) return;
  meals.push({ id: Date.now(), name, price, items: [] });
  save();
}

// dropdowny
function updateDropdowns() {
  const mealSelect = document.getElementById("mealSelect");
  const ingSelect = document.getElementById("ingSelect");
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingSelect.innerHTML = '<option value="">Vyber ingredienciu</option>';
  meals.forEach(m => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = m.name;
    mealSelect.appendChild(option);
  });
  ingredients.forEach(i => {
    const option = document.createElement("option");
    option.value = i.id;
    option.textContent = i.name;
    ingSelect.appendChild(option);
  });
}

// pridanie ingrediencie do jedla
function addIngredientToMeal() {
  const mealId = parseInt(document.getElementById("mealSelect").value);
  const ingId = parseInt(document.getElementById("ingSelect").value);
  const amount = parseFloat(document.getElementById("ingAmount").value);
  if(!mealId || !ingId || !amount) return;
  const meal = meals.find(m => m.id === mealId);
  if(!meal) return;
  meal.items.push({ ingId, amount });
  save();
}

// výpočet nákladov
function calcMealCost(meal) {
  let total = 0;
  meal.items.forEach(item => {
    const ing = ingredients.find(i => i.id === item.ingId);
    if(!ing) return;
    total += (ing.price / ing.qty) * item.amount;
  });
  return total;
}

// zobrazenie
function render() {
  updateDropdowns();

  const ingList = document.getElementById("ingredientsList");
  ingList.innerHTML = "";
  ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.name} (€${i.price}/${i.qty}) `;
    
    const delBtn = document.createElement("button");
    delBtn.textContent = "Odstrániť";
    delBtn.className = "danger";
    delBtn.style.width = "100px";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      ingredients = ingredients.filter(ing => ing.id !== i.id);
      save();
    };

    li.appendChild(delBtn);
    ingList.appendChild(li);
  });

  const mealList = document.getElementById("mealsList");
  mealList.innerHTML = "";
  meals.forEach(m => {
    const cost = calcMealCost(m);
    const profit = m.price - cost;
    const margin = m.price ? (profit / m.price) * 100 : 0;

    const li = document.createElement("li");
    li.innerHTML = `<strong>${m.name}</strong> | náklad €${cost.toFixed(2)} | marža ${margin.toFixed(1)}%`;

    if(m.items.length) {
      const sublist = document.createElement("ul");
      m.items.forEach(it => {
        const ing = ingredients.find(i => i.id === it.ingId);
        if(!ing) return;
        const subli = document.createElement("li");
        subli.textContent = `${ing.name} - ${it.amount}`;
        subli.className = "ingredient-item";
        sublist.appendChild(subli);
      });
      li.appendChild(sublist);
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Odstrániť";
    delBtn.className = "danger";
    delBtn.style.width = "100px";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = () => {
      meals = meals.filter(meal => meal.id !== m.id);
      save();
    };

    li.appendChild(delBtn);
    mealList.appendChild(li);
  });
}

// tlačidlo na vymazanie všetkého
function clearAll() {
  if(confirm("Naozaj chcete vymazať všetky ingrediencie a jedlá?")) {
    ingredients = [];
    meals = [];
    save();
  }
}

