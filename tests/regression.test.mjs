import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

class ElementStub {
  constructor(selector, dataset = {}) {
    this.selector = selector;
    this.dataset = dataset;
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.required = false;
    this.innerHTML = "";
    this.textContent = "";
    this.className = "";
    this.classNames = new Set();
    this.classList = {
      add: (...names) => {
        names.forEach((name) => this.classNames.add(name));
        this.syncClassName();
      },
      remove: (...names) => {
        names.forEach((name) => this.classNames.delete(name));
        this.syncClassName();
      },
      toggle: (name, force) => {
        const shouldAdd = force === undefined ? !this.classNames.has(name) : Boolean(force);
        if (shouldAdd) {
          this.classNames.add(name);
        } else {
          this.classNames.delete(name);
        }
        this.syncClassName();
        return shouldAdd;
      },
      contains: (name) => this.classNames.has(name),
    };
  }

  syncClassName() {
    this.className = [...this.classNames].join(" ");
  }

  addEventListener(type, handler) {
    this.listeners = this.listeners || {};
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(handler);
  }

  focus() {
    this.focused = true;
  }

  reset() {
    this.value = "";
    this.checked = false;
  }

  scrollIntoView() {}

  closest() {
    return null;
  }
}

async function createHarness() {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const elements = new Map();
  const storage = new Map();
  let idCounter = 0;

  const defaults = new Map([
    ["#mealSlot", "Dinner"],
    ["#mealAudience", "Everyone"],
    ["#recipeFilter", "all"],
    ["#homeIngredientCategory", "Produce"],
    ["#manualGroceryCategory", "Produce"],
  ]);

  const getElement = (selector) => {
    if (!elements.has(selector)) {
      const element = new ElementStub(selector);
      if (defaults.has(selector)) {
        element.value = defaults.get(selector);
      }
      elements.set(selector, element);
    }
    return elements.get(selector);
  };

  const tabButtons = ["planner", "recipes", "home", "groceries"].map(
    (tab) => new ElementStub(`tab:${tab}`, { tab }),
  );
  const views = ["planner", "recipes", "home", "groceries"].map(
    (view) => new ElementStub(`view:${view}`, { view }),
  );

  const document = {
    activeElement: null,
    querySelector: getElement,
    querySelectorAll(selector) {
      if (selector === ".tab-button") {
        return tabButtons;
      }
      if (selector === ".view") {
        return views;
      }
      return [];
    },
  };

  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  const window = {
    document,
    localStorage,
    location: { search: "" },
    FOOD_PLANNER_FIREBASE_CONFIG: null,
    crypto: {
      randomUUID() {
        idCounter += 1;
        return `test-id-${idCounter}`;
      },
    },
    addEventListener() {},
    setTimeout,
    clearTimeout,
    confirm: () => true,
    print() {},
  };

  const context = vm.createContext({
    console,
    window,
    document,
    localStorage,
    navigator: {},
    URLSearchParams,
    Intl,
    Date,
    Math,
    JSON,
    Map,
    Set,
    Promise,
    Number,
    String,
    Boolean,
    RegExp,
    setTimeout,
    clearTimeout,
    alert(message) {
      throw new Error(`Unexpected alert: ${message}`);
    },
  });

  vm.runInContext(source, context, { filename: "app.js" });
  return {
    context,
    run(expression) {
      return vm.runInContext(expression, context);
    },
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("ingredient lines preserve mixed fractions, units, and categories", async () => {
  const app = await createHarness();

  const ingredient = app.run('parseIngredientLine("1 1/2 cups rice | Pantry")');

  assert.equal(ingredient.amount, "1 1/2");
  assert.equal(ingredient.unit, "cups");
  assert.equal(ingredient.name, "rice");
  assert.equal(ingredient.category, "Pantry");
  assert.equal(app.run('parseAmount("1 1/2")'), 1.5);
});

test("ingredient matching requires the head noun so compound pantry items don't shadow unrelated recipe ingredients", async () => {
  const app = await createHarness();

  const noMatch = (left, right) =>
    app.run(`ingredientNamesMatch(${JSON.stringify(left)}, ${JSON.stringify(right)})`);

  // False positives from the old loose rules: a pantry item whose compound name
  // ends in an unrelated head noun must NOT hide the recipe ingredient.
  assert.equal(noMatch("corn", "corn starch"), false);
  assert.equal(noMatch("rice", "rice vinegar"), false);
  assert.equal(noMatch("garlic", "garlic powder"), false);

  // Real matches must still work: head noun matches, plain plural/singular, and
  // exact matches.
  assert.equal(noMatch("cheese", "shredded cheese"), true);
  assert.equal(noMatch("rice", "cooked rice"), true);
  assert.equal(noMatch("carrots", "carrot"), true);
  assert.equal(noMatch("rice", "rice"), true);
});

test("pasted recipes import name, timing, servings, tags, and inferred categories", async () => {
  const app = await createHarness();
  app.context.__recipeText = `
Chicken Rice Bowls
Total time: 25 min
Servings: 4

Ingredients
- 1 lb chicken breast
- 2 cups rice
- 1 cup broccoli

Instructions
1. Cook rice.
2. Sear chicken.
`;

  const recipe = app.run("parseRecipeImport(__recipeText)");

  assert.equal(recipe.name, "Chicken Rice Bowls");
  assert.equal(recipe.time, "25 min");
  assert.equal(recipe.servings, 4);
  assert.deepEqual(plain(recipe.tags), ["quick"]);
  assert.deepEqual(
    plain(recipe.ingredients.map((item) => [item.name, item.category])),
    [
      ["chicken breast", "Meat"],
      ["rice", "Pantry"],
      ["broccoli", "Produce"],
    ],
  );
  assert.deepEqual(plain(recipe.steps), ["Cook rice.", "Sear chicken."]);
});

test("generated groceries merge recipe amounts and skip pantry matches", async () => {
  const app = await createHarness();
  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "planner",
      selectedDate: "2026-06-22",
      recipes: [
        {
          id: "r1",
          name: "Rice bowls",
          time: "30 min",
          servings: 4,
          tags: ["quick"],
          chloeNote: "",
          ingredients: [
            ingredient("1", "lb", "chicken", "Meat"),
            ingredient("2", "cups", "rice", "Pantry")
          ],
          steps: []
        },
        {
          id: "r2",
          name: "Chicken broccoli",
          time: "20 min",
          servings: 4,
          tags: ["quick"],
          chloeNote: "",
          ingredients: [
            ingredient("0.5", "lb", "chicken", "Meat"),
            ingredient("1", "cup", "broccoli", "Produce")
          ],
          steps: []
        }
      ],
      planItems: [
        { id: "m1", date: "2026-06-22", slot: "Dinner", recipeId: "r1", title: "Rice bowls", audience: "Everyone", chloeNote: "", extraGroceries: [], done: false },
        { id: "m2", date: "2026-06-23", slot: "Dinner", recipeId: "r2", title: "Chicken broccoli", audience: "Everyone", chloeNote: "", extraGroceries: [], done: false }
      ],
      homeIngredients: [{ id: "h1", name: "rice", amount: "1", unit: "bag", category: "Pantry", useSoon: false }],
      chloeFavorites: [],
      manualGroceries: [{ id: "g1", name: "bananas", amount: "6", unit: "", category: "Produce" }],
      groceryChecked: {},
      appliedImports: [],
      updatedAt: 1
    };
  `);

  const groceries = app.run("buildGroceryItems()");
  const names = groceries.map((item) => item.name);
  const chicken = groceries.find((item) => item.name === "chicken");

  assert.ok(!names.includes("rice"));
  assert.equal(app.run("formatGroceryItem(buildGroceryItems().find((item) => item.name === 'chicken'))"), "1.5 lb chicken");
  assert.deepEqual(plain(chicken.sources), ["Rice bowls", "Chicken broccoli"]);
  assert.ok(names.includes("broccoli"));
  assert.ok(names.includes("bananas"));
});

test("remote sync applies shared fields while keeping local view state", async () => {
  const app = await createHarness();
  app.context.__remoteState = {
    updatedAt: 99,
    recipes: [{ id: "remote-recipe", name: "Remote soup", tags: [], ingredients: [], steps: [] }],
    planItems: [],
    chloeFavorites: [{ id: "favorite", name: "soup", note: "" }],
    homeIngredients: [{ id: "home", name: "carrots", amount: "2", unit: "", category: "Produce", useSoon: true }],
    manualGroceries: [{ id: "manual", name: "soap", amount: "", unit: "", category: "Household" }],
    groceryChecked: { "manual|manual": true },
    appliedImports: ["remote-import"],
  };

  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "groceries",
      selectedDate: "2026-06-24",
      recipes: [],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      appliedImports: [],
      updatedAt: 1
    };
    applyRemoteState(__remoteState, 123);
  `);

  const merged = app.run("state");

  assert.equal(merged.activeTab, "groceries");
  assert.equal(merged.weekStart, "2026-06-22");
  assert.equal(merged.selectedDate, "2026-06-24");
  assert.equal(merged.updatedAt, 123);
  assert.equal(merged.recipes[0].name, "Remote soup");
  assert.equal(merged.homeIngredients[0].name, "carrots");
  assert.equal(merged.groceryChecked["manual|manual"], true);
});

