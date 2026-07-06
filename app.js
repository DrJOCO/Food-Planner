const STORAGE_KEY = "familyFoodPlanner.v1";
const SYNC_SETTINGS_KEY = "familyFoodPlanner.sync.v1";
const DEVICE_ID_KEY = "familyFoodPlanner.deviceId.v1";
const APP_CACHE_VERSION = "11";
const SYNC_SAVE_DEBOUNCE_MS = 900;
const FIREBASE_APP_URL = "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
const FIREBASE_FIRESTORE_URL = "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const SYNCED_STATE_FIELDS = [
  "recipes",
  "planItems",
  "chloeFavorites",
  "homeIngredients",
  "manualGroceries",
  "groceryChecked",
  "groceryCheckedAt",
  "appliedImports",
  "deletedItems",
];

// Collections merged per item by `id`, comparing each item's own `updatedAt`.
const MERGED_ITEM_COLLECTIONS = [
  "recipes",
  "planItems",
  "chloeFavorites",
  "homeIngredients",
  "manualGroceries",
];

// Tombstones older than this are pruned on save.
const TOMBSTONE_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000;

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
const FAMILY_FAVORITES_IMPORT_ID = "family-favorites-2026-06-25";
const CHLOE_FOODS_IMPORT_ID = "chloe-foods-2026-07-01";
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

const FAMILY_FAVORITE_RECIPES = [
  {
    id: "recipe-air-fryer-salmon-rice",
    name: "Air fried salmon and rice",
    time: "25 min",
    servings: 3,
    tags: ["quick", "kid-friendly"],
    chloeNote: "Flake salmon into small pieces and keep rice plain.",
    ingredients: [
      ingredient("1.25", "lb", "salmon", "Meat"),
      ingredient("1.5", "cups", "rice", "Pantry"),
      ingredient("1", "bottle", "soy sauce", "Pantry"),
      ingredient("1", "bottle", "sesame oil", "Pantry"),
    ],
    steps: [
      "Cook rice.",
      "Season salmon lightly.",
      "Air fry salmon until cooked through.",
      "Serve salmon over rice with sauce on the side.",
    ],
  },
  {
    id: "recipe-soba-noodles",
    name: "Soba noodles",
    time: "15 min",
    servings: 3,
    tags: ["quick", "kid-friendly", "leftovers"],
    chloeNote: "Rinse noodles well and serve sauce separately.",
    ingredients: [
      ingredient("1", "pack", "soba noodles", "Pantry"),
      ingredient("1", "bottle", "soba sauce", "Pantry"),
      ingredient("1", "each", "cucumber", "Produce"),
      ingredient("1", "bottle", "sesame oil", "Pantry"),
    ],
    steps: [
      "Boil soba noodles.",
      "Rinse under cold water.",
      "Slice cucumber.",
      "Serve with soba sauce on the side.",
    ],
  },
  {
    id: "recipe-cheese-quesadilla",
    name: "Cheese quesadilla",
    time: "10 min",
    servings: 2,
    tags: ["quick", "kid-friendly"],
    chloeNote: "Cut into small triangles and add fruit on the side.",
    ingredients: [
      ingredient("2", "each", "tortillas", "Bakery"),
      ingredient("1", "cup", "shredded cheese", "Dairy"),
      ingredient("1", "tbsp", "butter", "Dairy"),
    ],
    steps: [
      "Warm tortilla in a pan.",
      "Add cheese and fold.",
      "Cook until both sides are lightly crisp.",
      "Cut into wedges.",
    ],
  },
  {
    id: "recipe-oatmeal-egg-honey",
    name: "Oatmeal with egg and honey",
    time: "10 min",
    servings: 1,
    tags: ["quick", "kid-friendly", "breakfast"],
    chloeNote: "Stir egg in well so the texture stays smooth.",
    ingredients: [
      ingredient("1/2", "cup", "oats", "Pantry"),
      ingredient("1", "each", "egg", "Dairy"),
      ingredient("1", "tsp", "honey", "Pantry"),
      ingredient("1", "cup", "milk", "Dairy"),
    ],
    steps: [
      "Cook oats with milk.",
      "Whisk egg and stir it into the hot oatmeal.",
      "Cook gently until thick.",
      "Finish with honey.",
    ],
  },
  {
    id: "recipe-cheese-omelette",
    name: "Cheese omelette",
    time: "10 min",
    servings: 1,
    tags: ["quick", "kid-friendly", "breakfast"],
    chloeNote: "Keep it soft and cut into small strips.",
    ingredients: [
      ingredient("2", "each", "eggs", "Dairy"),
      ingredient("1/4", "cup", "shredded cheese", "Dairy"),
      ingredient("1", "tbsp", "milk", "Dairy"),
    ],
    steps: [
      "Whisk eggs with milk.",
      "Cook gently in a nonstick pan.",
      "Add cheese and fold.",
    ],
  },
  {
    id: "recipe-fruit-babybel-snack",
    name: "Fruit and Babybel snack plate",
    time: "5 min",
    servings: 1,
    tags: ["quick", "kid-friendly", "snack"],
    chloeNote: "Use whichever fruit is ready: tangerines, strawberries, or blueberries.",
    ingredients: [
      ingredient("1", "each", "Babybel cheese", "Dairy"),
      ingredient("1", "each", "tangerine", "Produce"),
      ingredient("1", "cup", "strawberries", "Produce"),
      ingredient("1", "cup", "blueberries", "Produce"),
    ],
    steps: [
      "Peel or wash fruit.",
      "Serve with Babybel cheese.",
    ],
  },
];

const FAMILY_FAVORITE_FOODS = [
  { name: "air fried salmon and rice", note: "Favorite dinner." },
  { name: "soba noodles", note: "Works for dinner or leftovers." },
  { name: "cheese quesadilla", note: "Easy dinner or lunch." },
  { name: "oatmeal with egg and honey", note: "Breakfast favorite." },
  { name: "cheese omelette", note: "Breakfast favorite." },
  { name: "tangerines", note: "Snack staple." },
  { name: "strawberries", note: "Snack staple." },
  { name: "blueberries", note: "Snack staple." },
  { name: "Babybel cheese", note: "Snack staple." },
];

const CHLOE_FOODS_RECIPES = [
  {
    id: "recipe-protein-pasta",
    name: "Protein pasta",
    time: "15 min",
    servings: 2,
    tags: ["quick", "kid-friendly"],
    chloeNote: "Keep it plain or lightly buttered.",
    ingredients: [
      ingredient("1", "box", "protein pasta", "Pantry"),
      ingredient("1", "tbsp", "butter", "Dairy"),
      ingredient("1/4", "cup", "shredded cheese", "Dairy"),
    ],
    steps: [
      "Boil protein pasta until soft.",
      "Drain and toss with butter.",
      "Top with a little cheese.",
    ],
  },
  {
    id: "recipe-turkey-sandwich",
    name: "Turkey sandwich",
    time: "5 min",
    servings: 1,
    tags: ["quick", "kid-friendly"],
    chloeNote: "Cut into small pieces.",
    ingredients: [
      ingredient("2", "slices", "sandwich bread", "Bakery"),
      ingredient("3", "slices", "sliced turkey", "Meat"),
      ingredient("1", "slice", "cheese", "Dairy"),
    ],
    steps: [
      "Layer turkey and cheese on bread.",
      "Cut into small pieces.",
    ],
  },
  {
    id: "recipe-rice-cooker-beef-corn-rice",
    name: "Rice cooker beef, corn, and rice",
    time: "40 min",
    servings: 3,
    tags: ["kid-friendly", "leftovers"],
    chloeNote: "Mix well so the beef is in small pieces.",
    ingredients: [
      ingredient("1", "lb", "ground beef", "Meat"),
      ingredient("1.5", "cups", "rice", "Pantry"),
      ingredient("1", "cup", "corn", "Frozen"),
      ingredient("1", "bottle", "soy sauce", "Pantry"),
    ],
    steps: [
      "Brown the ground beef.",
      "Add rice, water, corn, and beef to the rice cooker.",
      "Season lightly with soy sauce.",
      "Cook on the normal rice setting.",
    ],
  },
];

