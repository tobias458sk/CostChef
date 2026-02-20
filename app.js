let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// ULOŽENIE
function saveData() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  localStorage.setItem("meals", JSON.stringify(meals));
}

// VYMAZAŤ VŠETKO
function clearAll() {
  if (confirm("Naozaj chceš vymazať všetko?")) {
    ingredients = [];
    meals = [];
    localStorage.clear();
    renderAll();
  }
}

// PRIDAŤ INGREDIENCIU
function addIngredient() {
  const name = ingName.value.trim();
  const price = parseFloat(ingPrice.value);
  const grams = parseFloat(ingGrams.value);

  if (!name || isNaN(price) || isNaN(grams)) {
    alert("Vyplň všetko");
    return;
  }

  ingredients.push({ name, price, grams });
  saveData();
  renderAll();

  ingName.value = "";
  ingPrice.value = "";
  ingGrams.value = "";
}

// PRIDAŤ JEDLO
function addMeal() {
  const name = mealName.value.trim();
  const price = parseFloat(mealPrice.value);

  if (!name || isNaN(price)) {
    alert("Vyplň všetko");
    return;
  }

  meals.push({ name, price, ingredients: [] });
  saveData();
  renderAll();

  mealName.value = "";
  mealPrice.value = "";
}

// PRIDAŤ INGREDIENCIU DO JEDLA (zadáš vlastné gramy)
function addIngredientToMeal() {
  const mealIndex = mealSelect.value;
  const ingIndex = ingSelect.value;

  if (mealIndex === "" || ingIndex === "") {
    alert("Vyber jedlo aj ingredienciu");
    return;
  }

  const grams = parseFloat(prompt("Zadaj počet gramov pre túto surovinu:"));

  if (isNaN(grams)) {
    alert("Zadaj správne číslo");
    return;
  }

  meals[mealIndex].ingredients.push({ ingIndex, grams });

  saveData();
  renderAll();
}

// VÝPOČET NÁKLADOV
function calculateCost(meal) {
  let total = 0;
  meal.ingredients.forEach(item => {
    const ing = ingredients[item.ingIndex];
    if (!ing) return;
    total += (ing.price / 1000) * item.grams;
  });
  return total;
}

// RENDER
function renderAll() {
  renderIngredients();
  renderMeals();
  renderSelects();
  renderSummary();
}

// INGREDIENCIE
function renderIngredients() {
  ingredientsList.innerHTML = "";

  ingredients.forEach((ing, i) => {
    ingredientsList.innerHTML += `
      <li>
        ${ing.name} — ${ing.price.toFixed(2)} €/kg
        <button onclick="removeIngredient(${i})">❌</button>
      </li>
    `;
  });
}

// JEDLÁ
function renderMeals() {
  mealsList.innerHTML = "";

  meals.forEach((meal, i) => {

    const total = calculateCost(meal);
    const profit = meal.price - total;
    const margin = meal.price ? (profit / meal.price) * 100 : 0;

    let marginColor = "#00ffae";
    if (margin < 30) marginColor = "#ff3b3b";
    else if (margin < 70) marginColor = "#ffaa00";

    let mealClass = profit < 0 ? "meal-card loss" : "meal-card";

    let ingredientsText = "";
    meal.ingredients.forEach(item => {
      const ing = ingredients[item.ingIndex];
      if (!ing) return;
      ingredientsText += `${ing.name} (${item.grams}g), `;
    });

    ingredientsText = ingredientsText.slice(0, -2);

    mealsList.innerHTML += `
      <li class="${mealClass}">
        <h3>${meal.name}</h3>

        <div class="meal-grid">
          <div>
            <small>Predajná cena</small>
            <div class="big">${meal.price.toFixed(2)} €</div>
          </div>

          <div>
            <small>Náklady</small>
            <div class="big">${total.toFixed(2)} €</div>
          </div>

          <div>
            <small>Zisk</small>
            <div class="big">${profit.toFixed(2)} €</div>
          </div>

          <div>
            <small>Marža</small>
            <div class="big" style="color:${marginColor}">
              ${margin.toFixed(1)} %
            </div>
          </div>
        </div>

        <div class="ingredients-list">
          <strong>Ingrediencie:</strong><br>
          ${ingredientsText || "žiadne"}
        </div>

        <button onclick="removeMeal(${i})" class="danger-small">Vymazať</button>
      </li>
    `;
  });
}

// SELECTY
function renderSelects() {
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingSelect.innerHTML = '<option value="">Vyber ingredienciu</option>';

  meals.forEach((m, i) => {
    mealSelect.innerHTML += `<option value="${i}">${m.name}</option>`;
  });

  ingredients.forEach((ing, i) => {
    ingSelect.innerHTML += `<option value="${i}">${ing.name}</option>`;
  });
}

// SUMMARY
function renderSummary() {
  sumIngredients.textContent = ingredients.length;
  sumMeals.textContent = meals.length;
}

// MAZANIE
function removeIngredient(i) {
  ingredients.splice(i, 1);
  saveData();
  renderAll();
}

function removeMeal(i) {
  meals.splice(i, 1);
  saveData();
  renderAll();
}

renderAll();