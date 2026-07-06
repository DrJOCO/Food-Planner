const CACHE_NAME = "family-food-planner-v12";
const FONTS_CACHE_NAME = "family-food-planner-fonts-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=12",
  "./app.js?v=12",
  "./firebase-config.js?v=12",
  "./manifest.webmanifest?v=12",
  "./assets/app-icon.svg",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/kitchen-planning-banner.png",
];
const FONT_ORIGINS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
// Caches this service worker owns; anything else found on activate is a stale
// version and gets deleted.
const OWNED_CACHE_NAMES = [CACHE_NAME, FONTS_CACHE_NAME];

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
      .then((keys) =>
        Promise.all(keys.filter((key) => !OWNED_CACHE_NAMES.includes(key)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// Stale-while-revalidate: serve the cached font response immediately if we
// have one, and refresh the cache in the background so the next offline load
// gets whatever is newest. Falls through to the network (or a cache miss) on
// the very first request.
function handleFontRequest(request) {
  return caches.open(FONTS_CACHE_NAME).then((cache) =>
    cache.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    }),
  );
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (FONT_ORIGINS.includes(requestUrl.origin)) {
    event.respondWith(handleFontRequest(event.request));
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (
    event.request.mode === "navigate" ||
    requestUrl.pathname.endsWith("/") ||
    requestUrl.pathname.endsWith("/index.html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put("./index.html", responseCopy);
          });
          return response;
        })
        .catch(() => caches.match("./index.html")),
    );
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
        .catch(() =>
          // Only navigations should ever fall back to index.html. This request
          // was for a specific asset (CSS/JS/image/etc) with no cache entry, so
          // there is nothing useful to serve; fail the request instead of
          // returning HTML where the caller expects its real asset.
          Response.error(),
        );
    }),
  );
});
