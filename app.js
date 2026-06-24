const STORAGE_KEY = "familyFoodPlanner.v1";

const CATEGORY_ORDER = [
  "Produce",
  "Meat",
  "Dairy",
  "Pantry",
  "Frozen",
  "Bakery",
  "Household",
  "Other",
];

const PANTRY_PHOTO_IMPORT_ID = "pantry-photos-2026-06-24";
const PANTRY_PHOTO_IMPORT_LINES = `
Barilla rotini | Pantry
tri-color rotini | Pantry
tuna cans | Pantry
Ritz fresh stacks crackers | Pantry
instant noodles | Pantry
snack chips | Pantry
boxed curry mix | Pantry
corn starch | Pantry
cane sugar | Pantry
gochugaru Korean red pepper powder | Pantry
soy sauce | Pantry
soba sauce | Pantry
fish sauce | Pantry
rice vinegar | Pantry
aji-mirin sweet cooking rice seasoning | Pantry
sesame oil | Pantry
Maggi seasoning | Pantry
Cholula hot sauce | Pantry
food coloring | Pantry
ground cinnamon | Pantry
coarse kosher salt | Pantry
sea salt crystals | Pantry
MSG seasoning | Pantry
garlic powder | Pantry
whole black peppercorns | Pantry
paprika | Pantry
mushroom umami seasoning | Pantry
olives | Pantry
milk | Dairy
Siggi's yogurt | Dairy
sparkling water | Pantry
`;

const SLOT_ORDER = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
  Prep: 4,
};

const UNIT_WORDS = new Set([
  "bag",
  "bags",
  "bottle",
  "bottles",
  "box",
  "boxes",
  "bunch",
  "bunches",
  "can",
  "cans",
  "clove",
  "cloves",
  "cup",
  "cups",
  "each",
  "g",
  "gal",
  "head",
  "heads",
  "jar",
  "lb",
  "lbs",
  "loaf",
  "loaves",
  "oz",
  "pack",
  "packs",
  "package",
  "packages",
  "pint",
  "pints",
  "qt",
  "tbsp",
  "tsp",
]);

const SAMPLE_RECIPES = [
  {
    id: "recipe-rice-bowls",
    name: "Chicken veggie rice bowls",
    time: "35 min",
    servings: 4,
    tags: ["quick", "kid-friendly", "leftovers"],
    chloeNote: "Keep sauce on the side and add peas or cucumber.",
    ingredients: [
      ingredient("1", "lb", "chicken breast", "Meat"),
      ingredient("2", "cups", "rice", "Pantry"),
      ingredient("1", "head", "broccoli", "Produce"),
      ingredient("2", "each", "carrots", "Produce"),
      ingredient("1", "bottle", "teriyaki sauce", "Pantry"),
    ],
    steps: [
      "Cook rice.",
      "Roast broccoli and carrots.",
      "Cook chicken in a skillet.",
      "Serve sauce separately for Chloe.",
    ],
  },
  {
    id: "recipe-meatballs",
    name: "Turkey meatballs and pasta",
    time: "45 min",
    servings: 5,
    tags: ["kid-friendly", "leftovers"],
    chloeNote: "Serve a few plain meatballs before saucing.",
    ingredients: [
      ingredient("1", "lb", "ground turkey", "Meat"),
      ingredient("1", "box", "pasta", "Pantry"),
      ingredient("1", "jar", "marinara", "Pantry"),
      ingredient("1", "each", "egg", "Dairy"),
      ingredient("1/2", "cup", "breadcrumbs", "Pantry"),
      ingredient("1", "bag", "spinach", "Produce"),
    ],
    steps: [
      "Mix turkey, egg, breadcrumbs, and seasoning.",
      "Bake or pan cook meatballs.",
      "Boil pasta and warm sauce.",
      "Add spinach for adults or chop it into sauce.",
    ],
  },
  {
    id: "recipe-salmon",
    name: "Salmon rice and cucumber",
    time: "30 min",
    servings: 3,
    tags: ["quick", "kid-friendly"],
    chloeNote: "Offer flaked salmon, rice, cucumber, and fruit separately.",
    ingredients: [
      ingredient("1.25", "lb", "salmon", "Meat"),
      ingredient("1.5", "cups", "rice", "Pantry"),
      ingredient("2", "each", "cucumbers", "Produce"),
      ingredient("1", "each", "lemon", "Produce"),
      ingredient("1", "cup", "yogurt", "Dairy"),
    ],
    steps: [
      "Bake salmon with lemon.",
      "Cook rice.",
      "Slice cucumber.",
      "Make yogurt sauce for adults.",
    ],
  },
  {
    id: "recipe-fried-rice",
    name: "Egg fried rice",
    time: "25 min",
    servings: 4,
    tags: ["quick", "kid-friendly", "one-pan"],
    chloeNote: "Use low-sodium soy sauce or add sauce after serving.",
    ingredients: [
      ingredient("3", "cups", "cooked rice", "Pantry"),
      ingredient("4", "each", "eggs", "Dairy"),
      ingredient("1", "bag", "frozen peas and carrots", "Frozen"),
      ingredient("1", "bunch", "green onions", "Produce"),
      ingredient("1", "bottle", "soy sauce", "Pantry"),
    ],
    steps: [
      "Scramble eggs and set aside.",
      "Stir fry vegetables and rice.",
      "Fold eggs back in.",
      "Add soy sauce at the end.",
    ],
  },
  {
    id: "recipe-taco-bowls",
    name: "Taco bowls",
    time: "30 min",
    servings: 4,
    tags: ["quick", "kid-friendly", "leftovers"],
    chloeNote: "Serve rice, beans, cheese, and avocado in separate piles.",
    ingredients: [
      ingredient("1", "lb", "ground beef or turkey", "Meat"),
      ingredient("1", "pack", "taco seasoning", "Pantry"),
      ingredient("2", "cups", "rice", "Pantry"),
      ingredient("1", "can", "black beans", "Pantry"),
      ingredient("1", "bag", "shredded cheese", "Dairy"),
      ingredient("2", "each", "avocados", "Produce"),
      ingredient("1", "jar", "salsa", "Pantry"),
    ],
    steps: [
      "Cook rice.",
      "Brown meat with seasoning.",
      "Warm beans.",
      "Set toppings out family style.",
    ],
  },
  {
    id: "recipe-sheet-pan",
    name: "Sheet pan sausage and sweet potatoes",
    time: "40 min",
    servings: 4,
    tags: ["one-pan", "leftovers"],
    chloeNote: "Slice sausage small and keep roasted vegetables simple.",
    ingredients: [
      ingredient("1", "pack", "chicken sausage", "Meat"),
      ingredient("3", "each", "sweet potatoes", "Produce"),
      ingredient("1", "each", "red onion", "Produce"),
      ingredient("1", "bag", "green beans", "Produce"),
      ingredient("1", "loaf", "bread", "Bakery"),
    ],
    steps: [
      "Chop sausage and vegetables.",
      "Roast on one pan.",
      "Serve with bread or fruit.",
    ],
  },
];