test("built-in Chloe foods import seeds recipes and favorites without duplicates", async () => {
  const app = await createHarness();
  const state = app.run("state");

  assert.ok(state.appliedImports.includes("chloe-foods-2026-07-01"));

  const recipeNames = plain(state.recipes.map((recipe) => recipe.name));
  ["Protein pasta", "Turkey sandwich", "Rice cooker beef, corn, and rice"].forEach((name) => {
    assert.ok(recipeNames.includes(name), `missing recipe: ${name}`);
  });

  const favoriteNames = plain(
    state.chloeFavorites.map((favorite) => favorite.name.toLowerCase()),
  );
  ["blackberries", "papaya", "apple", "cherries", "zucchini", "cucumber"].forEach((name) => {
    assert.ok(favoriteNames.includes(name), `missing favorite: ${name}`);
  });

  const strawberryEntries = favoriteNames.filter((name) => name === "strawberries");
  assert.equal(strawberryEntries.length, 1);
});

test("quick idea buttons add the recipe to an open dinner slot", async () => {
  const app = await createHarness();

  const quickPickList = app.run('document.querySelector("#quickPickList")');
  const clickHandler = quickPickList.listeners?.click?.[0];
  assert.ok(clickHandler, "quick pick list has a click handler bound");

  const recipeId = app.run("state.recipes[0].id");
  const before = app.run("state.planItems.length");

  const button = { dataset: { action: "quick-add", id: recipeId } };
  clickHandler({ target: { closest: () => button } });

  assert.equal(app.run("state.planItems.length"), before + 1);
  const added = plain(app.run("state.planItems[state.planItems.length - 1]"));
  assert.equal(added.recipeId, recipeId);
  assert.equal(added.slot, "Dinner");
  assert.equal(app.run("state.activeTab"), "planner");
});

