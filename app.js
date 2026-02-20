let ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];

// =====================
// ULOŽENIE
// =====================
function saveData() {
  localStorage.setItem("ingredients", JSON.stringify(ingredients));
  localStorage.setItem("meals", JSON.stringify(meals));
}

// =====================
// VYMAZAŤ VŠETKO
// =====================
function clearAll() {
  if (confirm("Naozaj chceš vymazať všetko?")) {
    ingredients = [];
    meals = [];
    localStorage.removeItem("ingredients");
    localStorage.removeItem("meals");
    renderAll();
  }
}

// =====================
// PRIDAŤ INGREDIENCIU
// =====================
function addIngredient() {
  const name = ingName.value.trim();
  const price = parseFloat(ingPrice.value);
  const grams = parseFloat(ingGrams.value);

  if (!name || isNaN(price) || isNaN(grams) || price <= 0 || grams <= 0) {
    alert("Vyplň všetko správne");
    return;
  }

  ingredients.push({ name, price, grams });
  saveData();
  renderAll();

  ingName.value = "";
  ingPrice.value = "";
  ingGrams.value = "";
}

// =====================
// PRIDAŤ JEDLO
// =====================
function addMeal() {
  const name = mealName.value.trim();
  const price = parseFloat(mealPrice.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("Vyplň všetko správne");
    return;
  }

  meals.push({ name, price, ingredients: [] });
  saveData();
  renderAll();

  mealName.value = "";
  mealPrice.value = "";
}

// =====================
// PRIDAŤ INGREDIENCIE DO JEDLA
// =====================
function addIngredientToMeal() {
  const mealIndex = mealSelect.value;
  const selected = Array.from(ingSelect.selectedOptions);

  if (mealIndex === "" || selected.length === 0) {
    alert("Vyber jedlo aj ingrediencie");
    return;
  }

  selected.forEach(opt => {
    const ingIndex = parseInt(opt.value);
    const grams = ingredients[ingIndex].grams;

    meals[mealIndex].ingredients.push({
      ingIndex,
      grams
    });
  });

  saveData();
  renderAll();
  ingSelect.selectedIndex = -1;
}

// =====================
// RENDER
// =====================
function renderAll() {
  renderIngredients();
  renderMeals();
  renderSelects();
}

// =====================
// INGREDIENCIE
// =====================
function renderIngredients() {
  ingredientsList.innerHTML = "";

  ingredients.forEach((ing, i) => {
    ingredientsList.innerHTML += `
      <li>
        ${ing.name} — ${ing.price.toFixed(2)} €/kg | ${ing.grams} g
        <button onclick="removeIngredient(${i})">❌</button>
      </li>
    `;
  });
}

// =====================
// JEDLÁ
// =====================
function renderMeals() {
  mealsList.innerHTML = "";

  meals.forEach((meal, i) => {
    let total = 0;
    let text = "";

    meal.ingredients.forEach(item => {
      const ing = ingredients[item.ingIndex];
      if (!ing) return;

      const cost = (ing.price / 1000) * item.grams;
      total += cost;

      text += `${ing.name} (${item.grams}g), `;
    });

    text = text.slice(0, -2);

    const profit = meal.price - total;
    const margin = meal.price > 0 ? (profit / meal.price) * 100 : 0;

    mealsList.innerHTML += `
      <li>
        <strong>${meal.name}</strong><br>
        Predaj: ${meal.price.toFixed(2)} €<br>
        Náklady: ${total.toFixed(2)} €<br>
        Ingrediencie: ${text || "žiadne"}<br>
        <b>Zisk: ${profit.toFixed(2)} € | Marža: ${margin.toFixed(1)} %</b>
        <button onclick="removeMeal(${i})">❌</button>
      </li>
    `;
  });
}

// =====================
// SELECTY
// =====================
function renderSelects() {
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingSelect.innerHTML = "";

  meals.forEach((m, i) => {
    mealSelect.innerHTML += `<option value="${i}">${m.name}</option>`;
  });

  ingredients.forEach((ing, i) => {
    ingSelect.innerHTML += `<option value="${i}">${ing.name}</option>`;
  });
}

// =====================
// MAZANIE
// =====================
function removeIngredient(i) {
  ingredients.splice(i, 1);

  // oprav indexy v jedlách
  meals.forEach(meal => {
    meal.ingredients = meal.ingredients.filter(item => item.ingIndex !== i);
    meal.ingredients.forEach(item => {
      if (item.ingIndex > i) {
        item.ingIndex--;
      }
    });
  });

  saveData();
  renderAll();
}

function removeMeal(i) {
  meals.splice(i, 1);
  saveData();
  renderAll();
}

// =====================
// INIT
// =====================
renderAll();