const els = {
  previousWeek: document.querySelector("#previousWeek"),
  nextWeek: document.querySelector("#nextWeek"),
  todayButton: document.querySelector("#todayButton"),
  weekLabel: document.querySelector("#weekLabel"),
  plannedCount: document.querySelector("#plannedCount"),
  sharedCount: document.querySelector("#sharedCount"),
  chloeCount: document.querySelector("#chloeCount"),
  chloeFavoriteCount: document.querySelector("#chloeFavoriteCount"),
  homeCount: document.querySelector("#homeCount"),
  groceryCount: document.querySelector("#groceryCount"),
  tabs: [...document.querySelectorAll(".tab-button")],
  views: [...document.querySelectorAll(".view")],
  mealForm: document.querySelector("#mealForm"),
  mealFormTitle: document.querySelector("#mealFormTitle"),
  editingMealId: document.querySelector("#editingMealId"),
  mealDay: document.querySelector("#mealDay"),
  mealSlot: document.querySelector("#mealSlot"),
  mealRecipe: document.querySelector("#mealRecipe"),
  customMealLabel: document.querySelector("#customMealLabel"),
  customMealName: document.querySelector("#customMealName"),
  mealAudience: document.querySelector("#mealAudience"),
  chloeNote: document.querySelector("#chloeNote"),
  extraGroceries: document.querySelector("#extraGroceries"),
  saveMealButton: document.querySelector("#saveMealButton"),
  cancelMealEdit: document.querySelector("#cancelMealEdit"),
  quickPickList: document.querySelector("#quickPickList"),
  shuffleIdeas: document.querySelector("#shuffleIdeas"),
  weekGrid: document.querySelector("#weekGrid"),
  recipeForm: document.querySelector("#recipeForm"),
  recipeFormTitle: document.querySelector("#recipeFormTitle"),
  editingRecipeId: document.querySelector("#editingRecipeId"),
  recipeName: document.querySelector("#recipeName"),
  recipeTime: document.querySelector("#recipeTime"),
  recipeServings: document.querySelector("#recipeServings"),
  recipeTags: document.querySelector("#recipeTags"),
  recipeIngredients: document.querySelector("#recipeIngredients"),
  recipeChloeNote: document.querySelector("#recipeChloeNote"),
  recipeSteps: document.querySelector("#recipeSteps"),
  saveRecipeButton: document.querySelector("#saveRecipeButton"),
  cancelRecipeEdit: document.querySelector("#cancelRecipeEdit"),
  recipeSearch: document.querySelector("#recipeSearch"),
  recipeFilter: document.querySelector("#recipeFilter"),
  recipeTotal: document.querySelector("#recipeTotal"),
  recipeList: document.querySelector("#recipeList"),
  homeIngredientForm: document.querySelector("#homeIngredientForm"),
  homeIngredientName: document.querySelector("#homeIngredientName"),
  homeIngredientAmount: document.querySelector("#homeIngredientAmount"),
  homeIngredientCategory: document.querySelector("#homeIngredientCategory"),
  homeIngredientUseSoon: document.querySelector("#homeIngredientUseSoon"),
  bulkHomeForm: document.querySelector("#bulkHomeForm"),
  bulkHomeIngredients: document.querySelector("#bulkHomeIngredients"),
  chloeFavoriteForm: document.querySelector("#chloeFavoriteForm"),
  chloeFavoriteName: document.querySelector("#chloeFavoriteName"),
  chloeFavoriteNote: document.querySelector("#chloeFavoriteNote"),
  homeRecommendations: document.querySelector("#homeRecommendations"),
  chloeFavoriteList: document.querySelector("#chloeFavoriteList"),
  homeIngredientList: document.querySelector("#homeIngredientList"),
  manualGroceryForm: document.querySelector("#manualGroceryForm"),
  manualGroceryName: document.querySelector("#manualGroceryName"),
  manualGroceryAmount: document.querySelector("#manualGroceryAmount"),
  manualGroceryCategory: document.querySelector("#manualGroceryCategory"),
  clearCheckedGroceries: document.querySelector("#clearCheckedGroceries"),
  printGroceries: document.querySelector("#printGroceries"),
  groceryList: document.querySelector("#groceryList"),
};

let quickOffset = 0;
let state = loadState();

bindEvents();
render();

function ingredient(amount, unit, name, category) {
  return {
    id: createId(),
    amount,
    unit,
    name,
    category,
  };
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  const todayWeekStart = toIso(startOfWeek(new Date()));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialState = defaultState(todayWeekStart);
      const importedState = applyBuiltInImports(initialState);
      if (importedState.changed) {
        persistState(importedState.state);
      }
      return importedState.state;
    }

    const parsed = JSON.parse(raw);
    const loadedState = {
      ...defaultState(todayWeekStart),
      ...parsed,
      recipes: parsed.recipes?.length ? parsed.recipes : SAMPLE_RECIPES,
      planItems: parsed.planItems || [],
      chloeFavorites: parsed.chloeFavorites || [],
      homeIngredients: parsed.homeIngredients || [],
      manualGroceries: parsed.manualGroceries || [],
      groceryChecked: parsed.groceryChecked || {},
      appliedImports: parsed.appliedImports || [],
      selectedDate: parsed.selectedDate || toIso(new Date()),
      activeTab: getInitialActiveTab(parsed.activeTab || "planner"),
    };
    const importedState = applyBuiltInImports(loadedState);
    if (importedState.changed) {
      persistState(importedState.state);
    }
    return importedState.state;
  } catch (error) {
    console.warn("Could not load saved food planner data", error);
    return defaultState(todayWeekStart);
  }
}

function defaultState(weekStart) {
  return {
    weekStart,
    activeTab: getInitialActiveTab("planner"),
    recipes: SAMPLE_RECIPES,
    planItems: seedPlanItems(weekStart),
    chloeFavorites: [],
    homeIngredients: [],
    manualGroceries: [],
    groceryChecked: {},
    appliedImports: [],
    selectedDate: toIso(new Date()),
  };
}

function applyBuiltInImports(nextState) {
  const appliedImports = Array.isArray(nextState.appliedImports) ? nextState.appliedImports : [];
  if (appliedImports.includes(PANTRY_PHOTO_IMPORT_ID)) {
    nextState.appliedImports = appliedImports;
    return { state: nextState, changed: false };
  }

  nextState.homeIngredients = Array.isArray(nextState.homeIngredients)
    ? nextState.homeIngredients
    : [];

  parseIngredientLines(PANTRY_PHOTO_IMPORT_LINES).forEach((item) => {
    mergeHomeIngredient(nextState.homeIngredients, item);
  });

  nextState.appliedImports = [...appliedImports, PANTRY_PHOTO_IMPORT_ID];
  return { state: nextState, changed: true };
}

function getInitialActiveTab(fallback) {
  const requested = new URLSearchParams(window.location.search).get("tab");
  const validTabs = new Set(["planner", "recipes", "home", "groceries"]);
  if (validTabs.has(requested)) {
    return requested;
  }
  return validTabs.has(fallback) ? fallback : "planner";
}