// Install a fake Firestore into syncState that captures every pushed document
// and drives one remote snapshot through handleRemoteSnapshot. Returns the last
// captured push payload (or null if nothing was pushed).
async function drySync(app, { snapshotData, householdId = "family", hasSyncedWith = [] }) {
  app.context.__snapshotData = snapshotData;
  app.context.__pushed = null;
  app.run(`
    syncState.settings = { enabled: true, householdId: ${JSON.stringify(householdId)}, hasSyncedWith: ${JSON.stringify(hasSyncedWith)} };
    syncState.currentHouseholdId = ${JSON.stringify(householdId)};
    syncState.receivedFirstSnapshot = false;
    syncState.deviceId = "local-device";
    syncState.docRef = { ref: true };
    syncState.firestore = {
      serverTimestamp: () => "server-time",
      setDoc: (ref, doc) => { __pushed = doc; return Promise.resolve(doc); },
    };
    handleRemoteSnapshot({
      exists: () => __snapshotData !== null,
      data: () => __snapshotData,
    });
  `);
  // Let the debounced queueSyncPush timer fire and the async setDoc resolve.
  await new Promise((resolve) => setTimeout(resolve, 20));
  return plain(app.run("__pushed"));
}

test("fresh device merges into an established household without clobbering it", async () => {
  const app = await createHarness();

  // Remote household has custom recipes and a plan item, edited long ago.
  app.context.__remote = {
    app: "family-food-planner",
    updatedAt: 1000,
    deviceId: "other-device",
    state: {
      updatedAt: 1000,
      recipes: [
        { id: "household-recipe", name: "Grandma stew", tags: [], ingredients: [], steps: [], updatedAt: 1000 },
      ],
      planItems: [
        { id: "household-meal", date: "2026-06-22", slot: "Dinner", recipeId: "household-recipe", title: "Grandma stew", audience: "Everyone", chloeNote: "", extraGroceries: [], done: false, updatedAt: 1000 },
      ],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: ["household-import"],
      deletedItems: {},
    },
  };

  // Fresh device: only a locally-added recipe, seeded/stamped just now (newer
  // state-level updatedAt than the household).
  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "planner",
      selectedDate: "2026-06-22",
      recipes: [{ id: "local-recipe", name: "My new dish", tags: [], ingredients: [], steps: [], updatedAt: 5000 }],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: {},
      updatedAt: 5000
    };
  `);

  const pushed = await drySync(app, { snapshotData: app.context.__remote });

  const merged = app.run("state");
  const recipeIds = plain(merged.recipes.map((recipe) => recipe.id)).sort();
  assert.deepEqual(recipeIds, ["household-recipe", "local-recipe"]);
  assert.equal(merged.planItems.length, 1);
  assert.equal(merged.planItems[0].id, "household-meal");

  // The pushed document must also carry the household data (nothing lost).
  assert.ok(pushed, "a merged push was uploaded");
  const pushedRecipeIds = pushed.state.recipes.map((recipe) => recipe.id).sort();
  assert.deepEqual(pushedRecipeIds, ["household-recipe", "local-recipe"]);
  assert.ok(pushed.state.planItems.some((meal) => meal.id === "household-meal"));
});

test("concurrent edits merge so both survive", async () => {
  const app = await createHarness();

  app.context.__remote = {
    app: "family-food-planner",
    updatedAt: 9000,
    deviceId: "other-device",
    state: {
      updatedAt: 9000,
      recipes: [],
      planItems: [],
      chloeFavorites: [{ id: "remote-fav", name: "mango", note: "", updatedAt: 9000 }],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: { "manual|remote-grocery": true },
      groceryCheckedAt: { "manual|remote-grocery": 9000 },
      appliedImports: [],
      deletedItems: {},
    },
  };

  // Local added a recipe offline (older state-level updatedAt than remote).
  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "planner",
      selectedDate: "2026-06-22",
      recipes: [{ id: "local-recipe", name: "Offline dish", tags: [], ingredients: [], steps: [], updatedAt: 8000 }],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: {},
      updatedAt: 8000
    };
  `);

  await drySync(app, {
    snapshotData: app.context.__remote,
    hasSyncedWith: ["family"],
  });

  const merged = app.run("state");
  assert.ok(merged.recipes.some((recipe) => recipe.id === "local-recipe"), "local recipe survives");
  assert.ok(
    merged.chloeFavorites.some((favorite) => favorite.id === "remote-fav"),
    "remote favorite survives",
  );
  assert.equal(merged.groceryChecked["manual|remote-grocery"], true);
});

