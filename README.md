# Family Food Planner

A simple browser app for weekly family meal planning, Chloe meal variations, and grocery lists.

## Open the app

Open `index.html` in a browser. No install step is required.

## Test the app logic

Run the regression harness with Node:

```sh
node --test tests/regression.test.mjs
```

The tests load the production browser script in a stubbed DOM and cover recipe import parsing, ingredient parsing, generated groceries, ingredient-matching (so compound pantry items like "corn starch" don't hide unrelated recipe ingredients like "corn"), per-item merge sync (first-connect merge, concurrent edits, and deletion tombstones), and JSON backup import (app-id rejection, JSON-parse errors, and merge-without-overwrite).

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
- Export a full JSON backup and import one back in, merged safely into whatever is already on the device.

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

Sync merges per item rather than replacing the whole plan, so two phones editing at the same time (or offline) keep both sets of changes: every recipe, meal, pantry item, favorite, and grocery is matched by id and the most recently edited version wins. Deletions are tracked as tombstones so a removed item propagates to every phone instead of reappearing, while an item edited after it was deleted survives (edit wins over a stale delete); tombstones are pruned after 60 days. Grocery checkmarks merge per item by when each was last (un)checked. When a phone connects to a household for the very first time it always merges with whatever is already in the cloud instead of overwriting it, so a brand-new device can never wipe an established household's data.

Firestore security rules live in `firestore.rules`: reads and app-shaped writes require knowing the household code, household codes cannot be listed or enumerated, and every other path is denied. Deploy rule changes with:

```sh
npx firebase-tools deploy --only firestore:rules --project chloecookbook
```

Because the household code is the only secret, pick one that is long and not guessable.

### Backup export and import

The Kitchen tab's Shared sync panel also has **Export backup** and **Import backup** buttons. Export downloads the full synced state (recipes, meal plans, pantry, Chloe favorites, manual groceries, grocery checkmarks, tombstones) as a `food-planner-backup-YYYY-MM-DD.json` file. Import reads a backup file, rejects anything that is not a Family Food Planner export or not valid JSON, asks for confirmation, and then merges it into the current device with the same per-item merge used by shared sync — so importing an old backup can only add or update items with a newer timestamp, never delete or overwrite newer local data.

## Cache version

`index.html`, `sw.js`, and `app.js` each hard-code the same cache-busting version number (`?v=N` on asset URLs, the service worker `CACHE_NAME`, and `APP_CACHE_VERSION`). Run `node scripts/bump-version.mjs <N>` to update all of them at once instead of editing them by hand; the script fails loudly if it cannot find an expected spot in any of the three files, so a rename or refactor can never leave one of them silently stuck on an old version.

## Design handoff

`design_handoff_food_planner/` is treated as a local reference export and is ignored by Git. Keep the root `index.html`, `styles.css`, `app.js`, service worker, manifest, and assets as the production source of truth.

## Next useful upgrades

- Add household login and private shared access.
- Add AI weekly plan suggestions once the family recipe library has real examples.