function seedPlanItems(weekStart) {
  const monday = fromIso(weekStart);
  return [
    {
      id: createId(),
      date: toIso(monday),
      slot: "Dinner",
      recipeId: "recipe-rice-bowls",
      title: "Chicken veggie rice bowls",
      audience: "Everyone",
      chloeNote: "Sauce on side.",
      extraGroceries: [],
      done: false,
    },
    {
      id: createId(),
      date: toIso(addDays(monday, 2)),
      slot: "Dinner",
      recipeId: "recipe-fried-rice",
      title: "Egg fried rice",
      audience: "Chloe version",
      chloeNote: "Pull Chloe portion before soy sauce.",
      extraGroceries: [ingredient("1", "pint", "berries", "Produce")],
      done: false,
    },
    {
      id: createId(),
      date: toIso(addDays(monday, 4)),
      slot: "Dinner",
      recipeId: "recipe-taco-bowls",
      title: "Taco bowls",
      audience: "Everyone",
      chloeNote: "Keep toppings separate.",
      extraGroceries: [],
      done: false,
    },
  ];
}

function saveState() {
  persistState(state);
}

function persistState(nextState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (error) {
    console.warn("Could not save food planner data", error);
  }
}

function saveAndRender() {
  saveState();
  render();
}

function bindEvents() {
  els.previousWeek.addEventListener("click", () => {
    state.weekStart = toIso(addDays(fromIso(state.weekStart), -7));
    state.selectedDate = toIso(addDays(fromIso(state.selectedDate || state.weekStart), -7));
    resetMealForm(false);
    saveAndRender();
  });

  els.nextWeek.addEventListener("click", () => {
    state.weekStart = toIso(addDays(fromIso(state.weekStart), 7));
    state.selectedDate = toIso(addDays(fromIso(state.selectedDate || state.weekStart), 7));
    resetMealForm(false);
    saveAndRender();
  });

  els.todayButton.addEventListener("click", () => {
    const today = new Date();
    state.weekStart = toIso(startOfWeek(today));
    state.selectedDate = toIso(today);
    resetMealForm(false);
    saveAndRender();
  });

  els.tabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      saveAndRender();
    });
  });

  els.mealRecipe.addEventListener("change", syncCustomMealVisibility);
  els.mealForm.addEventListener("submit", handleMealSubmit);
  els.cancelMealEdit.addEventListener("click", () => {
    resetMealForm(true);
  });

  els.shuffleIdeas.addEventListener("click", () => {
    quickOffset += 3;
    renderQuickPicks();
  });

  els.weekGrid.addEventListener("click", handleWeekClick);
  els.recipeForm.addEventListener("submit", handleRecipeSubmit);
  els.cancelRecipeEdit.addEventListener("click", () => {
    resetRecipeForm(true);
  });
  els.recipeSearch.addEventListener("input", renderRecipes);
  els.recipeFilter.addEventListener("change", renderRecipes);
  els.recipeList.addEventListener("click", handleRecipeClick);
  els.homeIngredientForm.addEventListener("submit", handleHomeIngredientSubmit);
  els.bulkHomeForm.addEventListener("submit", handleBulkHomeSubmit);
  els.chloeFavoriteForm.addEventListener("submit", handleChloeFavoriteSubmit);
  els.chloeFavoriteList.addEventListener("click", handleChloeFavoriteClick);
  els.homeIngredientList.addEventListener("click", handleHomeIngredientClick);
  els.homeRecommendations.addEventListener("click", handleRecommendationClick);
  els.manualGroceryForm.addEventListener("submit", handleManualGrocerySubmit);
  els.groceryList.addEventListener("change", handleGroceryChange);
  els.groceryList.addEventListener("click", handleGroceryClick);
  els.clearCheckedGroceries.addEventListener("click", () => {
    state.groceryChecked = {};
    saveAndRender();
  });
  els.printGroceries.addEventListener("click", () => {
    window.print();
  });
}

function render() {
  const weekDates = getWeekDates();
  ensureSelectedDate(weekDates);
  renderTabs();
  renderWeekLabel(weekDates);
  renderMealFormOptions(weekDates);
  renderRecipeOptions();
  syncCustomMealVisibility();
  renderSummary();
  renderQuickPicks();
  renderWeekGrid(weekDates);
  renderRecipes();
  renderHome();
  renderGroceries();
}

function renderTabs() {
  els.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });

  els.views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === state.activeTab);
  });
}

