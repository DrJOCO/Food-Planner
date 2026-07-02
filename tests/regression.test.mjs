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

  addEventListener() {}

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
