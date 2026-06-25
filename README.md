# Family Food Planner

A simple browser app for weekly family meal planning, Chloe meal variations, and grocery lists.

## Open the app

Open `index.html` in a browser. No install step is required.

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
- Prepare shared household sync with Firebase.

Data is saved in the browser with `localStorage`, so it works even before sync is connected.

## Shared sync

The app is ready for Firebase Firestore sync. Add the Firebase web config in `firebase-config.js`:

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

Then use the same household code on each phone. Shared sync copies recipes, meal plans, pantry items, Chloe favorites, manual grocery items, and grocery checkmarks. The current tab and week view stay local to each phone.

## Next useful upgrades

- Create the Firebase project and security rules for household sync.
- Add household login and private shared access.
- Add AI weekly plan suggestions once the family recipe library has real examples.