function renderWeekLabel(weekDates) {
  const first = formatDate(weekDates[0], { month: "short", day: "numeric" });
  const last = formatDate(weekDates[6], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  els.weekLabel.textContent = `${first} - ${last}`;
}

function ensureSelectedDate(weekDates) {
  const selected = state.selectedDate || toIso(new Date());
  const selectedInWeek = weekDates.some((date) => toIso(date) === selected);
  if (selectedInWeek) {
    return;
  }

  const todayIso = toIso(new Date());
  const todayInWeek = weekDates.some((date) => toIso(date) === todayIso);
  state.selectedDate = todayInWeek ? todayIso : toIso(weekDates[0]);
}

function renderMealFormOptions(weekDates) {
  const currentValue = els.mealDay.value;
  els.mealDay.innerHTML = weekDates
    .map((date) => {
      const iso = toIso(date);
      return `<option value="${iso}">${escapeHtml(formatDayOption(date))}</option>`;
    })
    .join("");

  const nextDate = state.selectedDate || getFirstOpenDinnerDate() || toIso(weekDates[0]);
  els.mealDay.value = currentValue || nextDate;
}

function renderRecipeOptions() {
  const currentValue = els.mealRecipe.value;
  const options = [
    `<option value="">Simple meal</option>`,
    ...state.recipes
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((recipe) => `<option value="${recipe.id}">${escapeHtml(recipe.name)}</option>`),
  ];

  els.mealRecipe.innerHTML = options.join("");
  if (state.recipes.some((recipe) => recipe.id === currentValue)) {
    els.mealRecipe.value = currentValue;
  }
}

function renderSummary() {
  const meals = getCurrentWeekMeals();
  const groceries = buildGroceryItems();

  els.plannedCount.textContent = meals.length;
  els.sharedCount.textContent = meals.filter((meal) => meal.audience === "Everyone").length;
  els.chloeCount.textContent = meals.filter((meal) => meal.audience === "Chloe version").length;
  els.chloeFavoriteCount.textContent = state.chloeFavorites.length;
  els.homeCount.textContent = state.homeIngredients.length;
  els.groceryCount.textContent = groceries.length;
  if (els.recipeTotal) {
    els.recipeTotal.textContent = state.recipes.length;
  }
}

function renderQuickPicks() {
  const plannedRecipeIds = new Set(getCurrentWeekMeals().map((meal) => meal.recipeId));
  const recipes = state.recipes
    .filter((recipe) => !plannedRecipeIds.has(recipe.id))
    .sort((a, b) => scoreRecipeForHome(b) - scoreRecipeForHome(a));

  const rotated = rotateArray(recipes, quickOffset).slice(0, 4);

  if (!rotated.length) {
    els.quickPickList.innerHTML = `<div class="empty-state"><strong>Week is full</strong><span>Favorites are already planned.</span></div>`;
    return;
  }

  els.quickPickList.innerHTML = rotated
    .map(
      (recipe) => {
        const analysis = analyzeRecipe(recipe);
        const homeText = state.homeIngredients.length
          ? ` · Have ${analysis.have.length}/${analysis.total}`
          : "";
        const chloeText = analysis.favoriteMatches.length
          ? ` · Chloe likes ${analysis.favoriteMatches[0].name}`
          : "";
        return `
          <article class="quick-pick">
            <div>
              <strong>${escapeHtml(recipe.name)}</strong>
              <span>${escapeHtml(recipe.time || "Anytime")} · ${escapeHtml(recipe.tags.slice(0, 2).join(", ") || "recipe")}${escapeHtml(homeText)}${escapeHtml(chloeText)}</span>
            </div>
            <button class="add-button" type="button" data-action="quick-add" data-id="${recipe.id}" aria-label="Add ${escapeAttribute(recipe.name)}">+</button>
          </article>
        `;
      },
    )
    .join("");
}

function renderWeekGrid(weekDates) {
  const meals = getCurrentWeekMeals();
  const selectedIso = state.selectedDate || toIso(weekDates[0]);
  const selectedDate = fromIso(selectedIso);
  const selectedMeals = meals
    .filter((meal) => meal.date === selectedIso)
    .sort((a, b) => (SLOT_ORDER[a.slot] || 99) - (SLOT_ORDER[b.slot] || 99));

  const dayPills = weekDates
    .map((date) => {
      const iso = toIso(date);
      const hasMeals = meals.some((meal) => meal.date === iso);
      const selected = iso === selectedIso;

      return `
        <button class="day-pill ${selected ? "selected" : ""}" type="button" data-action="select-day" data-date="${iso}">
          <span>${escapeHtml(formatDate(date, { weekday: "short" }).slice(0, 1))}</span>
          <strong>${escapeHtml(formatDate(date, { day: "numeric" }))}</strong>
          ${hasMeals ? `<i aria-hidden="true"></i>` : ""}
        </button>
      `;
    })
    .join("");

  const mealCards = selectedMeals.length
    ? selectedMeals.map(renderMealCard).join("")
    : `<div class="empty-state"><strong>No meal yet</strong><span>Ready for a plan.</span><button class="add-day-button" type="button" data-action="set-day" data-date="${selectedIso}">Add dinner</button></div>`;

  els.weekGrid.innerHTML = `
    <div class="day-pill-row">${dayPills}</div>
    <div class="selected-day-heading">
      ${escapeHtml(formatDate(selectedDate, { weekday: "long", month: "short", day: "numeric" }))}
    </div>
    <div class="day-body">${mealCards}</div>
  `;
}

function renderMealCard(meal) {
  const recipe = findRecipe(meal.recipeId);
  const title = meal.title || recipe?.name || "Meal";
  const audienceClass = audienceToClass(meal.audience);
  const chloeNote = meal.chloeNote
    ? `<p class="meal-meta"><strong>Chloe:</strong> ${escapeHtml(meal.chloeNote)}</p>`
    : "";
  const groceryNote = meal.extraGroceries?.length
    ? `<p class="meal-meta">${meal.extraGroceries.length} extra grocery ${meal.extraGroceries.length === 1 ? "item" : "items"}</p>`
    : "";

  return `
    <article class="meal-card ${audienceClass} ${meal.done ? "done" : ""}">
      <div>
        <div class="meal-topline">
          <span class="pill time">${escapeHtml(meal.slot)}</span>
          <span class="pill ${audienceClass}">${escapeHtml(meal.audience)}</span>
        </div>
        <strong>${escapeHtml(title)}</strong>
      </div>
      ${chloeNote}
      ${groceryNote}
      <div class="meal-actions">
        <button class="small-button" type="button" data-action="toggle-done" data-id="${meal.id}">${meal.done ? "Undo" : "Done"}</button>
        <button class="small-button" type="button" data-action="edit-meal" data-id="${meal.id}">Edit</button>
        <button class="small-button" type="button" data-action="remove-meal" data-id="${meal.id}">Remove</button>
      </div>
    </article>
  `;
}

function renderRecipes() {
  const query = els.recipeSearch.value.trim().toLowerCase();
  const filter = els.recipeFilter.value;
  const recipes = state.recipes
    .filter((recipe) => {
      const searchText = [
        recipe.name,
        recipe.time,
        recipe.chloeNote,
        recipe.tags.join(" "),
        recipe.ingredients.map((item) => item.name).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query || searchText.includes(query);
      const matchesFilter = filter === "all" || recipe.tags.includes(filter);
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => {
      if (state.homeIngredients.length || state.chloeFavorites.length) {
        return scoreRecipeForHome(b) - scoreRecipeForHome(a);
      }
      return a.name.localeCompare(b.name);
    });

  if (!recipes.length) {
    els.recipeList.innerHTML = `<div class="empty-wide"><strong>No recipes found</strong></div>`;
    return;
  }

  els.recipeList.innerHTML = recipes
    .map((recipe) => {
      const analysis = analyzeRecipe(recipe);
      const tags = recipe.tags
        .map((tag) => `<span class="pill tag">${escapeHtml(tag)}</span>`)
        .join("");
      const preview = recipe.ingredients
        .slice(0, 5)
        .map((item) => `<span>${escapeHtml(item.name)}</span>`)
        .join("");
      const chloeNote = recipe.chloeNote
        ? `<p class="recipe-meta"><strong>Chloe:</strong> ${escapeHtml(recipe.chloeNote)}</p>`
        : "";
      const homeNote = state.homeIngredients.length
        ? `<p class="recipe-meta"><strong>Home:</strong> ${escapeHtml(formatRecommendationSummary(analysis))}</p>`
        : "";
      const chloeFavoriteNote = analysis.favoriteMatches.length
        ? `<p class="recipe-meta"><strong>Chloe likes:</strong> ${escapeHtml(analysis.favoriteMatches.map((favorite) => favorite.name).join(", "))}</p>`
        : "";

      return `
        <article class="recipe-card">
          <div>
            <h3>${escapeHtml(recipe.name)}</h3>
            <p class="recipe-meta">${escapeHtml(recipe.time || "Anytime")} · ${escapeHtml(String(recipe.servings || "family"))} servings</p>
          </div>
          <div class="tag-list">${tags}</div>
          <div class="ingredient-preview">${preview}</div>
          ${chloeNote}
          ${homeNote}
          ${chloeFavoriteNote}
          <div class="recipe-actions">
            <button class="small-button" type="button" data-action="plan-recipe" data-id="${recipe.id}">Plan this week</button>
            <button class="small-button" type="button" data-action="edit-recipe" data-id="${recipe.id}">Edit</button>
            <button class="small-button" type="button" data-action="delete-recipe" data-id="${recipe.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderGroceries() {
  const items = buildGroceryItems();
  const alreadyHome = buildAlreadyHomeItems();
  const grouped = groupByCategory(items);

  if (!items.length && !alreadyHome.length) {
    els.groceryList.innerHTML = `<div class="empty-wide"><strong>No groceries yet</strong></div>`;
    return;
  }

  const groceryHtml = CATEGORY_ORDER.map((category) => {
    const groupItems = grouped.get(category) || [];
    if (!groupItems.length) {
      return "";
    }

    const rows = groupItems
      .map((item) => {
        const checked = Boolean(state.groceryChecked[item.key]);
        const source = item.sources.length ? item.sources.join(", ") : "Manual";
        const removeButton = item.manualId
          ? `<button class="small-button" type="button" data-action="remove-grocery" data-id="${item.manualId}">Remove</button>`
          : "";

        return `
          <div class="grocery-item ${checked ? "checked" : ""}">
            <input type="checkbox" aria-label="${escapeAttribute(item.name)}" data-key="${escapeAttribute(item.key)}" ${checked ? "checked" : ""} />
            <span>
              <strong>${escapeHtml(formatGroceryItem(item))}</strong>
              <span class="grocery-source">${escapeHtml(source)}</span>
            </span>
            ${removeButton}
          </div>
        `;
      })
      .join("");

    return `
      <section class="grocery-group">
        <h2>${escapeHtml(category)} <span>${groupItems.length}</span></h2>
        <div class="grocery-items">${rows}</div>
      </section>
    `;
  }).join("");

  const alreadyHomeHtml = renderAlreadyHomeSection(alreadyHome);
  els.groceryList.innerHTML = `${groceryHtml}${alreadyHomeHtml}`;
}

function renderHome() {
  renderHomeRecommendations();
  renderChloeFavoriteList();
  renderHomeIngredientList();
}

function renderHomeRecommendations() {
  if (!state.homeIngredients.length && !state.chloeFavorites.length) {
    els.homeRecommendations.innerHTML = `<div class="empty-wide"><strong>Add home ingredients or Chloe favorites first</strong></div>`;
    return;
  }

  const recommendations = buildRecipeRecommendations().slice(0, 8);
  if (!recommendations.length) {
    els.homeRecommendations.innerHTML = `<div class="empty-wide"><strong>No recipe matches yet</strong></div>`;
    return;
  }

  els.homeRecommendations.innerHTML = recommendations
    .map(({ recipe, analysis }) => {
      const missing = analysis.missing.length
        ? analysis.missing
            .slice(0, 6)
            .map((item) => `<span>${escapeHtml(item.name)}</span>`)
            .join("")
        : `<span>Ready</span>`;
      const favoriteMatches = analysis.favoriteMatches.length
        ? `<div class="favorite-match-list">${analysis.favoriteMatches
            .slice(0, 4)
            .map((favorite) => `<span>Chloe likes ${escapeHtml(favorite.name)}</span>`)
            .join("")}</div>`
        : "";
      return `
        <article class="recommendation-card">
          <div>
            <h3>${escapeHtml(recipe.name)}</h3>
            <p class="recipe-meta">${escapeHtml(recipe.time || "Anytime")} · ${escapeHtml(formatRecommendationSummary(analysis))}</p>
          </div>
          <div class="match-bar" aria-hidden="true">
            <span class="match-fill" style="width: ${analysis.percent}%"></span>
          </div>
          ${favoriteMatches}
          <div class="missing-list">${missing}</div>
          <div class="recipe-actions">
            <button class="small-button" type="button" data-action="plan-recipe" data-id="${recipe.id}">Plan this week</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderChloeFavoriteList() {
  if (!state.chloeFavorites.length) {
    els.chloeFavoriteList.innerHTML = `<div class="empty-wide"><strong>No Chloe favorites yet</strong></div>`;
    return;
  }

  els.chloeFavoriteList.innerHTML = state.chloeFavorites
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((favorite) => {
      const note = favorite.note
        ? `<span class="home-meta">${escapeHtml(favorite.note)}</span>`
        : `<span class="home-meta">Favorite food</span>`;
      return `
        <article class="favorite-item">
          <span>
            <strong>${escapeHtml(favorite.name)}</strong>
            ${note}
          </span>
          <button class="small-button" type="button" data-action="remove-favorite" data-id="${favorite.id}">Remove</button>
        </article>
      `;
    })
    .join("");
}

function renderHomeIngredientList() {
  if (!state.homeIngredients.length) {
    els.homeIngredientList.innerHTML = `<div class="empty-wide"><strong>No home ingredients yet</strong></div>`;
    return;
  }

  const items = state.homeIngredients
    .slice()
    .sort((a, b) => sortGroceryItems(a, b));

  const rows = items
    .map((item) => {
      const useSoon = item.useSoon ? `<span class="use-soon-badge">use soon</span>` : "";
      return `
        <div class="home-item">
          <span class="home-item-name">
            <strong>${escapeHtml(formatHomeItem(item))}</strong>
            ${useSoon}
          </span>
          <span class="home-meta">${escapeHtml(normalizeCategory(item.category))}</span>
          <div class="row-actions">
            <button class="small-button" type="button" data-action="toggle-use-soon" data-id="${item.id}">${item.useSoon ? "Unmark" : "Use soon"}</button>
            <button class="small-button" type="button" data-action="remove-home" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  els.homeIngredientList.innerHTML = `
    <section class="home-group">
      <h3>Pantry <span>· ${items.length} ${items.length === 1 ? "item" : "items"}</span></h3>
      <div class="home-items">${rows}</div>
    </section>
  `;
}

function renderAlreadyHomeSection(items) {
  if (!items.length) {
    return "";
  }

  const names = items.map((item) => escapeHtml(formatGroceryItem(item))).join(" · ");

  return `
    <section class="already-home-card">
      <h2>Already at home</h2>
      <p>${names}</p>
    </section>
  `;
}

function handleMealSubmit(event) {
  event.preventDefault();

  const editingId = els.editingMealId.value;
  const recipeId = els.mealRecipe.value || null;
  const recipe = findRecipe(recipeId);
  const customTitle = els.customMealName.value.trim();
  const title = recipe?.name || customTitle;

  if (!title) {
    alert("Add a meal name or pick a recipe.");
    els.customMealName.focus();
    return;
  }

  const meal = {
    id: editingId || createId(),
    date: els.mealDay.value,
    slot: els.mealSlot.value,
    recipeId,
    title,
    audience: els.mealAudience.value,
    chloeNote: els.chloeNote.value.trim(),
    extraGroceries: parseIngredientLines(els.extraGroceries.value),
    done: editingId ? findMeal(editingId)?.done || false : false,
  };

  if (editingId) {
    state.planItems = state.planItems.map((item) => (item.id === editingId ? meal : item));
  } else {
    state.planItems.push(meal);
  }

  state.selectedDate = meal.date;
  resetMealForm(false);
  saveAndRender();
}

function handleWeekClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id, date } = button.dataset;

  if (action === "select-day") {
    state.selectedDate = date;
    els.mealDay.value = date;
    saveAndRender();
    return;
  }

  if (action === "set-day") {
    state.activeTab = "planner";
    state.selectedDate = date;
    els.mealDay.value = date;
    els.mealSlot.value = "Dinner";
    saveAndRender();
    els.mealRecipe.focus();
    return;
  }

  if (action === "quick-add") {
    addRecipeToFirstOpenDinner(id);
    return;
  }

  const meal = findMeal(id);
  if (!meal) {
    return;
  }

  if (action === "toggle-done") {
    meal.done = !meal.done;
    saveAndRender();
  }

  if (action === "edit-meal") {
    fillMealForm(meal);
  }

  if (action === "remove-meal") {
    state.planItems = state.planItems.filter((item) => item.id !== id);
    saveAndRender();
  }
}

function handleRecipeSubmit(event) {
  event.preventDefault();

  const editingId = els.editingRecipeId.value;
  const recipe = {
    id: editingId || createId(),
    name: els.recipeName.value.trim(),
    time: els.recipeTime.value.trim(),
    servings: Number(els.recipeServings.value) || "",
    tags: parseTags(els.recipeTags.value),
    ingredients: parseIngredientLines(els.recipeIngredients.value),
    chloeNote: els.recipeChloeNote.value.trim(),
    steps: splitLines(els.recipeSteps.value),
  };

  if (!recipe.name) {
    alert("Add a recipe name.");
    els.recipeName.focus();
    return;
  }

  if (editingId) {
    state.recipes = state.recipes.map((item) => (item.id === editingId ? recipe : item));
    state.planItems = state.planItems.map((meal) => {
      if (meal.recipeId !== editingId) {
        return meal;
      }
      return { ...meal, title: recipe.name };
    });
  } else {
    state.recipes.push(recipe);
  }

  resetRecipeForm(false);
  saveAndRender();
}

function handleRecipeClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const recipe = findRecipe(id);
  if (!recipe) {
    return;
  }

  if (action === "plan-recipe") {
    addRecipeToFirstOpenDinner(id);
  }

  if (action === "edit-recipe") {
    fillRecipeForm(recipe);
  }

  if (action === "delete-recipe") {
    const inPlan = state.planItems.some((meal) => meal.recipeId === id);
    const message = inPlan
      ? "Delete this recipe? Planned meals will keep their meal name."
      : "Delete this recipe?";
    if (!window.confirm(message)) {
      return;
    }
    state.recipes = state.recipes.filter((item) => item.id !== id);
    state.planItems = state.planItems.map((meal) =>
      meal.recipeId === id ? { ...meal, recipeId: null } : meal,
    );
    saveAndRender();
  }
}

function handleHomeIngredientSubmit(event) {
  event.preventDefault();

  const name = els.homeIngredientName.value.trim();
  if (!name) {
    return;
  }

  const amountParts = splitAmountAndUnit(els.homeIngredientAmount.value);
  addHomeIngredient({
    name,
    amount: amountParts.amount,
    unit: amountParts.unit,
    category: normalizeCategory(els.homeIngredientCategory.value),
    useSoon: els.homeIngredientUseSoon.checked,
  });

  els.homeIngredientForm.reset();
  saveAndRender();
}

function handleBulkHomeSubmit(event) {
  event.preventDefault();

  const items = parseIngredientLines(els.bulkHomeIngredients.value);
  if (!items.length) {
    return;
  }

  items.forEach((item) => {
    addHomeIngredient({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      category: item.category,
      useSoon: false,
    });
  });

  els.bulkHomeForm.reset();
  saveAndRender();
}

function handleChloeFavoriteSubmit(event) {
  event.preventDefault();

  const name = els.chloeFavoriteName.value.trim();
  if (!name) {
    return;
  }

  addChloeFavorite({
    name,
    note: els.chloeFavoriteNote.value.trim(),
  });

  els.chloeFavoriteForm.reset();
  saveAndRender();
}

function handleChloeFavoriteClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-favorite") {
    state.chloeFavorites = state.chloeFavorites.filter((item) => item.id !== button.dataset.id);
    saveAndRender();
  }
}

function handleHomeIngredientClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-home") {
    state.homeIngredients = state.homeIngredients.filter((item) => item.id !== button.dataset.id);
    saveAndRender();
  }

  if (button.dataset.action === "toggle-use-soon") {
    const item = state.homeIngredients.find((entry) => entry.id === button.dataset.id);
    if (!item) {
      return;
    }
    item.useSoon = !item.useSoon;
    saveAndRender();
  }
}

function handleRecommendationClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "plan-recipe") {
    addRecipeToFirstOpenDinner(button.dataset.id);
  }
}

function handleManualGrocerySubmit(event) {
  event.preventDefault();

  const name = els.manualGroceryName.value.trim();
  if (!name) {
    return;
  }

  state.manualGroceries.push({
    id: createId(),
    name,
    amount: els.manualGroceryAmount.value.trim(),
    unit: "",
    category: normalizeCategory(els.manualGroceryCategory.value),
  });

  els.manualGroceryForm.reset();
  saveAndRender();
}

function handleGroceryChange(event) {
  const checkbox = event.target.closest('input[type="checkbox"][data-key]');
  if (!checkbox) {
    return;
  }

  state.groceryChecked[checkbox.dataset.key] = checkbox.checked;
  saveAndRender();
}

function handleGroceryClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-grocery") {
    state.manualGroceries = state.manualGroceries.filter((item) => item.id !== button.dataset.id);
    delete state.groceryChecked[`manual|${button.dataset.id}`];
    saveAndRender();
  }
}

function addRecipeToFirstOpenDinner(recipeId) {
  const recipe = findRecipe(recipeId);
  if (!recipe) {
    return;
  }

  const date = getFirstOpenDinnerDate() || toIso(getWeekDates()[6]);
  const favoriteMatches = findChloeFavoriteMatches(recipe);
  const favoriteNote = favoriteMatches.length
    ? `Chloe likes ${favoriteMatches.map((favorite) => favorite.name).join(", ")}.`
    : "";
  state.planItems.push({
    id: createId(),
    date,
    slot: "Dinner",
    recipeId,
    title: recipe.name,
    audience: recipe.tags.includes("kid-friendly") || favoriteMatches.length ? "Everyone" : "Chloe version",
    chloeNote: recipe.chloeNote || favoriteNote,
    extraGroceries: [],
    done: false,
  });

  state.activeTab = "planner";
  state.selectedDate = date;
  saveAndRender();
}

function addHomeIngredient(item) {
  mergeHomeIngredient(state.homeIngredients, item);
}

function mergeHomeIngredient(homeIngredients, item) {
  const cleanName = item.name.trim();
  if (!cleanName) {
    return false;
  }

  const next = {
    id: createId(),
    name: cleanName,
    amount: item.amount || "",
    unit: item.unit || "",
    category: normalizeCategory(item.category),
    useSoon: Boolean(item.useSoon),
  };
  const existing = homeIngredients.find((entry) => ingredientNamesMatch(entry.name, next.name));

  if (existing) {
    existing.amount = next.amount || existing.amount;
    existing.unit = next.unit || existing.unit;
    existing.category = next.category || existing.category;
    existing.useSoon = existing.useSoon || next.useSoon;
    return false;
  }

  homeIngredients.push(next);
  return true;
}

function addChloeFavorite(item) {
  const cleanName = item.name.trim();
  if (!cleanName) {
    return;
  }

  const existing = state.chloeFavorites.find((favorite) =>
    ingredientNamesMatch(favorite.name, cleanName),
  );

  if (existing) {
    existing.note = item.note || existing.note;
    return;
  }

  state.chloeFavorites.push({
    id: createId(),
    name: cleanName,
    note: item.note || "",
  });
}

function fillMealForm(meal) {
  state.activeTab = "planner";
  renderTabs();

  els.editingMealId.value = meal.id;
  els.mealFormTitle.textContent = "Edit meal";
  els.saveMealButton.textContent = "Save meal";
  els.cancelMealEdit.classList.remove("hidden");
  els.mealDay.value = meal.date;
  els.mealSlot.value = meal.slot;
  els.mealRecipe.value = meal.recipeId || "";
  els.customMealName.value = meal.recipeId ? "" : meal.title || "";
  els.mealAudience.value = meal.audience || "Everyone";
  els.chloeNote.value = meal.chloeNote || "";
  els.extraGroceries.value = formatIngredientLines(meal.extraGroceries || []);
  syncCustomMealVisibility();
  els.mealForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetMealForm(shouldRender) {
  els.mealForm.reset();
  els.editingMealId.value = "";
  els.mealFormTitle.textContent = "Add meal";
  els.saveMealButton.textContent = "Add meal";
  els.cancelMealEdit.classList.add("hidden");
  els.mealSlot.value = "Dinner";
  els.mealAudience.value = "Everyone";
  els.extraGroceries.value = "";
  els.customMealName.value = "";

  if (shouldRender) {
    render();
  }
}

function fillRecipeForm(recipe) {
  state.activeTab = "recipes";
  renderTabs();

  els.editingRecipeId.value = recipe.id;
  els.recipeFormTitle.textContent = "Edit recipe";
  els.saveRecipeButton.textContent = "Save recipe";
  els.cancelRecipeEdit.classList.remove("hidden");
  els.recipeName.value = recipe.name;
  els.recipeTime.value = recipe.time || "";
  els.recipeServings.value = recipe.servings || "";
  els.recipeTags.value = recipe.tags.join(", ");
  els.recipeIngredients.value = formatIngredientLines(recipe.ingredients || []);
  els.recipeChloeNote.value = recipe.chloeNote || "";
  els.recipeSteps.value = (recipe.steps || []).join("\n");
  els.recipeForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetRecipeForm(shouldRender) {
  els.recipeForm.reset();
  els.editingRecipeId.value = "";
  els.recipeFormTitle.textContent = "Add recipe";
  els.saveRecipeButton.textContent = "Save recipe";
  els.cancelRecipeEdit.classList.add("hidden");

  if (shouldRender) {
    render();
  }
}

function syncCustomMealVisibility() {
  const isCustom = !els.mealRecipe.value;
  els.customMealLabel.classList.toggle("hidden", !isCustom);
  els.customMealName.required = isCustom;
}

function getCurrentWeekMeals() {
  const weekDates = getWeekDates().map(toIso);
  const weekSet = new Set(weekDates);
  return state.planItems.filter((meal) => weekSet.has(meal.date));
}

function getWeekDates() {
  const start = fromIso(state.weekStart);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function getFirstOpenDinnerDate() {
  const meals = getCurrentWeekMeals();
  return getWeekDates()
    .map(toIso)
    .find((date) => !meals.some((meal) => meal.date === date && meal.slot === "Dinner"));
}

function buildRecipeRecommendations() {
  return state.recipes
    .map((recipe) => ({
      recipe,
      analysis: analyzeRecipe(recipe),
      score: scoreRecipeForHome(recipe),
    }))
    .sort((a, b) => b.score - a.score || a.recipe.name.localeCompare(b.recipe.name));
}

function analyzeRecipe(recipe) {
  const ingredients = recipe.ingredients || [];
  const have = [];
  const missing = [];
  const favoriteMatches = findChloeFavoriteMatches(recipe);
  let useSoonMatches = 0;

  ingredients.forEach((item) => {
    const homeItem = findHomeMatch(item);
    if (homeItem) {
      have.push(item);
      if (homeItem.useSoon) {
        useSoonMatches += 1;
      }
    } else {
      missing.push(item);
    }
  });

  const total = ingredients.length || 1;
  return {
    have,
    missing,
    total: ingredients.length,
    percent: Math.round((have.length / total) * 100),
    useSoonMatches,
    favoriteMatches,
  };
}

function scoreRecipeForHome(recipe) {
  const analysis = analyzeRecipe(recipe);
  return (
    scoreRecipe(recipe) +
    analysis.have.length * 5 +
    analysis.useSoonMatches * 4 -
    analysis.missing.length * 2 +
    analysis.favoriteMatches.length * 6
  );
}

function formatRecommendationSummary(analysis) {
  if (!analysis.total) {
    return "No ingredients listed";
  }
  const chloeText = analysis.favoriteMatches.length
    ? `; Chloe likes ${analysis.favoriteMatches
        .slice(0, 2)
        .map((favorite) => favorite.name)
        .join(", ")}`
    : "";
  if (!analysis.missing.length) {
    return `Ready with ${analysis.have.length}/${analysis.total}${chloeText}`;
  }
  const missingNames = analysis.missing
    .slice(0, 3)
    .map((item) => item.name)
    .join(", ");
  const more = analysis.missing.length > 3 ? ` +${analysis.missing.length - 3}` : "";
  return `Have ${analysis.have.length}/${analysis.total}; missing ${missingNames}${more}${chloeText}`;
}

function homeHasIngredient(item) {
  return Boolean(findHomeMatch(item));
}

function findHomeMatch(item) {
  return state.homeIngredients.find((homeItem) => ingredientNamesMatch(homeItem.name, item.name));
}

function findChloeFavoriteMatches(recipe) {
  return state.chloeFavorites.filter((favorite) => recipeMatchesFavorite(recipe, favorite));
}

function recipeMatchesFavorite(recipe, favorite) {
  const favoriteName = favorite.name || "";
  if (!favoriteName) {
    return false;
  }

  const recipeText = [
    recipe.name,
    recipe.chloeNote,
    ...(recipe.tags || []),
    ...(recipe.ingredients || []).map((item) => item.name),
  ].join(" ");

  return ingredientNamesMatch(favoriteName, recipeText);
}

function buildGroceryItems() {
  const items = new Map();
  const meals = getCurrentWeekMeals();

  meals.forEach((meal) => {
    const recipe = findRecipe(meal.recipeId);
    const source = meal.title || recipe?.name || "Meal";

    if (recipe?.ingredients?.length) {
      recipe.ingredients.forEach((item) => {
        if (homeHasIngredient(item)) {
          return;
        }
        addGeneratedGrocery(items, item, source);
      });
    }

    (meal.extraGroceries || []).forEach((item) => {
      if (homeHasIngredient(item)) {
        return;
      }
      addGeneratedGrocery(items, item, source);
    });
  });

  const generated = [...items.values()].map((item) => ({
    ...item,
    sources: [...item.sources],
  }));

  const manual = state.manualGroceries.map((item) => ({
    key: `manual|${item.id}`,
    manualId: item.id,
    name: item.name,
    amountText: item.amount || "",
    amountValue: null,
    unit: item.unit || "",
    category: normalizeCategory(item.category),
    sources: ["Manual"],
  }));

  return [...generated, ...manual].sort(sortGroceryItems);
}

function buildAlreadyHomeItems() {
  const items = new Map();
  const meals = getCurrentWeekMeals();

  meals.forEach((meal) => {
    const recipe = findRecipe(meal.recipeId);
    const source = meal.title || recipe?.name || "Meal";

    if (recipe?.ingredients?.length) {
      recipe.ingredients.forEach((item) => {
        if (homeHasIngredient(item)) {
          addGeneratedGrocery(items, item, source);
        }
      });
    }

    (meal.extraGroceries || []).forEach((item) => {
      if (homeHasIngredient(item)) {
        addGeneratedGrocery(items, item, source);
      }
    });
  });

  return [...items.values()]
    .map((item) => ({
      ...item,
      sources: [...item.sources],
    }))
    .sort(sortGroceryItems);
}

function addGeneratedGrocery(items, item, source) {
  if (!item?.name) {
    return;
  }

  const category = normalizeCategory(item.category);
  const unit = (item.unit || "").trim().toLowerCase();
  const name = normalizeItemName(item.name);
  const key = `auto|${category}|${unit}|${name}`;
  const amountValue = parseAmount(item.amount);
  const amountText = String(item.amount || "").trim();

  if (!items.has(key)) {
    items.set(key, {
      key,
      name,
      amountText: "",
      amountValue: amountValue ?? null,
      fallbackAmounts: amountValue === null && amountText ? [amountText] : [],
      unit,
      category,
      sources: new Set([source]),
    });
    return;
  }

  const existing = items.get(key);
  existing.sources.add(source);

  if (amountValue !== null && existing.amountValue !== null) {
    existing.amountValue += amountValue;
  } else if (amountText) {
    existing.fallbackAmounts.push(amountText);
    existing.amountValue = null;
  }
}

function groupByCategory(items) {
  const grouped = new Map();
  items.forEach((item) => {
    const category = normalizeCategory(item.category);
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category).push(item);
  });
  return grouped;
}

function sortGroceryItems(a, b) {
  const categoryDelta =
    CATEGORY_ORDER.indexOf(normalizeCategory(a.category)) -
    CATEGORY_ORDER.indexOf(normalizeCategory(b.category));
  if (categoryDelta !== 0) {
    return categoryDelta;
  }
  return a.name.localeCompare(b.name);
}

function formatGroceryItem(item) {
  const unit = item.unit ? ` ${item.unit}` : "";

  if (item.amountValue !== null && item.amountValue !== undefined) {
    return `${formatAmount(item.amountValue)}${unit} ${item.name}`.trim();
  }

  if (item.fallbackAmounts?.length) {
    return `${item.fallbackAmounts.join(" + ")}${unit} ${item.name}`.trim();
  }

  if (item.amountText) {
    return `${item.amountText}${unit ? ` ${item.unit}` : ""} ${item.name}`.trim();
  }

  return item.name;
}

function formatHomeItem(item) {
  const amount = [item.amount, item.unit].filter(Boolean).join(" ");
  return [amount, item.name].filter(Boolean).join(" ");
}

function parseIngredientLines(value) {
  return splitLines(value).map(parseIngredientLine).filter(Boolean);
}

function parseIngredientLine(line) {
  const [leftRaw, categoryRaw] = line.split("|");
  const left = leftRaw.trim();
  if (!left) {
    return null;
  }

  const tokens = left.split(/\s+/);
  let amount = "";
  let unit = "";

  if (tokens.length && parseAmount(tokens[0]) !== null) {
    amount = tokens.shift();
  }

  if (tokens.length && UNIT_WORDS.has(tokens[0].toLowerCase())) {
    unit = tokens.shift();
  }

  return ingredient(amount, unit, tokens.join(" ") || left, normalizeCategory(categoryRaw));
}

function splitAmountAndUnit(value) {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) {
    return { amount: "", unit: "" };
  }

  if (tokens.length > 1 && UNIT_WORDS.has(tokens[1].toLowerCase())) {
    return {
      amount: tokens[0],
      unit: tokens.slice(1).join(" "),
    };
  }

  return {
    amount: tokens.join(" "),
    unit: "",
  };
}

function formatIngredientLines(items) {
  return (items || [])
    .map((item) => {
      const first = [item.amount, item.unit, item.name].filter(Boolean).join(" ");
      return `${first}${item.category ? ` | ${item.category}` : ""}`;
    })
    .join("\n");
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function splitLines(value) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseAmount(value) {
  const text = String(value || "").trim();
  if (!text) {
    return null;
  }

  if (/^\d+\/\d+$/.test(text)) {
    const [top, bottom] = text.split("/").map(Number);
    return bottom ? top / bottom : null;
  }

  if (/^\d+(\.\d+)?$/.test(text)) {
    return Number(text);
  }

  return null;
}

function formatAmount(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return String(Math.round(value * 100) / 100);
}

function scoreRecipe(recipe) {
  let score = 0;
  if (recipe.tags.includes("kid-friendly")) score += 4;
  if (recipe.tags.includes("quick")) score += 3;
  if (recipe.tags.includes("leftovers")) score += 2;
  if (recipe.tags.includes("one-pan")) score += 1;
  return score;
}

function rotateArray(items, offset) {
  if (!items.length) {
    return [];
  }
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function findRecipe(id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

function findMeal(id) {
  return state.planItems.find((meal) => meal.id === id);
}

function audienceToClass(audience) {
  if (audience === "Adults") {
    return "adults";
  }
  if (audience === "Chloe version") {
    return "chloe";
  }
  return "everyone";
}

function normalizeCategory(category) {
  const text = String(category || "Other").trim();
  const match = CATEGORY_ORDER.find((item) => item.toLowerCase() === text.toLowerCase());
  return match || "Other";
}

function normalizeItemName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function ingredientNamesMatch(left, right) {
  const a = canonicalIngredientName(left);
  const b = canonicalIngredientName(right);

  if (!a || !b) {
    return false;
  }

  if (a === b) {
    return true;
  }

  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  const longerWords = new Set(longer.split(" "));
  const shorterWords = shorter.split(" ");
  if (shorterWords.length && shorterWords.every((word) => word.length >= 3 && longerWords.has(word))) {
    return true;
  }
  return shorter.length >= 4 && longer.includes(shorter);
}

function canonicalIngredientName(name) {
  return normalizeItemName(name)
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(singularizeWord)
    .join(" ");
}

function singularizeWord(word) {
  if (word.endsWith("ies") && word.length > 4) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.endsWith("es") && word.length > 4) {
    return word.slice(0, -2);
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

function startOfWeek(date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = local.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(local, diff);
}

function addDays(date, count) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
}

function toIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIso(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function formatDayOption(date) {
  return formatDate(date, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
