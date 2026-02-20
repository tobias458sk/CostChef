function renderSelects() {
  mealSelect.innerHTML = '<option value="">Vyber jedlo</option>';
  ingredientCheckboxList.innerHTML = "";

  meals.forEach((m, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = m.name;
    mealSelect.appendChild(option);
  });

  ingredients.forEach((ing, i) => {
    const label = document.createElement("label");
    label.className = "checkbox-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;

    // Pridáme input na množstvo v gramoch
    const gramsInput = document.createElement("input");
    gramsInput.type = "number";
    gramsInput.min = "1";
    gramsInput.value = ing.grams; // predvolené
    gramsInput.style.width = "60px";

    const span = document.createElement("span");
    span.textContent = `${ing.name} (${ing.price.toFixed(2)} €/kg)`;

    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(gramsInput);
    ingredientCheckboxList.appendChild(label);
  });
}

function addSelectedIngredients() {
  const mealIndex = mealSelect.value;

  if (mealIndex === "") {
    alert("Vyber jedlo");
    return;
  }

  const checked = document.querySelectorAll("#ingredientCheckboxList input[type='checkbox']:checked");

  if (checked.length === 0) {
    alert("Označ aspoň jednu surovinu");
    return;
  }

  checked.forEach(cb => {
    const label = cb.parentElement;
    const ingIndex = parseInt(cb.value);
    const gramsInput = label.querySelector("input[type='number']");
    const grams = parseFloat(gramsInput.value);

    if (isNaN(grams) || grams <= 0) {
      alert("Zadaj platné množstvo pre " + ingredients[ingIndex].name);
      return;
    }

    meals[mealIndex].ingredients.push({ ingIndex, grams });
    cb.checked = false;
  });

  saveData();
  renderAll();
}

const recipeModal = document.getElementById("recipeModal");
const openModalBtn = document.getElementById("openRecipeModal");
const closeModalBtn = document.getElementById("closeRecipeModal");

// Otvoriť modal
openModalBtn.onclick = () => recipeModal.style.display = "block";

// Zavrieť modal
closeModalBtn.onclick = () => recipeModal.style.display = "none";

// Zavrieť kliknutím mimo obsahu
window.onclick = (e) => { 
  if (e.target == recipeModal) recipeModal.style.display = "none"; 
}