const CHLOE_FOODS_FAVORITES = [
  { name: "blackberries", note: "Snack staple." },
  { name: "papaya", note: "Snack staple." },
  { name: "apple", note: "Snack staple." },
  { name: "cherries", note: "Snack staple." },
  { name: "zucchini", note: "Eats it with lunch or dinner." },
  { name: "cucumber", note: "Eats it with lunch or dinner." },
  { name: "protein pasta", note: "Lunch or dinner favorite." },
  { name: "turkey sandwich", note: "Lunch favorite." },
  { name: "rice cooker beef, corn, and rice", note: "Dinner favorite." },
];

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
  "tablespoon",
  "tablespoons",
  "tsp",
  "teaspoon",
  "teaspoons",
  "gram",
  "grams",
  "kg",
  "liter",
  "liters",
  "ml",
  "ounce",
  "ounces",
  "pound",
  "pounds",
  "slice",
  "slices",
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
  appSyncLine: document.querySelector("#appSyncLine"),
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
  recipeImportForm: document.querySelector("#recipeImportForm"),
  recipeImportText: document.querySelector("#recipeImportText"),
  recipeImportStatus: document.querySelector("#recipeImportStatus"),
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
  syncForm: document.querySelector("#syncForm"),
  syncHouseholdId: document.querySelector("#syncHouseholdId"),
  syncStatus: document.querySelector("#syncStatus"),
  syncBadge: document.querySelector("#syncBadge"),
  syncNow: document.querySelector("#syncNow"),
  disconnectSync: document.querySelector("#disconnectSync"),
  exportBackup: document.querySelector("#exportBackup"),
  importBackup: document.querySelector("#importBackup"),
  importBackupFile: document.querySelector("#importBackupFile"),
  manualGroceryForm: document.querySelector("#manualGroceryForm"),
  manualGroceryName: document.querySelector("#manualGroceryName"),
  manualGroceryAmount: document.querySelector("#manualGroceryAmount"),
  manualGroceryCategory: document.querySelector("#manualGroceryCategory"),
  clearCheckedGroceries: document.querySelector("#clearCheckedGroceries"),
  printGroceries: document.querySelector("#printGroceries"),
  groceryList: document.querySelector("#groceryList"),
  toast: document.querySelector("#toast"),
};

let quickOffset = 0;
let toastTimer = 0;
let state = loadState();
const syncState = createSyncState();

bindEvents();
render();
registerServiceWorker();
initializeSync();

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

function nowMs() {
  return Date.now();
}

// Stamp an item's per-item `updatedAt` (ms epoch) so merge sync can compare it
// against the same id coming from another device. Items missing an `updatedAt`
// are treated as timestamp 0 during merges.
function touchItem(item, timestamp) {
  if (item && typeof item === "object") {
    item.updatedAt = timestamp || nowMs();
  }
  return item;
}

function itemUpdatedAt(item) {
  return Number(item?.updatedAt) || 0;
}

// Record a deletion so it propagates to other devices instead of being
// resurrected by the per-item merge. The tombstone timestamp is the delete
// moment; an item later edited with a newer `updatedAt` wins over the delete.
function tombstoneItem(id, timestamp) {
  if (!id) {
    return;
  }
  if (!state.deletedItems || typeof state.deletedItems !== "object") {
    state.deletedItems = {};
  }
  const at = timestamp || nowMs();
  const existing = Number(state.deletedItems[id]) || 0;
  state.deletedItems[id] = Math.max(existing, at);
}

// Merge two arrays of {id, updatedAt} items. Same id on both sides: newer
// updatedAt wins. Id on one side only: keep it, unless a tombstone newer than
// the item's updatedAt marks it deleted.
function mergeItemArrays(localItems, remoteItems, deletedItems) {
  const tombstones = deletedItems && typeof deletedItems === "object" ? deletedItems : {};
  const merged = new Map();

  const consider = (item) => {
    if (!item || typeof item !== "object" || !item.id) {
      return;
    }
    const existing = merged.get(item.id);
    if (!existing || itemUpdatedAt(item) >= itemUpdatedAt(existing)) {
      merged.set(item.id, item);
    }
  };

  (Array.isArray(localItems) ? localItems : []).forEach(consider);
  (Array.isArray(remoteItems) ? remoteItems : []).forEach(consider);

  const result = [];
  merged.forEach((item, id) => {
    const tombstonedAt = Number(tombstones[id]) || 0;
    // Edit wins over a stale delete; a delete newer than the item removes it.
    if (tombstonedAt > itemUpdatedAt(item)) {
      return;
    }
    result.push(item);
  });
  return result;
}

// Merge two tombstone maps by per-id max timestamp.
function mergeTombstones(localDeleted, remoteDeleted) {
  const merged = {};
  const absorb = (map) => {
    if (!map || typeof map !== "object") {
      return;
    }
    Object.keys(map).forEach((id) => {
      const at = Number(map[id]) || 0;
      if (at > (merged[id] || 0)) {
        merged[id] = at;
      }
    });
  };
  absorb(localDeleted);
  absorb(remoteDeleted);
  return merged;
}

// Merge grocery check state. Each key has a parallel `checkedAt` timestamp; the
// newer write per key wins. This keeps a just-unchecked item from being
// resurrected by an older remote check (and vice versa). Keys present on only
// one side are carried over with their own timestamp.
function mergeGroceryChecked(localChecked, localCheckedAt, remoteChecked, remoteCheckedAt) {
  const local = localChecked && typeof localChecked === "object" ? localChecked : {};
  const remote = remoteChecked && typeof remoteChecked === "object" ? remoteChecked : {};
  const localAt = localCheckedAt && typeof localCheckedAt === "object" ? localCheckedAt : {};
  const remoteAt = remoteCheckedAt && typeof remoteCheckedAt === "object" ? remoteCheckedAt : {};

  const checked = {};
  const checkedAt = {};
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)]);

  keys.forEach((key) => {
    const lAt = Number(localAt[key]) || 0;
    const rAt = Number(remoteAt[key]) || 0;
    let value;
    if (rAt > lAt) {
      value = Boolean(remote[key]);
    } else if (lAt > rAt) {
      value = Boolean(local[key]);
    } else {
      // Tie (including legacy data with no timestamps): union the checks so a
      // check that predates timestamps is never silently dropped.
      value = Boolean(local[key] || remote[key]);
    }
    const at = Math.max(lAt, rAt);
    if (value) {
      checked[key] = true;
    }
    if (at) {
      checkedAt[key] = at;
    }
  });

  return { checked, checkedAt };
}

// Merge appliedImports by union.
function mergeAppliedImports(localImports, remoteImports) {
  const merged = new Set();
  (Array.isArray(localImports) ? localImports : []).forEach((id) => merged.add(id));
  (Array.isArray(remoteImports) ? remoteImports : []).forEach((id) => merged.add(id));
  return [...merged];
}

// Drop tombstones older than TOMBSTONE_MAX_AGE_MS so the map does not grow
// forever. Called on save.
function pruneTombstones(deletedItems) {
  if (!deletedItems || typeof deletedItems !== "object") {
    return {};
  }
  const cutoff = nowMs() - TOMBSTONE_MAX_AGE_MS;
  const pruned = {};
  Object.keys(deletedItems).forEach((id) => {
    const at = Number(deletedItems[id]) || 0;
    if (at >= cutoff) {
      pruned[id] = at;
    }
  });
  return pruned;
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
      groceryCheckedAt: parsed.groceryCheckedAt || {},
      appliedImports: parsed.appliedImports || [],
      deletedItems: parsed.deletedItems || {},
      selectedDate: parsed.selectedDate || toIso(new Date()),
      activeTab: getInitialActiveTab(parsed.activeTab || "planner"),
      updatedAt: parsed.updatedAt || Date.now(),
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
    groceryCheckedAt: {},
    appliedImports: [],
    deletedItems: {},
    selectedDate: toIso(new Date()),
    updatedAt: Date.now(),
  };
}

