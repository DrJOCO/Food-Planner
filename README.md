# Family Food Planner

A simple browser app for weekly family meal planning, Chloe meal variations, and grocery lists.

## Open the app

Open `index.html` in a browser. No install step is required.

## Test the app logic

Run the regression harness with Node:

```sh
node --test tests/regression.test.mjs
```

The tests load the production browser script in a stubbed DOM and cover recipe import parsing, ingredient parsing, generated groceries, and remote sync merging.

## What works now

- Plan meals by week.
- Add recipe meals or simple meals.
- Import recipes from pasted text.
- Mark meals as `Everyone`, `Adults`, or `Chloe version`.
- Save Chloe notes per meal or recipe.
- Track Chloe's favorite foods and use them in recommendations.
- Generate a grocery list from planned recipes.
- Track ingredients already at home.
- Recommend recipes based on what is already at home.
- Show which planned ingredients are already at home.
- Add manual grocery items.
- Check off grocery items while shopping.
- Add, edit, delete, and search recipes.
- Install the app to a phone or desktop as a PWA.
- Use offline after the first load.
- Share household data with Firebase Firestore.

Data is saved in the browser with `localStorage`, so it works even before sync is connected.

## Shared sync

The app has a Firebase web config in `firebase-config.js` for the `chloecookbook` project. Replace that file if the app moves to another Firebase project:

```js
window.FOOD_PLANNER_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Use the same household code on each phone. Shared sync copies recipes, meal plans, pantry items, Chloe favorites, manual grocery items, and grocery checkmarks. The current tab and week view stay local to each phone.

Make sure Firestore security rules restrict household documents before sharing the app outside the family.

## Design handoff

`design_handoff_food_planner/` is treated as a local reference export and is ignored by Git. Keep the root `index.html`, `styles.css`, `app.js`, service worker, manifest, and assets as the production source of truth.

## Next useful upgrades

- Add household login and private shared access.
- Add AI weekly plan suggestions once the family recipe library has real examples.