test("deletion tombstones propagate and a newer edit wins over a stale delete", async () => {
  const app = await createHarness();

  // Remote tombstones a recipe the local side still has with an older stamp.
  app.context.__remote = {
    app: "family-food-planner",
    updatedAt: 9000,
    deviceId: "other-device",
    state: {
      updatedAt: 9000,
      recipes: [],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: { "doomed-recipe": 8000, "survivor-recipe": 3000 },
    },
  };

  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "planner",
      selectedDate: "2026-06-22",
      recipes: [
        { id: "doomed-recipe", name: "Old dish", tags: [], ingredients: [], steps: [], updatedAt: 1000 },
        { id: "survivor-recipe", name: "Kept dish", tags: [], ingredients: [], steps: [], updatedAt: 5000 }
      ],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: {},
      updatedAt: 4000
    };
  `);

  await drySync(app, {
    snapshotData: app.context.__remote,
    hasSyncedWith: ["family"],
  });

  let merged = app.run("state");
  const recipeIds = plain(merged.recipes.map((recipe) => recipe.id));
  // Tombstone (8000) newer than item (1000) removes it.
  assert.ok(!recipeIds.includes("doomed-recipe"), "tombstoned recipe removed");
  // Item edited (5000) after its tombstone (3000) survives.
  assert.ok(recipeIds.includes("survivor-recipe"), "edit newer than tombstone survives");
  // Tombstone is retained so a later merge does not resurrect the item.
  assert.equal(merged.deletedItems["doomed-recipe"], 8000);

  // A subsequent merge with the same remote must not bring the deleted item back.
  await drySync(app, {
    snapshotData: app.context.__remote,
    hasSyncedWith: ["family"],
  });
  merged = app.run("state");
  assert.ok(
    !merged.recipes.some((recipe) => recipe.id === "doomed-recipe"),
    "deleted recipe stays gone on re-merge",
  );
});

test("importing a JSON backup rejects the wrong app, sanitizes, and merges without wiping newer local data", async () => {
  const app = await createHarness();

  app.run(`
    state = {
      weekStart: "2026-06-22",
      activeTab: "planner",
      selectedDate: "2026-06-22",
      recipes: [
        { id: "local-recipe", name: "Local dish", tags: [], ingredients: [], steps: [], updatedAt: 5000 },
      ],
      planItems: [],
      chloeFavorites: [],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: {},
      updatedAt: 5000
    };
  `);

  // Wrong-app JSON is rejected with a message, not an exception.
  const wrongApp = app.run(`importBackupIntoState(state, ${JSON.stringify(JSON.stringify({ app: "some-other-app" }))}, () => true)`);
  assert.equal(wrongApp.ok, false);
  assert.match(wrongApp.message, /not a Family Food Planner backup/i);

  // Malformed JSON is rejected with a message, not an exception.
  const badJson = app.run(`importBackupIntoState(state, ${JSON.stringify("{not valid json")}, () => true)`);
  assert.equal(badJson.ok, false);
  assert.match(badJson.message, /not valid JSON/i);

  // A user declining the confirmation makes no changes.
  const declined = app.run(`importBackupIntoState(state, ${JSON.stringify(JSON.stringify({ app: "family-food-planner", state: {} }))}, () => false)`);
  assert.equal(declined.ok, false);

  // An old backup (stale updatedAt, and a malformed/extra-field entry that the
  // sanitizer must drop) merges in without deleting the newer local recipe.
  const backupDoc = {
    app: "family-food-planner",
    appVersion: "1",
    exportedAt: "2020-01-01T00:00:00.000Z",
    updatedAt: 1000,
    state: {
      updatedAt: 1000,
      recipes: [
        { id: "backup-recipe", name: "Backup dish", tags: [], ingredients: [], steps: [], updatedAt: 1000 },
        { name: "no id, should be dropped by the sanitizer" },
      ],
      planItems: [],
      chloeFavorites: [{ id: "backup-fav", name: "mango", note: "", updatedAt: 1000 }],
      homeIngredients: [],
      manualGroceries: [],
      groceryChecked: {},
      groceryCheckedAt: {},
      appliedImports: [],
      deletedItems: {},
    },
  };

  const outcome = app.run(
    `importBackupIntoState(state, ${JSON.stringify(JSON.stringify(backupDoc))}, () => true)`,
  );
  assert.equal(outcome.ok, true);

  const recipeIds = plain(outcome.state.recipes.map((recipe) => recipe.id)).sort();
  assert.deepEqual(recipeIds, ["backup-recipe", "local-recipe"], "backup merges in, local survives");
  assert.ok(
    outcome.state.chloeFavorites.some((favorite) => favorite.id === "backup-fav"),
    "backup favorite present after merge",
  );
  // Local was newer (5000 > 1000), so the merged updatedAt must not regress.
  assert.equal(outcome.state.updatedAt, 5000);
});