function createSyncState() {
  return {
    deviceId: getDeviceId(),
    settings: loadSyncSettings(),
    status: "local",
    message: "Saved on this device.",
    db: null,
    docRef: null,
    firestore: null,
    unsubscribe: null,
    pushTimer: null,
    currentHouseholdId: "",
    receivedFirstSnapshot: false,
    isApplyingRemote: false,
  };
}

function applyBuiltInImports(nextState) {
  const appliedImports = Array.isArray(nextState.appliedImports) ? nextState.appliedImports : [];
  let changed = false;
  nextState.appliedImports = appliedImports;
  const deletedItems =
    nextState.deletedItems && typeof nextState.deletedItems === "object"
      ? nextState.deletedItems
      : {};

  nextState.homeIngredients = Array.isArray(nextState.homeIngredients)
    ? nextState.homeIngredients
    : [];
  nextState.recipes = Array.isArray(nextState.recipes) ? nextState.recipes : SAMPLE_RECIPES;
  nextState.chloeFavorites = Array.isArray(nextState.chloeFavorites)
    ? nextState.chloeFavorites
    : [];

  if (!nextState.appliedImports.includes(PANTRY_PHOTO_IMPORT_ID)) {
    parseIngredientLines(PANTRY_PHOTO_IMPORT_LINES).forEach((item) => {
      if (mergeHomeIngredient(nextState.homeIngredients, item)) {
        changed = true;
      }
    });
    nextState.appliedImports = [...nextState.appliedImports, PANTRY_PHOTO_IMPORT_ID];
    changed = true;
  }

  if (!nextState.appliedImports.includes(FAMILY_FAVORITES_IMPORT_ID)) {
    FAMILY_FAVORITE_RECIPES.forEach((recipe) => {
      if (mergeRecipe(nextState.recipes, recipe, deletedItems)) {
        changed = true;
      }
    });
    FAMILY_FAVORITE_FOODS.forEach((favorite) => {
      if (mergeChloeFavorite(nextState.chloeFavorites, favorite)) {
        changed = true;
      }
    });
    nextState.appliedImports = [...nextState.appliedImports, FAMILY_FAVORITES_IMPORT_ID];
    changed = true;
  }

  if (!nextState.appliedImports.includes(CHLOE_FOODS_IMPORT_ID)) {
    CHLOE_FOODS_RECIPES.forEach((recipe) => {
      if (mergeRecipe(nextState.recipes, recipe, deletedItems)) {
        changed = true;
      }
    });
    CHLOE_FOODS_FAVORITES.forEach((favorite) => {
      if (mergeChloeFavorite(nextState.chloeFavorites, favorite)) {
        changed = true;
      }
    });
    nextState.appliedImports = [...nextState.appliedImports, CHLOE_FOODS_IMPORT_ID];
    changed = true;
  }

  if (changed) {
    nextState.updatedAt = Date.now();
  }

  return { state: nextState, changed };
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
  const seededAt = nowMs();
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
      updatedAt: seededAt,
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
      updatedAt: seededAt,
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
      updatedAt: seededAt,
    },
  ];
}

