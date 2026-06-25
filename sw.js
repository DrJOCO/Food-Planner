const CACHE_NAME = "family-food-planner-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=7",
  "./app.js?v=7",
  "./firebase-config.js?v=7",
  "./manifest.webmanifest?v=7",
  "./assets/app-icon.svg",
  "./assets/kitchen-planning-banner.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (requestUrl.pathname.endsWith("/firebase-config.js")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(
            (cachedResponse) =>
              cachedResponse ||
              new Response("window.FOOD_PLANNER_FIREBASE_CONFIG = null;", {
                headers: {
                  "Content-Type": "text/javascript",
                },
              }),
          ),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
          return response;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