function saveState() {
  state.updatedAt = Date.now();
  state.deletedItems = pruneTombstones(state.deletedItems);
  persistState(state);
  queueSyncPush();
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
  els.quickPickList.addEventListener("click", handleWeekClick);
  els.recipeForm.addEventListener("submit", handleRecipeSubmit);
  els.recipeImportForm.addEventListener("submit", handleRecipeImportSubmit);
  els.cancelRecipeEdit.addEventListener("click", () => {
    resetRecipeForm(true);
  });
  els.recipeSearch.addEventListener("input", renderRecipes);
  els.recipeFilter.addEventListener("change", renderRecipes);
  els.recipeList.addEventListener("click", handleRecipeClick);
  els.homeIngredientForm.addEventListener("submit", handleHomeIngredientSubmit);
  els.bulkHomeForm.addEventListener("submit", handleBulkHomeSubmit);
  els.chloeFavoriteForm.addEventListener("submit", handleChloeFavoriteSubmit);
  els.syncForm.addEventListener("submit", handleSyncSubmit);
  els.syncNow.addEventListener("click", handleSyncNow);
  els.disconnectSync.addEventListener("click", handleSyncDisconnect);
  els.exportBackup.addEventListener("click", handleExportBackup);
  els.importBackup.addEventListener("click", () => {
    els.importBackupFile.click();
  });
  els.importBackupFile.addEventListener("change", handleImportBackupFile);
  els.chloeFavoriteList.addEventListener("click", handleChloeFavoriteClick);
  els.homeIngredientList.addEventListener("click", handleHomeIngredientClick);
  els.homeRecommendations.addEventListener("click", handleRecommendationClick);
  els.manualGroceryForm.addEventListener("submit", handleManualGrocerySubmit);
  els.groceryList.addEventListener("change", handleGroceryChange);
  els.groceryList.addEventListener("click", handleGroceryClick);
  els.clearCheckedGroceries.addEventListener("click", () => {
    const clearedAt = nowMs();
    if (!state.groceryCheckedAt || typeof state.groceryCheckedAt !== "object") {
      state.groceryCheckedAt = {};
    }
    // Stamp every cleared key so the un-check wins over an older remote check.
    Object.keys(state.groceryChecked).forEach((key) => {
      state.groceryCheckedAt[key] = clearedAt;
    });
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
  renderSyncStatus();
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
      return `<option value="${escapeAttribute(iso)}">${escapeHtml(formatDayOption(date))}</option>`;
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
      .map((recipe) => `<option value="${escapeAttribute(recipe.id)}">${escapeHtml(recipe.name)}</option>`),
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
  // Decorate each recipe with its analysis and score once, so sorting does not
  // re-run analyzeRecipe (pantry fuzzy matching) per comparison.
  const decorated = state.recipes
    .filter((recipe) => !plannedRecipeIds.has(recipe.id))
    .map((recipe) => {
      const analysis = analyzeRecipe(recipe);
      return { recipe, analysis, score: scoreRecipeForHome(recipe, analysis) };
    })
    .sort((a, b) => b.score - a.score);

  const rotated = rotateArray(decorated, quickOffset).slice(0, 4);

  if (!rotated.length) {
    els.quickPickList.innerHTML = `<div class="empty-state"><strong>Week is full</strong><span>Favorites are already planned.</span></div>`;
    return;
  }

  els.quickPickList.innerHTML = rotated
    .map(
      ({ recipe, analysis }) => {
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
            <button class="add-button" type="button" data-action="quick-add" data-id="${escapeAttribute(recipe.id)}" aria-label="Add ${escapeAttribute(recipe.name)}">+</button>
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
      const dayMealCount = meals.filter((meal) => meal.date === iso).length;
      const hasMeals = dayMealCount > 0;
      const selected = iso === selectedIso;

      return `
        <button class="day-pill ${selected ? "selected" : ""}" type="button" data-action="select-day" data-date="${escapeAttribute(iso)}">
          <span>${escapeHtml(formatDate(date, { weekday: "short" }).slice(0, 1))}</span>
          <strong>${escapeHtml(formatDate(date, { day: "numeric" }))}</strong>
          ${hasMeals ? `<em>${dayMealCount}</em>` : ""}
        </button>
      `;
    })
    .join("");

  const mealCards = selectedMeals.length
    ? selectedMeals.map(renderMealCard).join("")
    : `<div class="empty-state"><strong>No meal yet</strong><span>Ready for a plan.</span><button class="add-day-button" type="button" data-action="set-day" data-date="${escapeAttribute(selectedIso)}">Add dinner</button></div>`;

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
        <button class="small-button" type="button" data-action="toggle-done" data-id="${escapeAttribute(meal.id)}">${meal.done ? "Undo" : "Done"}</button>
        <button class="small-button" type="button" data-action="edit-meal" data-id="${escapeAttribute(meal.id)}">Edit</button>
        <button class="small-button" type="button" data-action="remove-meal" data-id="${escapeAttribute(meal.id)}">Remove</button>
      </div>
    </article>
  `;
}

function renderRecipes() {
  const query = els.recipeSearch.value.trim().toLowerCase();
  const filter = els.recipeFilter.value;
  const useHomeScore = Boolean(state.homeIngredients.length || state.chloeFavorites.length);
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
    // Decorate each recipe with its analysis (and score, when needed for
    // sorting) once, so sorting and rendering do not re-run analyzeRecipe
    // (pantry fuzzy matching) per comparison.
    .map((recipe) => {
      const analysis = analyzeRecipe(recipe);
      return { recipe, analysis, score: useHomeScore ? scoreRecipeForHome(recipe, analysis) : 0 };
    })
    .sort((a, b) => {
      if (useHomeScore) {
        return b.score - a.score;
      }
      return a.recipe.name.localeCompare(b.recipe.name);
    });

  if (!recipes.length) {
    els.recipeList.innerHTML = `<div class="empty-wide"><strong>No recipes found</strong></div>`;
    return;
  }

  els.recipeList.innerHTML = recipes
    .map(({ recipe, analysis }) => {
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
            <button class="small-button" type="button" data-action="plan-recipe" data-id="${escapeAttribute(recipe.id)}">Plan this week</button>
            <button class="small-button" type="button" data-action="edit-recipe" data-id="${escapeAttribute(recipe.id)}">Edit</button>
            <button class="small-button" type="button" data-action="delete-recipe" data-id="${escapeAttribute(recipe.id)}">Delete</button>
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
    els.groceryList.innerHTML = `<div class="empty-wide"><strong>No groceries yet</strong><span>Plan meals or add an item.</span></div>`;
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
          ? `<button class="small-button" type="button" data-action="remove-grocery" data-id="${escapeAttribute(item.manualId)}">Remove</button>`
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

  const grocerySummaryHtml = items.length ? renderGrocerySummary(items) : "";
  const alreadyHomeHtml = renderAlreadyHomeSection(alreadyHome);
  els.groceryList.innerHTML = `${grocerySummaryHtml}${groceryHtml}${alreadyHomeHtml}`;
}

function renderGrocerySummary(items) {
  const checkedCount = items.filter((item) => Boolean(state.groceryChecked[item.key])).length;
  const totalCount = items.length;
  const percent = totalCount ? Math.round((checkedCount / totalCount) * 100) : 0;
  const remaining = totalCount - checkedCount;
  const remainingText = remaining === 1 ? "1 left" : `${remaining} left`;

  return `
    <section class="grocery-summary" aria-label="Shopping progress">
      <div class="grocery-summary-top">
        <span>Shopping progress</span>
        <strong>${escapeHtml(remainingText)}</strong>
      </div>
      <div class="grocery-progress" aria-hidden="true">
        <span style="width: ${percent}%"></span>
      </div>
    </section>
  `;
}

function renderHome() {
  renderHomeRecommendations();
  renderChloeFavoriteList();
  renderHomeIngredientList();
}

function renderSyncStatus() {
  if (!els.syncStatus || !els.syncBadge) {
    return;
  }

  if (document.activeElement !== els.syncHouseholdId) {
    els.syncHouseholdId.value = syncState.settings.householdId || "";
  }

  els.syncStatus.textContent = syncState.message;
  if (els.appSyncLine) {
    els.appSyncLine.textContent = syncState.settings.enabled
      ? syncState.message
      : "Saved on this device";
  }
  els.syncBadge.textContent = getSyncBadgeLabel();
  els.syncBadge.className = `sync-badge ${syncState.status}`;
  els.syncNow.disabled = syncState.status === "syncing";
  els.disconnectSync.classList.toggle("hidden", !syncState.settings.enabled);
}

function getSyncBadgeLabel() {
  if (syncState.status === "synced") {
    return "Synced";
  }
  if (syncState.status === "syncing") {
    return "Syncing";
  }
  if (syncState.status === "ready") {
    return "Ready";
  }
  if (syncState.status === "error") {
    return "Needs setup";
  }
  return "Local";
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
            <button class="small-button" type="button" data-action="plan-recipe" data-id="${escapeAttribute(recipe.id)}">Plan this week</button>
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
          <button class="small-button" type="button" data-action="remove-favorite" data-id="${escapeAttribute(favorite.id)}">Remove</button>
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
            <button class="small-button" type="button" data-action="toggle-use-soon" data-id="${escapeAttribute(item.id)}">${item.useSoon ? "Unmark" : "Use soon"}</button>
            <button class="small-button" type="button" data-action="remove-home" data-id="${escapeAttribute(item.id)}">Remove</button>
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
    showToast("Add a meal name or pick a recipe");
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
    updatedAt: nowMs(),
  };

  if (editingId) {
    state.planItems = state.planItems.map((item) => (item.id === editingId ? meal : item));
  } else {
    state.planItems.push(meal);
  }

  state.selectedDate = meal.date;
  resetMealForm(false);
  saveAndRender();
  showToast(editingId ? "Meal updated" : "Meal added");
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
    touchItem(meal);
    saveAndRender();
    showToast(meal.done ? "Meal marked done" : "Meal reopened");
  }

  if (action === "edit-meal") {
    fillMealForm(meal);
  }

  if (action === "remove-meal") {
    state.planItems = state.planItems.filter((item) => item.id !== id);
    tombstoneItem(id);
    saveAndRender();
    showToast("Meal removed");
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
    updatedAt: nowMs(),
  };

  if (!recipe.name) {
    showToast("Add a recipe name");
    els.recipeName.focus();
    return;
  }

  if (editingId) {
    state.recipes = state.recipes.map((item) => (item.id === editingId ? recipe : item));
    state.planItems = state.planItems.map((meal) => {
      if (meal.recipeId !== editingId) {
        return meal;
      }
      return touchItem({ ...meal, title: recipe.name });
    });
  } else {
    state.recipes.push(recipe);
  }

  resetRecipeForm(false);
  saveAndRender();
  showToast(editingId ? "Recipe updated" : "Recipe saved");
}

function handleRecipeImportSubmit(event) {
  event.preventDefault();

  const importedRecipe = parseRecipeImport(els.recipeImportText.value);
  if (!importedRecipe) {
    els.recipeImportStatus.textContent = "Paste a recipe with a name and ingredients.";
    els.recipeImportText.focus();
    return;
  }

  touchItem(importedRecipe);
  state.recipes.push(importedRecipe);
  els.recipeImportText.value = "";
  els.recipeImportStatus.textContent = `Imported ${importedRecipe.name}.`;
  els.recipeSearch.value = "";
  els.recipeFilter.value = "all";
  resetRecipeForm(false);
  state.activeTab = "recipes";
  saveAndRender();
  showToast("Recipe imported");
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
    tombstoneItem(id);
    state.planItems = state.planItems.map((meal) =>
      meal.recipeId === id ? touchItem({ ...meal, recipeId: null }) : meal,
    );
    saveAndRender();
    showToast("Recipe deleted");
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
  showToast("Pantry updated");
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
  showToast(`${items.length} pantry ${items.length === 1 ? "item" : "items"} added`);
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
  showToast("Favorite added");
}

function handleSyncSubmit(event) {
  event.preventDefault();

  const householdId = normalizeHouseholdId(els.syncHouseholdId.value);
  if (!householdId) {
    setSyncStatus("error", "Add a household code first.");
    els.syncHouseholdId.focus();
    return;
  }

  syncState.settings = {
    ...syncState.settings,
    enabled: true,
    householdId,
  };
  saveSyncSettings(syncState.settings);
  disconnectSyncListener();
  showToast("Connecting sync");
  initializeSync();
}

function handleSyncNow() {
  const householdId = normalizeHouseholdId(els.syncHouseholdId.value || syncState.settings.householdId);
  if (!householdId) {
    setSyncStatus("error", "Add a household code first.");
    els.syncHouseholdId.focus();
    return;
  }

  syncState.settings = {
    ...syncState.settings,
    enabled: true,
    householdId,
  };
  saveSyncSettings(syncState.settings);

  if (!syncState.docRef) {
    showToast("Connecting sync");
    initializeSync();
    return;
  }

  showToast("Syncing now");
  pushStateToCloud();
}

function handleSyncDisconnect() {
  syncState.settings = {
    ...syncState.settings,
    enabled: false,
    householdId: syncState.settings.householdId || "",
  };
  saveSyncSettings(syncState.settings);
  disconnectSyncListener();
  setSyncStatus("local", "Saved on this device.");
  showToast("Sync paused");
}

// Build the JSON backup document for the current state: every synced field
// plus enough metadata to identify and validate the file on import.
function buildBackupDocument() {
  const updatedAt = state.updatedAt || Date.now();
  return {
    app: "family-food-planner",
    appVersion: APP_CACHE_VERSION,
    exportedAt: new Date().toISOString(),
    updatedAt,
    state: serializeSyncedState(updatedAt),
  };
}

function backupFileName(date) {
  return `food-planner-backup-${toIso(date)}.json`;
}

function handleExportBackup() {
  const backup = buildBackupDocument();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = backupFileName(new Date());
  link.click();
  URL.revokeObjectURL(url);
  showToast("Backup exported");
}

// Parse and validate a backup JSON string, returning { ok: true, sanitized }
// or { ok: false, message } for a toast. Does not touch app state; callers
// merge `sanitized` into state with mergeSyncedState. Exported logic is kept
// standalone (no DOM) so it can be exercised directly by tests.
function parseBackupFile(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    return { ok: false, message: "That file is not valid JSON." };
  }

  if (!parsed || typeof parsed !== "object" || parsed.app !== "family-food-planner") {
    return { ok: false, message: "That file is not a Family Food Planner backup." };
  }

  const sanitized = sanitizeSyncedState(parsed.state || {});
  return { ok: true, sanitized };
}

// Merge a parsed+sanitized backup into `state` using the same per-item merge
// core as remote sync, so an old backup can never wipe newer local data.
// Returns the new state object; does not mutate the passed-in state.
function importBackupIntoState(currentState, jsonText, confirmFn) {
  const result = parseBackupFile(jsonText);
  if (!result.ok) {
    return result;
  }

  const confirmImport = confirmFn || (() => true);
  const confirmed = confirmImport(
    "Import this backup? It will be merged with what is already on this device (newer edits win, nothing already here is deleted).",
  );
  if (!confirmed) {
    return { ok: false, message: "Import cancelled." };
  }

  const mergedUpdatedAt = Math.max(
    Number(result.sanitized.updatedAt) || 0,
    Number(currentState.updatedAt) || 0,
  ) || Date.now();
  const merged = mergeSyncedState(currentState, result.sanitized, mergedUpdatedAt);

  return {
    ok: true,
    state: {
      ...currentState,
      ...merged,
    },
  };
}

function handleImportBackupFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const outcome = importBackupIntoState(state, String(reader.result || ""), (message) => window.confirm(message));
    if (!outcome.ok) {
      showToast(outcome.message || "Could not import that backup");
      return;
    }
    state = outcome.state;
    saveAndRender();
    showToast("Backup imported");
  };
  reader.onerror = () => {
    showToast("Could not read that file");
  };
  reader.readAsText(file);
}

function handleChloeFavoriteClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-favorite") {
    state.chloeFavorites = state.chloeFavorites.filter((item) => item.id !== button.dataset.id);
    tombstoneItem(button.dataset.id);
    saveAndRender();
    showToast("Favorite removed");
  }
}

function handleHomeIngredientClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-home") {
    state.homeIngredients = state.homeIngredients.filter((item) => item.id !== button.dataset.id);
    tombstoneItem(button.dataset.id);
    saveAndRender();
    showToast("Pantry item removed");
  }

  if (button.dataset.action === "toggle-use-soon") {
    const item = state.homeIngredients.find((entry) => entry.id === button.dataset.id);
    if (!item) {
      return;
    }
    item.useSoon = !item.useSoon;
    touchItem(item);
    saveAndRender();
    showToast(item.useSoon ? "Marked use soon" : "Use soon removed");
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
    updatedAt: nowMs(),
  });

  els.manualGroceryForm.reset();
  saveAndRender();
  showToast("Grocery added");
}

function handleGroceryChange(event) {
  const checkbox = event.target.closest('input[type="checkbox"][data-key]');
  if (!checkbox) {
    return;
  }

  setGroceryChecked(checkbox.dataset.key, checkbox.checked);
  saveAndRender();
}

// Update a grocery checkmark and stamp its checkedAt timestamp so the newer
// per-key write wins during merge. Unchecking clears the flag but keeps the
// (newer) timestamp so a stale remote check does not resurrect it.
function setGroceryChecked(key, checked) {
  if (!state.groceryCheckedAt || typeof state.groceryCheckedAt !== "object") {
    state.groceryCheckedAt = {};
  }
  if (checked) {
    state.groceryChecked[key] = true;
  } else {
    delete state.groceryChecked[key];
  }
  state.groceryCheckedAt[key] = nowMs();
}

function handleGroceryClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  if (button.dataset.action === "remove-grocery") {
    state.manualGroceries = state.manualGroceries.filter((item) => item.id !== button.dataset.id);
    tombstoneItem(button.dataset.id);
    const groceryKey = `manual|${button.dataset.id}`;
    delete state.groceryChecked[groceryKey];
    if (state.groceryCheckedAt) {
      state.groceryCheckedAt[groceryKey] = nowMs();
    }
    saveAndRender();
    showToast("Grocery removed");
  }
}

async function initializeSync() {
  if (!syncState.settings.enabled) {
    setSyncStatus("local", "Saved on this device.");
    return;
  }

  const householdId = normalizeHouseholdId(syncState.settings.householdId);
  if (!householdId) {
    setSyncStatus("error", "Add a household code first.");
    return;
  }

  syncState.settings.householdId = householdId;
  saveSyncSettings(syncState.settings);

  if (syncState.docRef && syncState.currentHouseholdId === householdId) {
    setSyncStatus("ready", `Connected to ${householdId}.`);
    return;
  }

  const firebaseConfig = getFirebaseConfig();
  if (!firebaseConfig) {
    setSyncStatus("error", "Firebase config missing.");
    return;
  }

  disconnectSyncListener();
  setSyncStatus("syncing", "Connecting shared sync...");

  try {
    const { appModule, firestoreModule } = await loadFirebaseModules();
    const app = appModule.getApps().length
      ? appModule.getApp()
      : appModule.initializeApp(firebaseConfig);

    syncState.db = firestoreModule.getFirestore(app);
    syncState.firestore = firestoreModule;
    syncState.currentHouseholdId = householdId;
    syncState.docRef = firestoreModule.doc(
      syncState.db,
      "households",
      householdId,
      "foodPlanner",
      "state",
    );
    syncState.receivedFirstSnapshot = false;
    syncState.unsubscribe = firestoreModule.onSnapshot(
      syncState.docRef,
      handleRemoteSnapshot,
      (error) => {
        console.warn("Shared sync stopped", error);
        setSyncStatus("error", "Sync needs Firebase access.");
      },
    );
  } catch (error) {
    console.warn("Could not start shared sync", error);
    setSyncStatus("error", "Sync needs Firebase access.");
  }
}

function disconnectSyncListener() {
  if (syncState.unsubscribe) {
    syncState.unsubscribe();
  }

  if (syncState.pushTimer) {
    window.clearTimeout(syncState.pushTimer);
  }

  syncState.db = null;
  syncState.docRef = null;
  syncState.firestore = null;
  syncState.unsubscribe = null;
  syncState.pushTimer = null;
  syncState.currentHouseholdId = "";
  syncState.receivedFirstSnapshot = false;
}

function handleRemoteSnapshot(snapshot) {
  const isFirstSnapshot = !syncState.receivedFirstSnapshot;
  syncState.receivedFirstSnapshot = true;
  const householdId = syncState.currentHouseholdId;
  const firstContact = isFirstSnapshot && !hasSyncedWithHousehold(householdId);

  if (!snapshot.exists()) {
    // No household document yet: this device seeds it. Record that we have
    // synced so a later snapshot is not treated as first contact.
    markSyncedWithHousehold(householdId);
    setSyncStatus("syncing", "Creating shared plan...");
    pushStateToCloud();
    return;
  }

  const data = snapshot.data() || {};
  const remoteState = data.state || {};
  const remoteUpdatedAt = Number(data.updatedAt || remoteState.updatedAt || 0);
  const localUpdatedAt = Number(state.updatedAt || 0);

  if (data.deviceId === syncState.deviceId) {
    markSyncedWithHousehold(householdId);
    setSyncStatus("synced", `Synced ${formatShortTime(new Date())}.`);
    return;
  }

  // First contact with a household this device has never synced with: never let
  // local seed data overwrite the household. Always merge (remote wins ties),
  // apply locally, and push the merged result back.
  if (firstContact) {
    applyRemoteState(remoteState, remoteUpdatedAt);
    markSyncedWithHousehold(householdId);
    setSyncStatus("syncing", "Merging shared plan...");
    queueSyncPush(0);
    return;
  }

  markSyncedWithHousehold(householdId);

  if (remoteUpdatedAt > localUpdatedAt) {
    // Remote is ahead: merge it in (keeping any newer local items) and, if the
    // merge produced anything the cloud does not have, push it back.
    applyRemoteState(remoteState, remoteUpdatedAt);
    setSyncStatus("synced", `Updated ${formatShortTime(new Date())}.`);
    return;
  }

  if (remoteUpdatedAt < localUpdatedAt) {
    // Local is ahead: still merge remote in so nothing on the cloud is lost,
    // then upload the merged result.
    applyRemoteState(remoteState, localUpdatedAt);
    setSyncStatus("syncing", "Uploading newer changes...");
    queueSyncPush(0);
    return;
  }

  setSyncStatus("synced", `Synced ${formatShortTime(new Date())}.`);
}

// Fields on a synced item that must be strings if present (everything else on
// the item is dropped except id/updatedAt/tags/steps/ingredients/etc, handled
// separately below).
const SANITIZED_ITEM_STRING_FIELDS = [
  "name",
  "title",
  "note",
  "chloeNote",
  "time",
  "slot",
  "date",
  "audience",
  "category",
  "unit",
  "amount",
];

function sanitizeString(value) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

// A synced item must be a plain object with a usable string id. Everything
// else is best-effort coerced so a malformed remote/imported document cannot
// inject unexpected shapes (or, downstream, unescaped HTML) into local state.
function sanitizeSyncedItem(rawItem) {
  if (!rawItem || typeof rawItem !== "object") {
    return null;
  }

  const id = sanitizeString(rawItem.id).trim();
  if (!id) {
    return null;
  }

  const item = { id };

  SANITIZED_ITEM_STRING_FIELDS.forEach((field) => {
    if (rawItem[field] !== undefined) {
      item[field] = sanitizeString(rawItem[field]);
    }
  });

  if (rawItem.updatedAt !== undefined) {
    item.updatedAt = Number(rawItem.updatedAt) || 0;
  }
  if (rawItem.done !== undefined) {
    item.done = Boolean(rawItem.done);
  }
  if (rawItem.useSoon !== undefined) {
    item.useSoon = Boolean(rawItem.useSoon);
  }
  if (rawItem.servings !== undefined) {
    const servings = Number(rawItem.servings);
    item.servings = Number.isFinite(servings) ? servings : "";
  }
  if (rawItem.recipeId !== undefined) {
    item.recipeId = rawItem.recipeId === null ? null : sanitizeString(rawItem.recipeId);
  }

  if (Array.isArray(rawItem.tags)) {
    item.tags = rawItem.tags.map(sanitizeString);
  }
  if (Array.isArray(rawItem.steps)) {
    item.steps = rawItem.steps.map(sanitizeString);
  }
  if (Array.isArray(rawItem.ingredients)) {
    item.ingredients = rawItem.ingredients.map(sanitizeSyncedItem).filter(Boolean);
  }
  if (Array.isArray(rawItem.extraGroceries)) {
    item.extraGroceries = rawItem.extraGroceries.map(sanitizeSyncedItem).filter(Boolean);
  }

  return item;
}

// Sanitize an array field of a synced collection: must be an array of plain
// objects with a usable id; anything else is dropped.
function sanitizeSyncedCollection(rawCollection) {
  if (!Array.isArray(rawCollection)) {
    return [];
  }
  return rawCollection.map(sanitizeSyncedItem).filter(Boolean);
}

// Sanitize a map-shaped field (groceryChecked, groceryCheckedAt, deletedItems):
// plain object, boolean-ish or numeric-ish values depending on `valueType`.
function sanitizeSyncedMap(rawMap, valueType) {
  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) {
    return {};
  }
  const result = {};
  Object.keys(rawMap).forEach((key) => {
    const cleanKey = sanitizeString(key).trim();
    if (!cleanKey) {
      return;
    }
    if (valueType === "boolean") {
      if (rawMap[key]) {
        result[cleanKey] = true;
      }
    } else {
      const num = Number(rawMap[key]);
      if (num) {
        result[cleanKey] = num;
      }
    }
  });
  return result;
}

// Sanitize a whole synced state payload (from remote sync or an imported JSON
// backup) before it is ever merged into local state. Coerces every known
// collection/map to its expected shape and drops anything unexpected, so a
// malformed or attacker-shaped document cannot inject bad data (or, via
// unescaped rendering, HTML) into the app.
function sanitizeSyncedState(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const clean = {};

  MERGED_ITEM_COLLECTIONS.forEach((field) => {
    clean[field] = sanitizeSyncedCollection(source[field]);
  });

  clean.groceryChecked = sanitizeSyncedMap(source.groceryChecked, "boolean");
  clean.groceryCheckedAt = sanitizeSyncedMap(source.groceryCheckedAt, "number");
  clean.deletedItems = sanitizeSyncedMap(source.deletedItems, "number");
  clean.appliedImports = Array.isArray(source.appliedImports)
    ? source.appliedImports.map(sanitizeString).filter(Boolean)
    : [];

  if (source.updatedAt !== undefined) {
    clean.updatedAt = Number(source.updatedAt) || 0;
  }

  return clean;
}

// Build the per-item merge of the local state with a remote synced state.
// Every collection is merged by item id (newer item updatedAt wins, tombstones
// remove); groceryChecked merges per key by checkedAt; appliedImports unions;
// deletedItems merges by per-id max. View state stays local. Returns the merged
// synced fields plus the new updatedAt; does not mutate `state`.
function mergeSyncedState(localState, remoteState, mergedUpdatedAt) {
  const remote = remoteState && typeof remoteState === "object" ? remoteState : {};

  const deletedItems = mergeTombstones(localState.deletedItems, remote.deletedItems);

  const merged = {
    deletedItems,
    appliedImports: mergeAppliedImports(localState.appliedImports, remote.appliedImports),
  };

  MERGED_ITEM_COLLECTIONS.forEach((field) => {
    const localItems = localState[field];
    const remoteItems = Object.prototype.hasOwnProperty.call(remote, field)
      ? remote[field]
      : localItems;
    merged[field] = mergeItemArrays(localItems, remoteItems, deletedItems);
  });

  const groceries = mergeGroceryChecked(
    localState.groceryChecked,
    localState.groceryCheckedAt,
    remote.groceryChecked,
    remote.groceryCheckedAt,
  );
  merged.groceryChecked = groceries.checked;
  merged.groceryCheckedAt = groceries.checkedAt;

  merged.updatedAt = mergedUpdatedAt || Date.now();
  return merged;
}

function applyRemoteState(remoteState, remoteUpdatedAt) {
  if (!remoteState || typeof remoteState !== "object") {
    return;
  }

  syncState.isApplyingRemote = true;
  const localView = {
    activeTab: state.activeTab,
    selectedDate: state.selectedDate,
    weekStart: state.weekStart,
  };

  // Remote sync data can contain attacker-shaped strings; sanitize before it
  // ever touches local state or rendering.
  const sanitizedRemote = sanitizeSyncedState(remoteState);
  const mergedUpdatedAt = Math.max(
    Number(remoteUpdatedAt) || 0,
    Number(state.updatedAt) || 0,
  ) || Date.now();
  const merged = mergeSyncedState(state, sanitizedRemote, mergedUpdatedAt);

  state = {
    ...state,
    ...merged,
    ...localView,
  };
  persistState(state);
  render();
  syncState.isApplyingRemote = false;
}

function queueSyncPush(delay = SYNC_SAVE_DEBOUNCE_MS) {
  if (!syncState.settings.enabled || syncState.isApplyingRemote) {
    return;
  }

  if (syncState.pushTimer) {
    window.clearTimeout(syncState.pushTimer);
  }

  syncState.pushTimer = window.setTimeout(() => {
    pushStateToCloud();
  }, delay);
}

async function pushStateToCloud() {
  if (!syncState.settings.enabled || syncState.isApplyingRemote) {
    return;
  }

  if (!syncState.docRef || !syncState.firestore) {
    initializeSync();
    return;
  }

  const updatedAt = state.updatedAt || Date.now();
  setSyncStatus("syncing", "Syncing household plan...");

  try {
    await syncState.firestore.setDoc(
      syncState.docRef,
      {
        app: "family-food-planner",
        appVersion: APP_CACHE_VERSION,
        deviceId: syncState.deviceId,
        householdId: syncState.currentHouseholdId,
        updatedAt,
        state: serializeSyncedState(updatedAt),
        savedAt: syncState.firestore.serverTimestamp(),
      },
      { merge: true },
    );
    setSyncStatus("synced", `Synced ${formatShortTime(new Date())}.`);
  } catch (error) {
    console.warn("Could not sync household plan", error);
    setSyncStatus("error", "Sync needs Firebase access.");
  }
}

async function loadFirebaseModules() {
  const [appModule, firestoreModule] = await Promise.all([
    import(FIREBASE_APP_URL),
    import(FIREBASE_FIRESTORE_URL),
  ]);
  return { appModule, firestoreModule };
}

function serializeSyncedState(updatedAt) {
  const synced = {
    updatedAt,
  };
  SYNCED_STATE_FIELDS.forEach((field) => {
    const value = state[field];
    if (value !== undefined) {
      synced[field] = value;
    } else if (field === "groceryChecked" || field === "groceryCheckedAt" || field === "deletedItems") {
      synced[field] = {};
    } else {
      synced[field] = [];
    }
  });
  return JSON.parse(JSON.stringify(synced));
}

function getFirebaseConfig() {
  const config = window.FOOD_PLANNER_FIREBASE_CONFIG;
  if (!config || typeof config !== "object") {
    return null;
  }

  if (!config.apiKey || !config.projectId || !config.appId) {
    return null;
  }

  return config;
}

function setSyncStatus(status, message) {
  syncState.status = status;
  syncState.message = message;
  renderSyncStatus();
}

function showToast(message) {
  if (!els.toast) {
    return;
  }

  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => {
    els.toast.classList.add("hidden");
  }, 2200);
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
    updatedAt: nowMs(),
  });

  state.activeTab = "planner";
  state.selectedDate = date;
  saveAndRender();
  showToast(`${recipe.name} planned`);
}

function addHomeIngredient(item) {
  mergeHomeIngredient(state.homeIngredients, item);
}

function mergeRecipe(recipes, recipe, deletedItems) {
  const tombstones = deletedItems && typeof deletedItems === "object" ? deletedItems : {};
  // Do not resurrect a seeded recipe the family deleted (its id is tombstoned).
  if (recipe.id && tombstones[recipe.id]) {
    return false;
  }

  const existing = recipes.find((item) => {
    return item.id === recipe.id || ingredientNamesMatch(item.name, recipe.name);
  });
  if (existing) {
    return false;
  }

  recipes.push(touchItem({ ...recipe }));
  return true;
}

function mergeChloeFavorite(favorites, item) {
  const cleanName = item.name.trim();
  if (!cleanName) {
    return false;
  }

  const existing = favorites.find((favorite) => ingredientNamesMatch(favorite.name, cleanName));
  if (existing) {
    existing.note = item.note || existing.note;
    touchItem(existing);
    return false;
  }

  favorites.push({
    id: createId(),
    name: cleanName,
    note: item.note || "",
    updatedAt: nowMs(),
  });
  return true;
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
    updatedAt: nowMs(),
  };
  const existing = homeIngredients.find((entry) => ingredientNamesMatch(entry.name, next.name));

  if (existing) {
    existing.amount = next.amount || existing.amount;
    existing.unit = next.unit || existing.unit;
    existing.category = next.category || existing.category;
    existing.useSoon = existing.useSoon || next.useSoon;
    touchItem(existing);
    return false;
  }

  homeIngredients.push(next);
  return true;
}

function addChloeFavorite(item) {
  mergeChloeFavorite(state.chloeFavorites, item);
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
    .map((recipe) => {
      const analysis = analyzeRecipe(recipe);
      return {
        recipe,
        analysis,
        score: scoreRecipeForHome(recipe, analysis),
      };
    })
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

function scoreRecipeForHome(recipe, precomputedAnalysis) {
  const analysis = precomputedAnalysis || analyzeRecipe(recipe);
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

function parseRecipeImport(value) {
  const lines = String(value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => cleanImportedLine(line))
    .filter(Boolean);

  if (!lines.length) {
    return null;
  }

  const ingredientHeadingIndex = lines.findIndex(isIngredientHeading);
  const stepHeadingIndex = lines.findIndex(isStepHeading);
  const name = findImportedRecipeName(lines, ingredientHeadingIndex, stepHeadingIndex);
  if (!name) {
    return null;
  }

  const ingredientLines = getImportedIngredientLines(lines, ingredientHeadingIndex, stepHeadingIndex);
  const ingredients = ingredientLines
    .map((line) => parseImportedIngredientLine(line))
    .filter(Boolean);

  if (!ingredients.length) {
    return null;
  }

  const steps = getImportedStepLines(lines, stepHeadingIndex, ingredientHeadingIndex);
  const text = lines.join(" ");
  const minutes = extractMinutes(text);
  const tags = inferRecipeTags(name, text, minutes);

  return {
    id: createId(),
    name,
    time: minutes ? `${minutes} min` : "",
    servings: extractServings(text),
    tags,
    chloeNote: "",
    ingredients,
    steps,
  };
}

function findImportedRecipeName(lines, ingredientHeadingIndex, stepHeadingIndex) {
  const stopIndex = Math.min(
    ...[ingredientHeadingIndex, stepHeadingIndex].filter((index) => index >= 0),
    lines.length,
  );
  const candidates = lines.slice(0, Number.isFinite(stopIndex) ? stopIndex : lines.length);
  const title = candidates.find((line) => !isMetadataLine(line) && !isRecipeHeading(line));
  return title || lines.find((line) => !isRecipeHeading(line) && !isMetadataLine(line)) || "";
}

function getImportedIngredientLines(lines, ingredientHeadingIndex, stepHeadingIndex) {
  if (ingredientHeadingIndex >= 0) {
    const endIndex = stepHeadingIndex > ingredientHeadingIndex ? stepHeadingIndex : lines.length;
    return lines
      .slice(ingredientHeadingIndex + 1, endIndex)
      .filter((line) => !isRecipeHeading(line) && looksLikeIngredient(line));
  }

  const endIndex = stepHeadingIndex >= 0 ? stepHeadingIndex : lines.length;
  return lines.slice(1, endIndex).filter(looksLikeIngredient);
}

function getImportedStepLines(lines, stepHeadingIndex, ingredientHeadingIndex) {
  if (stepHeadingIndex >= 0) {
    return lines
      .slice(stepHeadingIndex + 1)
      .filter((line) => !isRecipeHeading(line))
      .map(cleanStepLine);
  }

  const startIndex = ingredientHeadingIndex >= 0 ? ingredientHeadingIndex + 1 : 1;
  return lines
    .slice(startIndex)
    .filter((line) => !looksLikeIngredient(line) && !isRecipeHeading(line))
    .map(cleanStepLine);
}

function parseImportedIngredientLine(line) {
  const cleanLine = normalizeFractions(line.replace(/\s+/g, " ").trim());
  if (!cleanLine) {
    return null;
  }

  if (cleanLine.includes("|")) {
    return parseIngredientLine(cleanLine);
  }

  return parseIngredientLine(`${cleanLine} | ${inferIngredientCategory(cleanLine)}`);
}

function cleanImportedLine(line) {
  return normalizeFractions(line)
    .replace(/^\s*[-*•]\s*/, "")
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanStepLine(line) {
  return line.replace(/^\s*(step\s*)?\d+[.)]\s*/i, "").trim();
}

function normalizeFractions(value) {
  return String(value || "")
    .replace(/¼/g, "1/4")
    .replace(/½/g, "1/2")
    .replace(/¾/g, "3/4")
    .replace(/⅓/g, "1/3")
    .replace(/⅔/g, "2/3")
    .replace(/⅛/g, "1/8");
}

function isRecipeHeading(line) {
  return isIngredientHeading(line) || isStepHeading(line) || /^(notes?|nutrition|equipment)$/i.test(cleanHeading(line));
}

function isIngredientHeading(line) {
  return /^(ingredients?|what you need)$/i.test(cleanHeading(line));
}

function isStepHeading(line) {
  return /^(instructions?|directions?|method|preparation|steps?)$/i.test(cleanHeading(line));
}

function cleanHeading(line) {
  return String(line || "")
    .replace(/[#*:]/g, "")
    .trim()
    .toLowerCase();
}

function isMetadataLine(line) {
  return /^(prep|cook|total|active)?\s*time\b/i.test(line) ||
    /^(serves|servings|yield|makes)\b/i.test(line) ||
    /^https?:\/\//i.test(line);
}

function looksLikeIngredient(line) {
  if (!line || isMetadataLine(line) || isRecipeHeading(line)) {
    return false;
  }

  const normalized = normalizeFractions(line.toLowerCase());
  return (
    /^\d/.test(normalized) ||
    /^(one|two|three|four|five|six|seven|eight|nine|ten|a|an)\b/.test(normalized) ||
    [...UNIT_WORDS].some((unit) => normalized.includes(` ${unit} `)) ||
    normalized.includes(" to taste") ||
    normalized.includes("optional")
  );
}

function extractMinutes(text) {
  const timeText = String(text || "").toLowerCase();
  const totalMatch =
    timeText.match(/total\s*time[:\s-]*([^.;\n]{1,40})/) ||
    timeText.match(/\b(\d+\s*(?:hours?|hrs?|h)\s*)?(\d+\s*(?:minutes?|mins?|min|m))\b/);

  if (!totalMatch) {
    return 0;
  }

  const value = totalMatch[1] || totalMatch[0];
  let minutes = 0;
  const hourMatch = value.match(/(\d+)\s*(hours?|hrs?|h)\b/);
  const minuteMatch = value.match(/(\d+)\s*(minutes?|mins?|min|m)\b/);
  if (hourMatch) {
    minutes += Number(hourMatch[1]) * 60;
  }
  if (minuteMatch) {
    minutes += Number(minuteMatch[1]);
  }
  return minutes;
}

function extractServings(text) {
  const match = String(text || "").match(/\b(?:serves|servings|yield|makes)[:\s-]*(\d+)/i);
  return match ? Number(match[1]) : "";
}

function inferRecipeTags(name, text, minutes) {
  const haystack = `${name} ${text}`.toLowerCase();
  const tags = new Set();
  if (minutes && minutes <= 30) {
    tags.add("quick");
  }
  if (/kid|toddler|family|children|chloe/.test(haystack)) {
    tags.add("kid-friendly");
  }
  if (/leftover|meal prep|make ahead/.test(haystack)) {
    tags.add("leftovers");
  }
  if (/sheet pan|one pan|one-pot|one pot|skillet/.test(haystack)) {
    tags.add("one-pan");
  }
  return [...tags];
}

function inferIngredientCategory(line) {
  const text = line.toLowerCase();
  if (/\bfrozen\b/.test(text)) {
    return "Frozen";
  }
  if (/\b(chicken|beef|turkey|pork|salmon|fish|shrimp|sausage|bacon|ham|steak)\b/.test(text)) {
    return "Meat";
  }
  if (/\b(milk|cheese|yogurt|egg|eggs|butter|cream|mozzarella|cheddar|parmesan)\b/.test(text)) {
    return "Dairy";
  }
  if (/\b(bread|bun|buns|tortilla|tortillas|bagel|pita)\b/.test(text)) {
    return "Bakery";
  }
  if (
    /\b(apple|apples|avocado|avocados|banana|bananas|berries|broccoli|carrot|carrots|celery|corn|cucumber|cucumbers|garlic|greens|lettuce|lemon|lime|mushroom|mushrooms|onion|onions|pepper|peppers|potato|potatoes|spinach|tomato|tomatoes|zucchini)\b/.test(
      text,
    )
  ) {
    return "Produce";
  }
  return "Pantry";
}

function parseIngredientLines(value) {
  return splitLines(value).map(parseIngredientLine).filter(Boolean);
}

function parseIngredientLine(line) {
  const [leftRaw, categoryRaw] = line.split("|");
  const left = normalizeFractions(leftRaw).trim();
  if (!left) {
    return null;
  }

  const tokens = left.split(/\s+/);
  let amount = "";
  let unit = "";

  if (tokens.length && parseAmount(tokens[0]) !== null) {
    amount = tokens.shift();
    if (tokens.length && /^\d+\/\d+$/.test(tokens[0])) {
      amount = `${amount} ${tokens.shift()}`;
    }
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

  if (/^\d+\s+\d+\/\d+$/.test(text)) {
    const [whole, fraction] = text.split(/\s+/);
    const [top, bottom] = fraction.split("/").map(Number);
    return bottom ? Number(whole) + top / bottom : null;
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

function loadSyncSettings() {
  try {
    const raw = localStorage.getItem(SYNC_SETTINGS_KEY);
    if (!raw) {
      return {
        enabled: false,
        householdId: "",
        hasSyncedWith: [],
      };
    }

    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed.enabled),
      householdId: normalizeHouseholdId(parsed.householdId),
      hasSyncedWith: Array.isArray(parsed.hasSyncedWith) ? parsed.hasSyncedWith : [],
    };
  } catch (error) {
    console.warn("Could not load sync settings", error);
    return {
      enabled: false,
      householdId: "",
      hasSyncedWith: [],
    };
  }
}

function saveSyncSettings(settings) {
  try {
    localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Could not save sync settings", error);
  }
}

// True once this device has completed at least one successful sync with the
// household. Used so the very first snapshot from a never-seen household never
// overwrites the household with local seed data.
function hasSyncedWithHousehold(householdId) {
  const list = syncState.settings.hasSyncedWith;
  return Array.isArray(list) && list.includes(householdId);
}

function markSyncedWithHousehold(householdId) {
  if (!householdId || hasSyncedWithHousehold(householdId)) {
    return;
  }
  const list = Array.isArray(syncState.settings.hasSyncedWith)
    ? syncState.settings.hasSyncedWith
    : [];
  syncState.settings.hasSyncedWith = [...list, householdId];
  saveSyncSettings(syncState.settings);
}

function getDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }

    const deviceId = createId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
    return deviceId;
  } catch (error) {
    return createId();
  }
}

function normalizeHouseholdId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
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
  const longerWords = longer.split(" ");
  const longerWordSet = new Set(longerWords);
  const shorterWords = shorter.split(" ");
  // In English compounds the LAST word is the head noun: "shredded cheese" IS
  // cheese (match ok), but "corn starch" is starch, not corn (no match). Require
  // the longer name's head noun to be one of the shorter name's words, on top of
  // the existing word-subset check. This deliberately prefers false negatives
  // (item still shows on the grocery list) over false positives (item silently
  // missing from it).
  const headNoun = longerWords[longerWords.length - 1];
  if (
    shorterWords.length &&
    shorterWords.every((word) => word.length >= 3 && longerWordSet.has(word)) &&
    shorterWords.includes(headNoun)
  ) {
    return true;
  }
  return false;
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

function formatShortTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
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

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Could not register food planner service worker", error);
    });
  });
}
